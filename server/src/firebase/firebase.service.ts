import * as firebaseAdmin from "firebase-admin";
import { Injectable, UnauthorizedException, OnModuleInit } from "@nestjs/common";
import { CreateRequest } from "firebase-admin/lib/auth/auth-config";
import { UpdateRequest } from "firebase-admin/lib/auth/auth-config";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class FirebaseService implements OnModuleInit {
	private firebaseApp: firebaseAdmin.app.App;
	private database: firebaseAdmin.database.Database;
	private storage: Storage;
	private bucketName: string = 'montis-892b4.appspot.com';

	constructor(private configService: ConfigService) { }

	onModuleInit() {
		// Firebase is already initialized by the module
		// Get the default app or the first available app
		if (firebaseAdmin.apps.length > 0) {
			this.firebaseApp = firebaseAdmin.app();
		} else {
			console.error('No Firebase apps found! Firebase may not be initialized properly.');
			const serviceAccount = require('../../firebase-credentials.json');
			this.firebaseApp = firebaseAdmin.initializeApp({
				credential: firebaseAdmin.credential.cert(serviceAccount),
				databaseURL: "https://montis-892b4-default-rtdb.firebaseio.com"
			});
		}

		this.database = this.firebaseApp.database();
		this.storage = new Storage();

		// Test Firebase connection
		this.testFirebaseConnection();
	}

	async testFirebaseConnection() {
		try {
			console.log('Testing Firebase Admin SDK connection...');
			const auth = this.firebaseApp.auth();
			console.log('Firebase Admin SDK initialized successfully');

			// Get project ID from credentials if not available in app options
			let projectId = this.firebaseApp.options.projectId;
			if (!projectId) {
				// Try to get it from the credential
				const credential = this.firebaseApp.options.credential as any;
				if (credential && credential.projectId) {
					projectId = credential.projectId;
				}
			}

			console.log('Firebase project ID:', projectId);

			// Test if we can access the auth service
			console.log('Firebase Auth service available:', !!auth);

			// List all initialized apps
			console.log('Number of Firebase apps:', firebaseAdmin.apps.length);
		} catch (error) {
			console.error('Firebase connection test failed:', error);
		}
	}

	async createUser(props: CreateRequest): Promise<UserRecord> {
		return await this.firebaseApp.auth().createUser(props);
	}

	async verifyIdToken(idToken: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
		try {
			return await this.firebaseApp.auth().verifyIdToken(idToken);
		} catch (error) {
			throw new UnauthorizedException("Invalid token");
		}
	}

	async getUserByEmail(email: string): Promise<UserRecord> {
		try {
			return await this.firebaseApp.auth().getUserByEmail(email);
		} catch (error) {
			throw new UnauthorizedException("User not found");
		}
	}

	async signInWithEmailAndPassword(email: string, password: string): Promise<{ userRecord: UserRecord; idToken: string }> {
		try {
			const apiKey = this.configService.get<string>("FIREBASE_API_KEY");
			if (!apiKey) {
				throw new Error('FIREBASE_API_KEY not configured');
			}

			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
				{
					email,
					password,
					returnSecureToken: true
				}
			);

			if (response.data && response.data.localId && response.data.idToken) {
				// Create a user record from the REST API response instead of using Admin SDK
				const userRecord: UserRecord = {
					uid: response.data.localId,
					email: response.data.email || email,
					emailVerified: response.data.emailVerified || false,
					displayName: response.data.displayName || email.split('@')[0],
					photoURL: response.data.photoUrl || null,
					phoneNumber: response.data.phoneNumber || null,
					disabled: false,
					metadata: {
						creationTime: response.data.createdAt || new Date().toISOString(),
						lastSignInTime: response.data.lastLoginAt || new Date().toISOString(),
						lastRefreshTime: new Date().toISOString(),
						toJSON: () => ({})
					},
					providerData: [],
					toJSON: () => ({})
				};

				return {
					userRecord,
					idToken: response.data.idToken
				};
			} else {
				throw new UnauthorizedException("Invalid credentials");
			}
		} catch (error) {
			console.error('Firebase Auth error:', error.response?.data || error.message);

			if (error.response?.data?.error?.message) {
				const errorMessage = error.response.data.error.message;

				if (errorMessage.includes('INVALID_PASSWORD') ||
					errorMessage.includes('EMAIL_NOT_FOUND') ||
					errorMessage.includes('INVALID_EMAIL')) {
					throw new UnauthorizedException("Invalid credentials");
				}

				if (errorMessage.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
					throw new UnauthorizedException("Too many login attempts. Try again later.");
				}
			}

			throw new UnauthorizedException("Invalid credentials");
		}
	}

	async createCustomToken(uid: string): Promise<string> {
		return await this.firebaseApp.auth().createCustomToken(uid);
	}

	async deleteUser(uid: string): Promise<void> {
		await this.firebaseApp.auth().deleteUser(uid);
	}

	async updateUser(uid: string, properties: UpdateRequest): Promise<UserRecord> {
		try {
			const result = await this.firebaseApp.auth().updateUser(uid, properties);

			return result;
		} catch (error) {
			console.error('FirebaseService - Update user error:', {
				message: error.message,
				code: error.code,
				stack: error.stack
			});
			throw error;
		}
	}

	async generateCustomToken(uid: string): Promise<string> {
		return await this.firebaseApp.auth().createCustomToken(uid);
	}

	async verifyUserCredentials(email: string, password: string): Promise<UserRecord> {
		// Use Firebase Auth REST API to verify credentials
		const apiKey = this.configService.get<string>("FIREBASE_API_KEY");
		if (!apiKey) {
			throw new Error('FIREBASE_API_KEY not configured');
		}

		try {
			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
				{
					email,
					password,
					returnSecureToken: false,
				}
			);

			if (response.data.localId) {
				return await this.getUserByEmail(email);
			} else {
				throw new Error('Invalid credentials');
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
				const errorMessage = error.response.data.error.message;
				if (errorMessage.includes('INVALID_PASSWORD') || errorMessage.includes('EMAIL_NOT_FOUND')) {
					throw new Error('Invalid credentials');
				}
			}
			throw error;
		}
	}

	async getUser(uid: string): Promise<UserRecord> {
		try {
			return await this.firebaseApp.auth().getUser(uid);
		} catch (error) {
			console.error('Firebase getUser error:', error);
			throw new UnauthorizedException("User not found");
		}
	}

	async exchangeCustomTokenForIdToken(customToken: string): Promise<string> {
		try {
			const apiKey = this.configService.get<string>("FIREBASE_API_KEY");
			if (!apiKey) {
				throw new Error('FIREBASE_API_KEY not configured');
			}

			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
				{
					token: customToken,
					returnSecureToken: true
				}
			);

			if (response.data && response.data.idToken) {
				return response.data.idToken;
			} else {
				throw new UnauthorizedException("Failed to exchange custom token");
			}
		} catch (error) {
			console.error('Token exchange error:', error.response?.data || error.message);
			throw new UnauthorizedException("Invalid custom token");
		}
	}

	async refreshIdToken(refreshToken: string): Promise<string> {
		try {
			const apiKey = this.configService.get<string>("FIREBASE_API_KEY");
			if (!apiKey) {
				throw new Error('FIREBASE_API_KEY not configured');
			}

			const response = await axios.post(
				`https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
				{
					grant_type: 'refresh_token',
					refresh_token: refreshToken
				}
			);

			if (response.data && response.data.id_token) {
				return response.data.id_token;
			} else {
				throw new UnauthorizedException("Failed to refresh token");
			}
		} catch (error) {
			console.error('Token refresh error:', error.response?.data || error.message);
			throw new UnauthorizedException("Invalid refresh token");
		}
	}

	async saveUserData(uid: string, data: any, path: string = ''): Promise<void> {
		try {
			const ref = this.database.ref(`users/${uid}${path ? '/' + path : ''}`);
			await ref.set(data);
		} catch (error) {
			console.error('Erro ao salvar dados no Firebase:', error);
			throw error;
		}
	}

	async getUserData(uid: string, path: string = ''): Promise<any> {
		try {
			const ref = this.database.ref(`users/${uid}${path ? '/' + path : ''}`);
			const snapshot = await ref.once('value');
			const data = snapshot.val();

			return data;
		} catch (error) {
			throw error;
		}
	}

	async updateUserData(uid: string, data: any, path: string = ''): Promise<void> {
		try {
			const ref = this.database.ref(`users/${uid}${path ? '/' + path : ''}`);
			await ref.update(data);
		} catch (error) {
			throw error;
		}
	}

	async deleteUserData(uid: string, path: string = ''): Promise<void> {
		try {
			const ref = this.database.ref(`users/${uid}${path ? '/' + path : ''}`);
			await ref.remove();
		} catch (error) {
			throw error;
		}
	}

	async saveOnboardingData(uid: string, onboardingData: any): Promise<void> {
		await this.saveUserData(uid, {
			...onboardingData,
			onboardingCompleted: true,
			onboardingCompletedAt: new Date().toISOString(),
		}, 'onboarding');
	}

	async getOnboardingData(uid: string): Promise<any> {
		return await this.getUserData(uid, 'onboarding');
	}

	async saveSobrietyData(uid: string, sobrietyData: any): Promise<void> {
		await this.saveUserData(uid, sobrietyData, 'sobriety');
	}

	async getSobrietyData(uid: string): Promise<any> {
		return await this.getUserData(uid, 'sobriety');
	}

	async savePreferences(uid: string, preferences: any): Promise<void> {
		await this.saveUserData(uid, preferences, 'preferences');
	}

	async getPreferences(uid: string): Promise<any> {
		return await this.getUserData(uid, 'preferences');
	}

	async getData(path: string): Promise<any> {
		try {
			const ref = this.database.ref(path);
			const snapshot = await ref.once('value');

			return snapshot.val();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Faz upload da imagem de perfil para o Firebase Storage e retorna a URL pública
	 */
	async uploadProfileImage(uid: string, file: any): Promise<string> {
		const ext = path.extname(file.originalname) || '.jpg';
		const destination = `users/${uid}/profile${ext}`;
		const bucket = this.storage.bucket(this.bucketName);
		const blob = bucket.file(destination);
		await blob.save(file.buffer, {
			contentType: file.mimetype,
			public: true,
			resumable: false,
			metadata: {
				cacheControl: 'public, max-age=31536000',
			},
		});
		// Torna o arquivo público
		await blob.makePublic();
		// Retorna a URL pública
		return `https://storage.googleapis.com/${this.bucketName}/${destination}`;
	}
}
