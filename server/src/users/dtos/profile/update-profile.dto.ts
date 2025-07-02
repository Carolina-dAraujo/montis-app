import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
	@ApiProperty({ description: 'User display name', example: 'João da Silva' })
	@IsOptional()
	@IsString()
	displayName?: string;

	@ApiProperty({ description: 'User phone number', example: '(11) 99999-9999' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({ description: 'User email', example: 'joao@example.com' })
	@IsOptional()
	@IsEmail()
	email?: string;
}
