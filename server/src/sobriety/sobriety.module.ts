import { Module } from "@nestjs/common";
import { SobrietyController } from "./sobriety.controller";
import { SobrietyService } from "./sobriety.service";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
	imports: [FirebaseModule],
	controllers: [SobrietyController],
	providers: [SobrietyService],
	exports: [SobrietyService],
})
export class SobrietyModule {} 