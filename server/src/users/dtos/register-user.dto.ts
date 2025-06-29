import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
	@ApiProperty({ description: "The user's email" })
	@IsEmail({}, { message: "Email inválido" })
	@IsNotEmpty({ message: "Email não pode estar vazio" })
	email: string;

	@ApiProperty({
		description: "The user's password",
		example: "Password123!",
		minLength: 8
	})
	@IsNotEmpty({ message: "Senha não pode estar vazia" })
	@IsString({ message: "Senha deve ser uma string" })
	@Length(8, 50, { message: "Senha deve ter pelo menos 8 caracteres" })
	@Matches(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
	@Matches(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
	@Matches(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
	@Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: "Senha deve conter pelo menos um caractere especial" })
	password: string;
}
