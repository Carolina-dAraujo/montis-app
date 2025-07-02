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

	constructor(private configService: ConfigService) {}

	onModuleInit() {
		if (!firebaseAdmin.apps.length) {
			this.firebaseApp = firebaseAdmin.initializeApp({
				credential: firebaseAdmin.credential.applicationDefault(),
			});
		} else {
			this.firebaseApp = firebaseAdmin.app();
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
			console.log('FirebaseService - Updating user:', uid);
			console.log('FirebaseService - Properties:', properties);
			
			const result = await this.firebaseApp.auth().updateUser(uid, properties);
			console.log('FirebaseService - Update successful:', result.uid);
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
}
