import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEnum, IsDateString, ValidateIf } from 'class-validator';

export enum SobrietyGoal {
	ABSTINENCE = 'abstinence',
	REDUCTION = 'reduction',
	MAINTENANCE = 'maintenance'
}

export enum NotificationFrequency {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	NEVER = 'never'
}

export class OnboardingDto {
	@ApiProperty({ description: 'User display name', example: 'João da Silva' })
	@IsString()
	displayName: string;

	@ApiProperty({ description: 'User phone number', example: '(11) 99999-9990' })
	@ValidateIf((o) => o.phone !== undefined && o.phone !== null)
	@IsString()
	phone?: string;

	@ApiProperty({ description: 'User birth date', example: '1990-01-01' })
	@IsDateString()
	birthDate: string;

	@ApiProperty({ description: 'Sobriety goal', enum: SobrietyGoal })
	@IsEnum(SobrietyGoal)
	sobrietyGoal: SobrietyGoal;

	@ApiProperty({ description: 'Start date for sobriety tracking', example: '2024-01-01' })
	@ValidateIf((o) => o.sobrietyStartDate !== undefined && o.sobrietyStartDate !== null)
	@IsDateString()
	sobrietyStartDate?: string;

	@ApiProperty({ description: 'Last drink date', example: '2023-12-31' })
	@ValidateIf((o) => o.lastDrinkDate !== undefined && o.lastDrinkDate !== null)
	@IsDateString()
	lastDrinkDate?: string;

	@ApiProperty({ description: 'Enable daily reminders' })
	@IsBoolean()
	dailyReminders: boolean;

	@ApiProperty({ description: 'Notification frequency', enum: NotificationFrequency })
	@IsEnum(NotificationFrequency)
	notificationFrequency: NotificationFrequency;

	@ApiProperty({ description: 'Enable crisis support features' })
	@IsBoolean()
	crisisSupport: boolean;

	@ApiProperty({ description: 'Share progress with support network' })
	@IsBoolean()
	shareProgress: boolean;

	@ApiProperty({ description: 'Emergency contact name' })
	@ValidateIf((o) => o.emergencyContactName !== undefined && o.emergencyContactName !== null)
	@IsString()
	emergencyContactName?: string;

	@ApiProperty({ description: 'Emergency contact phone' })
	@ValidateIf((o) => o.emergencyContactPhone !== undefined && o.emergencyContactPhone !== null)
	@IsString()
	emergencyContactPhone?: string;

	@ApiProperty({ description: 'User address', example: 'Rua Exemplo, 123' })
	@ValidateIf((o) => o.address !== undefined && o.address !== null)
	@IsString()
	address?: string;

	@ApiProperty({ description: 'User city', example: 'São Paulo' })
	@ValidateIf((o) => o.city !== undefined && o.city !== null)
	@IsString()
	city?: string;

	@ApiProperty({ description: 'User neighborhood', example: 'Centro' })
	@ValidateIf((o) => o.neighborhood !== undefined && o.neighborhood !== null)
	@IsString()
	neighborhood?: string;

	@ApiProperty({ description: 'User CEP', example: '12345-678' })
	@ValidateIf((o) => o.cep !== undefined && o.cep !== null)
	@IsString()
	cep?: string;
}
