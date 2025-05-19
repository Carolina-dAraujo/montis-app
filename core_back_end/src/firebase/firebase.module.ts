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
        const credentialsPath = configService.get<string>(
          "FIREBASE_CREDENTIALS_PATH",
        );
        if (!credentialsPath || !fs.existsSync(credentialsPath)) {
          throw new Error("Firebase credentials file not found");
        }

        const serviceAccount = JSON.parse(
          fs.readFileSync(credentialsPath, "utf8"),
        ) as firebaseAdmin.ServiceAccount;
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(serviceAccount),
        });

        return firebaseAdmin;
      },
    };

    return {
      module: FirebaseModule,
      providers: [firebaseConfigProvider, firebaseProvider, FirebaseService],
      exports: [firebaseConfigProvider, firebaseProvider, FirebaseService],
    };
  }
}
