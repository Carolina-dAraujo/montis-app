import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Put, Delete, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { OnboardingDto } from "./dtos/onboarding";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { getPasswordRules } from "../common/password.validator";
import { BadRequestException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';

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
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 409,
		description: "User already exists",
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
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Invalid credentials",
	})
	async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
		return await this.usersService.loginUser(loginUserDto);
	}

	@Post("onboarding")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Complete user onboarding" })
	@ApiResponse({
		status: 200,
		description: "Onboarding completed successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async completeOnboarding(@CurrentUser() user: any, @Body() onboardingData: OnboardingDto) {
		try {
			const result = await this.usersService.completeOnboarding(user.uid, onboardingData);
			return {
				message: "Onboarding concluído com sucesso",
				user: result,
			};
		} catch (error) {
			console.error("Onboarding error:", error);
			throw new BadRequestException("Não foi possível completar o onboarding");
		}
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

	@Put('profile/image')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@UseInterceptors(FileInterceptor('file'))
	async uploadProfileImage(@CurrentUser() user: any, @UploadedFile() file: any) {
		if (!file) {
			throw new BadRequestException('Nenhum arquivo enviado');
		}
		// Faz upload para o Storage
		const imageUrl = await this.usersService.uploadProfileImage(user.uid, file);
		return { imageUrl };
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

	@Get("onboarding/status")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Check user onboarding status" })
	@ApiResponse({
		status: 200,
		description: "Onboarding status retrieved successfully",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async checkOnboardingStatus(@CurrentUser() user: any) {
		try {
			const onboardingData = await this.usersService.getOnboardingStatus(user.uid);
			return {
				onboardingCompleted: !!onboardingData?.onboardingCompleted,
			};
		} catch (error) {
			console.error("Check onboarding status error:", error);
			return {
				onboardingCompleted: false,
			};
		}
	}

	@Get("onboarding")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get user onboarding data" })
	@ApiResponse({
		status: 200,
		description: "Onboarding data retrieved successfully",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async getOnboardingData(@CurrentUser() user: any) {
		try {
			const onboardingData = await this.usersService.getOnboardingData(user.uid);
			return onboardingData;
		} catch (error) {
			console.error("Get onboarding data error:", error);
			throw new BadRequestException("Não foi possível carregar os dados de onboarding");
		}
	}

	@Get("debug/user-data")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get all user data for debugging" })
	@ApiResponse({
		status: 200,
		description: "User data retrieved successfully",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async getUserData(@CurrentUser() user: any) {
		try {
			const userData = await this.usersService.getAllUserData(user.uid);
			return {
				uid: user.uid,
				data: userData,
			};
		} catch (error) {
			console.error("Get user data error:", error);
			throw new BadRequestException("Não foi possível carregar os dados do usuário");
		}
	}

	@Post("onboarding/test")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Test onboarding data" })
	@ApiResponse({
		status: 200,
		description: "Onboarding data received successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async testOnboarding(@CurrentUser() user: any, @Body() onboardingData: any) {
		try {
			return {
				message: "Dados recebidos com sucesso",
				receivedData: onboardingData,
				userId: user.uid,
			};
		} catch (error) {
			throw new BadRequestException("Erro no teste de onboarding");
		}
	}
}
