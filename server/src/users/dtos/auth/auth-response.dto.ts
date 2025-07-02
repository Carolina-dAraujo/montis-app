import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
	@ApiProperty({ description: "JWT token for authentication" })
	token: string;

	@ApiProperty({ description: "User information" })
	user: {
		uid: string;
		email: string;
		displayName?: string;
	};

	@ApiProperty({ description: "Success message" })
	message: string;
}
