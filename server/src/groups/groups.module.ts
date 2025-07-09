import { Module } from "@nestjs/common";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
	imports: [FirebaseModule],
	controllers: [GroupsController],
	providers: [GroupsService],
	exports: [GroupsService],
})
export class GroupsModule {}
