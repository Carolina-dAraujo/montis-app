import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CrisisSeverity } from './create-crisis-log-entry.dto';

export class UpdateCrisisLogEntryDto {
	@IsEnum(CrisisSeverity)
	@IsOptional()
	severity?: CrisisSeverity;

	@IsString()
	@IsOptional()
	triggers?: string;

	@IsString()
	@IsOptional()
	symptoms?: string;

	@IsString()
	@IsOptional()
	copingStrategies?: string;

	@IsString()
	@IsOptional()
	notes?: string;

	@IsString()
	@IsOptional()
	date?: string;

	@IsString()
	@IsOptional()
	time?: string;
}
