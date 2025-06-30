import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty({ description: "The user´s first name" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: "The user´s last name" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: "The user´s email" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "The user´s password" })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
