import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
	@ApiProperty({ description: "The user's email" })
	@IsEmail({}, { message: "Email inválido" })
	@IsNotEmpty({ message: "Email não pode estar vazio" })
	email: string;

	@ApiProperty({ description: "The user's password" })
	@IsNotEmpty({ message: "Senha não pode estar vazia" })
	@IsString({ message: "Senha deve ser uma string" })
	password: string;
}
