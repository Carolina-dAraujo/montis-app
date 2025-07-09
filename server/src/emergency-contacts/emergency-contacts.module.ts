import { Module } from '@nestjs/common';
import { EmergencyContactsController } from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';

@Module({
	controllers: [EmergencyContactsController],
	providers: [EmergencyContactsService],
	exports: [EmergencyContactsService],
})
export class EmergencyContactsModule { }
