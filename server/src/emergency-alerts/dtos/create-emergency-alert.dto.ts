import { IsString, IsOptional, IsNumber } from 'class-validator';

export class LocationDto {
	@IsNumber()
	latitude: number;

	@IsNumber()
	longitude: number;

	@IsString()
	@IsOptional()
	address?: string;
}

export class CreateEmergencyAlertDto {
	@IsString()
	@IsOptional()
	message?: string;

	@IsOptional()
	location?: LocationDto;
} 