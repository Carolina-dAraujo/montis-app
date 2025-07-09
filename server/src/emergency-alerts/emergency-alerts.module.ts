import { Module } from '@nestjs/common';
import { EmergencyAlertsController } from './emergency-alerts.controller';
import { EmergencyAlertsService } from './emergency-alerts.service';

@Module({
	controllers: [EmergencyAlertsController],
	providers: [EmergencyAlertsService],
	exports: [EmergencyAlertsService],
})
export class EmergencyAlertsModule {} 