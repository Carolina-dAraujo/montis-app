import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CrisisSeverity {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export class CreateCrisisLogEntryDto {
	@IsEnum(CrisisSeverity)
	severity: CrisisSeverity;

	@IsString()
	triggers: string;

	@IsString()
	symptoms: string;

	@IsString()
	copingStrategies: string;

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
