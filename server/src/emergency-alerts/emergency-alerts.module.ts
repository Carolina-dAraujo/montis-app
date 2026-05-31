import { Module } from '@nestjs/common';
import { EmergencyAlertsController } from './emergency-alerts.controller';
import { EmergencyAlertsService } from './emergency-alerts.service';
import { EmergencyContactsModule } from '../emergency-contacts/emergency-contacts.module';

@Module({
	imports: [EmergencyContactsModule],
	controllers: [EmergencyAlertsController],
	providers: [EmergencyAlertsService],
	exports: [EmergencyAlertsService],
})

export class EmergencyAlertsModule {}
