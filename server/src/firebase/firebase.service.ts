import * as firebaseAdmin from "firebase-admin";
import { Injectable, UnauthorizedException, OnModuleInit } from "@nestjs/common";
import { CreateRequest } from "firebase-admin/lib/auth/auth-config";
import { UpdateRequest } from "firebase-admin/lib/auth/auth-config";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class FirebaseService implements OnModuleInit {
	private firebaseApp: firebaseAdmin.app.App;
	private database: firebaseAdmin.database.Database;

	constructor(private configService: ConfigService) { }

	onModuleInit() {
		if (!firebaseAdmin.apps.length) {
			this.firebaseApp = firebaseAdmin.initializeApp({
				credential: firebaseAdmin.credential.applicationDefault(),
				databaseURL: "https://montis-892b4-default-rtdb.firebaseio.com"
			});
		} else {
			this.firebaseApp = firebaseAdmin.app();
		}

		this.database = this.firebaseApp.database();
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

	async signInWithEmailAndPassword(email: string, password: string): Promise<UserRecord> {
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
					returnSecureToken: false
				}
			);

			if (response.data && response.data.localId) {
				return await this.getUserByEmail(email);
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
		return await this.firebaseApp.auth().getUser(uid);
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
}
