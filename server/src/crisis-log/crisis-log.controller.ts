import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
	UseGuards,
	Request,
} from '@nestjs/common';
import { CrisisLogService } from './crisis-log.service';
import { CreateCrisisLogEntryDto, UpdateCrisisLogEntryDto } from './dtos';
import { CrisisLogEntry } from './entities/crisis-log-entry.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('crisis-log')
@UseGuards(AuthGuard)
export class CrisisLogController {
	constructor(private readonly crisisLogService: CrisisLogService) {}

	@Get()
	async findAll(@Request() req): Promise<CrisisLogEntry[]> {
		return this.crisisLogService.findAll(req.user.uid);
	}

	@Post()
	async create(
		@Request() req,
		@Body() createDto: CreateCrisisLogEntryDto,
	): Promise<CrisisLogEntry> {
		return this.crisisLogService.create(req.user.uid, createDto);
	}

	@Put(':id')
	async update(
		@Request() req,
		@Param('id') id: string,
		@Body() updateDto: UpdateCrisisLogEntryDto,
	): Promise<CrisisLogEntry> {
		return this.crisisLogService.update(req.user.uid, id, updateDto);
	}

	@Delete(':id')
	async remove(@Request() req, @Param('id') id: string): Promise<{ message: string }> {
		await this.crisisLogService.remove(req.user.uid, id);
		return { message: 'Crisis log entry removed successfully' };
	}
}
