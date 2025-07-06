import { IsBoolean } from 'class-validator';

export class UpdatePermissionsDto {
  @IsBoolean()
  notifications: boolean;

  @IsBoolean()
  location: boolean;
} 