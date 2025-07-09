import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EmergencyAlertsService } from './emergency-alerts.service';
import { CreateEmergencyAlertDto } from './dtos';
import { EmergencyAlert } from './entities/emergency-alert.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('emergency-alerts')
@UseGuards(AuthGuard)
export class EmergencyAlertsController {
	constructor(private readonly emergencyAlertsService: EmergencyAlertsService) { }

	@Post()
	async create(
		@Request() req,
		@Body() createEmergencyAlertDto: CreateEmergencyAlertDto
	): Promise<EmergencyAlert> {
		return this.emergencyAlertsService.create(req.user.uid, createEmergencyAlertDto);
	}

	@Get()
	async findAll(@Request() req): Promise<EmergencyAlert[]> {
		return this.emergencyAlertsService.findAll(req.user.uid);
	}

	@Get(':id')
	async findOne(@Request() req, @Param('id') id: string): Promise<EmergencyAlert> {
		return this.emergencyAlertsService.findOne(req.user.uid, id);
	}
} 