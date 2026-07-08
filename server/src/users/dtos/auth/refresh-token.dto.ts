import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
	@ApiProperty({ description: "Firebase refresh token" })
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}
