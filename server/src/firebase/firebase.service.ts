import * as firebaseAdmin from "firebase-admin";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateRequest } from "firebase-admin/lib/auth/auth-config";
import { UpdateRequest } from "firebase-admin/lib/auth/auth-config";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import axios from "axios";

@Injectable()
export class FirebaseService {
	async createUser(props: CreateRequest): Promise<UserRecord> {
		return await firebaseAdmin.auth().createUser(props);
	}

	async verifyIdToken(idToken: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
		try {
			return await firebaseAdmin.auth().verifyIdToken(idToken);
		} catch (error) {
			throw new UnauthorizedException("Invalid token");
		}
	}

	async getUserByEmail(email: string): Promise<UserRecord> {
		try {
			return await firebaseAdmin.auth().getUserByEmail(email);
		} catch (error) {
			throw new UnauthorizedException("User not found");
		}
	}

	async signInWithEmailAndPassword(email: string, password: string): Promise<UserRecord> {
		try {
			const response = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
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
		return await firebaseAdmin.auth().createCustomToken(uid);
	}

	async deleteUser(uid: string): Promise<void> {
		await firebaseAdmin.auth().deleteUser(uid);
	}

	async updateUser(uid: string, properties: UpdateRequest): Promise<UserRecord> {
		return await firebaseAdmin.auth().updateUser(uid, properties);
	}
}
