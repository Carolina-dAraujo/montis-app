import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dtos';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('emergency-contacts')
@UseGuards(AuthGuard)
export class EmergencyContactsController {
	constructor(private readonly emergencyContactsService: EmergencyContactsService) { }

	@Post()
	async create(
		@Request() req,
		@Body() createEmergencyContactDto: CreateEmergencyContactDto
	): Promise<EmergencyContact> {
		return this.emergencyContactsService.create(req.user.uid, createEmergencyContactDto);
	}

	@Get()
	async findAll(@Request() req): Promise<EmergencyContact[]> {
		return this.emergencyContactsService.findAll(req.user.uid);
	}

	@Get(':id')
	async findOne(@Request() req, @Param('id') id: string): Promise<EmergencyContact> {
		return this.emergencyContactsService.findOne(req.user.uid, id);
	}

	@Patch(':id')
	async update(
		@Request() req,
		@Param('id') id: string,
		@Body() updateEmergencyContactDto: UpdateEmergencyContactDto
	): Promise<EmergencyContact> {
		return this.emergencyContactsService.update(req.user.uid, id, updateEmergencyContactDto);
	}

	@Delete(':id')
	async remove(@Request() req, @Param('id') id: string): Promise<{ message: string }> {
		await this.emergencyContactsService.remove(req.user.uid, id);
		return { message: 'Emergency contact removed successfully' };
	}

	@Patch(':id/toggle')
	async toggleActive(@Request() req, @Param('id') id: string): Promise<EmergencyContact> {
		return this.emergencyContactsService.toggleActive(req.user.uid, id);
	}
} 