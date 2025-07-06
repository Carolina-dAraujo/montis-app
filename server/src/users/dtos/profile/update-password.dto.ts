import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
	@ApiProperty({ description: 'Current password' })
	@IsString()
	currentPassword: string;

	@ApiProperty({ description: 'New password' })
	@IsString()
	@MinLength(8)
	newPassword: string;
}
