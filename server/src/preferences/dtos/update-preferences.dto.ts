import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

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
} 