import { Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
	imports: [FirebaseModule],
	providers: [AuthGuard],
	exports: [AuthGuard],
})
export class AuthModule {}
