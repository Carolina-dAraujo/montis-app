import { Global, Module, DynamicModule } from "@nestjs/common";
import * as firebaseAdmin from "firebase-admin";
import { FirebaseConfigService } from "./firebase-config.service";
import { ConfigService } from "@nestjs/config";
import { FirebaseService } from "./firebase.service";
import * as fs from "fs";

@Global()
@Module({})
export class FirebaseModule {
	static forRoot(): DynamicModule {
		const firebaseConfigProvider = {
			provide: FirebaseConfigService,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const apiKey = configService.get<string>("FIREBASE_API_KEY");
				if (!apiKey) {
					throw new Error("Firebase API key is not set");
				}
				return new FirebaseConfigService(apiKey);
			},
		};

		const firebaseProvider = {
			provide: "FIREBASE_ADMIN",
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				if (firebaseAdmin.apps.length > 0) {
					return firebaseAdmin;
				}

				const credentialsPath = configService.get<string>("FIREBASE_CREDENTIALS_PATH");
				const serviceAccountJson = configService.get<string>("FIREBASE_SERVICE_ACCOUNT");

				let serviceAccount: firebaseAdmin.ServiceAccount;

				if (serviceAccountJson) {
					try {
						serviceAccount = JSON.parse(serviceAccountJson);
					} catch (error) {
						throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT: ${error.message}`);
					}
				}
				else if (credentialsPath) {
					if (!fs.existsSync(credentialsPath)) {
						throw new Error(
							`Firebase credentials file not found at: ${credentialsPath}\n\n` +
							"To fix this:\n" +
							"1. Go to Firebase Console → Project Settings → Service Accounts\n" +
							"2. Click 'Generate new private key'\n" +
							"3. Save the JSON file as 'firebase-credentials.json' in the server directory\n" +
							"4. Make sure FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json in your .env file\n\n" +
							"OR\n\n" +
							"1. Copy the entire service account JSON content\n" +
							"2. Add it as FIREBASE_SERVICE_ACCOUNT in your .env file"
						);
					}

					try {
						serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
					} catch (error) {
						throw new Error(`Failed to parse Firebase credentials file: ${error.message}`);
					}
				} else {
					throw new Error(
						"Neither FIREBASE_CREDENTIALS_PATH nor FIREBASE_SERVICE_ACCOUNT is set.\n\n" +
						"Please set one of these in your .env file:\n" +
						"- FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json\n" +
						"- FIREBASE_SERVICE_ACCOUNT={\"type\":\"service_account\",...}"
					);
				}

				firebaseAdmin.initializeApp({
					credential: firebaseAdmin.credential.cert(serviceAccount),
					databaseURL: "https://montis-892b4-default-rtdb.firebaseio.com"
				});

				return firebaseAdmin;
			},
		};

		const firebaseServiceProvider = {
			provide: FirebaseService,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return new FirebaseService(configService);
			},
		};

		return {
			module: FirebaseModule,
			providers: [firebaseConfigProvider, firebaseProvider, firebaseServiceProvider],
			exports: [firebaseConfigProvider, firebaseProvider, FirebaseService],
		};
	}
}
