import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FirebaseModule } from "./firebase/firebase.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SobrietyModule } from "./sobriety/sobriety.module";
import { PreferencesModule } from "./preferences/preferences.module";
import { GroupsModule } from "./groups/groups.module";
import { EmergencyContactsModule } from "./emergency-contacts/emergency-contacts.module";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule.forRoot(),
    AuthModule,
    UsersModule,
    SobrietyModule,
    PreferencesModule,
    GroupsModule,
    EmergencyContactsModule,
    MulterModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
