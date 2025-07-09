import { IsBoolean, IsEnum, IsOptional, IsString, IsDateString, ValidateIf } from 'class-validator';
import { SobrietyGoal, NotificationFrequency as OnboardingNotificationFrequency } from '../../users/dtos/onboarding/onboarding.dto';

export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never',
}

export class UpdatePreferencesDto {
  @IsBoolean()
  dailyReminders: boolean;

  @IsEnum(NotificationFrequency)
  notificationFrequency: NotificationFrequency;

  @IsBoolean()
  crisisSupport: boolean;

  @IsBoolean()
  shareProgress: boolean;

  // Campos do onboarding (todos opcionais)
  @IsString()
  @ValidateIf((o) => o.displayName !== undefined)
  displayName?: string;

  @IsString()
  @ValidateIf((o) => o.phone !== undefined)
  phone?: string;

  @IsDateString()
  @ValidateIf((o) => o.birthDate !== undefined)
  birthDate?: string;

  @IsEnum(SobrietyGoal)
  @ValidateIf((o) => o.sobrietyGoal !== undefined)
  sobrietyGoal?: SobrietyGoal;

  @IsDateString()
  @ValidateIf((o) => o.sobrietyStartDate !== undefined)
  sobrietyStartDate?: string;

  @IsDateString()
  @ValidateIf((o) => o.lastDrinkDate !== undefined)
  lastDrinkDate?: string;

  @IsString()
  @ValidateIf((o) => o.emergencyContactName !== undefined)
  emergencyContactName?: string;

  @IsString()
  @ValidateIf((o) => o.emergencyContactPhone !== undefined)
  emergencyContactPhone?: string;

  @IsString()
  @ValidateIf((o) => o.address !== undefined)
  address?: string;

  @IsString()
  @ValidateIf((o) => o.city !== undefined)
  city?: string;

  @IsString()
  @ValidateIf((o) => o.neighborhood !== undefined)
  neighborhood?: string;

  @IsString()
  @ValidateIf((o) => o.cep !== undefined)
  cep?: string;
} 