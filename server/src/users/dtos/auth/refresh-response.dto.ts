import { ApiProperty } from "@nestjs/swagger";

export class RefreshResponseDto {
	@ApiProperty({ description: "New Firebase ID token" })
	token: string;

	@ApiProperty({ description: "New Firebase refresh token" })
	refreshToken: string;
}
