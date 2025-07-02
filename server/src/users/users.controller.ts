import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Put, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { getPasswordRules } from "../common/password.validator";
import { BadRequestException } from "@nestjs/common";

@ApiTags("Authentication")
@Controller("auth")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get("password-rules")
	@ApiOperation({ summary: "Get password validation rules" })
	@ApiResponse({
		status: 200,
		description: "Password rules retrieved successfully",
		schema: {
			type: "object",
			properties: {
				rules: {
					type: "array",
					items: { type: "string" },
					example: [
						"Mínimo de 8 caracteres",
						"Pelo menos uma letra maiúscula",
						"Pelo menos uma letra minúscula",
						"Pelo menos um número",
						"Pelo menos um caractere especial"
					]
				}
			}
		}
	})
	async getPasswordRules() {
		return {
			rules: getPasswordRules()
		};
	}

	@Post("register")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "Register a new user" })
	@ApiResponse({
		status: 201,
		description: "User registered successfully",
		type: AuthResponseDto,
	})
	@ApiResponse({
		status: 409,
		description: "Registration failed (email may already exist)",
		schema: {
			type: "object",
			properties: {
				message: { type: "string", example: "Não foi possível criar a conta. Verifique os dados e tente novamente." },
				code: { type: "string", example: "REGISTRATION_FAILED" }
			}
		}
	})
	@ApiResponse({
		status: 400,
		description: "Validation error - password doesn't meet requirements",
	})
	async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
		return await this.usersService.registerUser(registerUserDto);
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Login user" })
	@ApiResponse({
		status: 200,
		description: "Login successful",
		type: AuthResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: "Invalid credentials",
		schema: {
			type: "object",
			properties: {
				message: { type: "string", example: "Email ou senha incorretos" },
				code: { type: "string", example: "INVALID_CREDENTIALS" }
			}
		}
	})
	async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
		return await this.usersService.loginUser(loginUserDto);
	}

	@Get("profile")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get current user profile" })
	@ApiResponse({
		status: 200,
		description: "User profile retrieved successfully",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async getProfile(@CurrentUser() user: any) {
		return await this.usersService.getUserProfile(user.uid);
	}

	@Put("profile")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Update user profile" })
	@ApiResponse({
		status: 200,
		description: "Profile updated successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async updateProfile(@CurrentUser() user: any, @Body() updateData: UpdateProfileDto) {
		try {
			const updateFields: any = {};
			if (updateData.displayName !== undefined) updateFields.displayName = updateData.displayName;
			if (updateData.phone !== undefined) updateFields.phoneNumber = updateData.phone;
			if (updateData.email !== undefined) updateFields.email = updateData.email;

			const userRecord = await this.usersService.updateUserProfile(user.uid, updateData);

			return {
				uid: userRecord.uid,
				email: userRecord.email,
				displayName: userRecord.displayName,
				phoneNumber: userRecord.phoneNumber,
				message: "Perfil atualizado com sucesso",
			};
		} catch (error) {
			console.error("Update profile error:", error, error?.message, error?.code);
			throw new BadRequestException("Não foi possível atualizar o perfil");
		}
	}

	@Put("profile/password")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Update user password" })
	@ApiResponse({
		status: 200,
		description: "Password updated successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error or current password incorrect",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async updatePassword(@CurrentUser() user: any, @Body() passwordData: UpdatePasswordDto) {
		return await this.usersService.updateUserPassword(user.uid, passwordData);
	}

	@Delete("profile")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete user account" })
	@ApiResponse({
		status: 200,
		description: "Account deleted successfully",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async deleteAccount(@CurrentUser() user: any) {
		return await this.usersService.deleteUserAccount(user.uid);
	}
}
