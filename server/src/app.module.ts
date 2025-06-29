import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FirebaseModule } from "./firebase/firebase.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SobrietyModule } from "./sobriety/sobriety.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule.forRoot(),
    AuthModule,
    UsersModule,
    SobrietyModule,
    // TODO: Add more modules as the app grows:
    // - GoalsModule (for user goals and achievements)
    // - SupportModule (for support features)
    // - NotificationsModule (for push notifications)
    // - AnalyticsModule (for app analytics)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
