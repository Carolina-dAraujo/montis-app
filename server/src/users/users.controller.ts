import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Put, Delete, Req, UploadedFile, UseInterceptors, Param, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { OnboardingDto } from "./dtos/onboarding";
import { DailyTrackingDto } from "./dtos/tracking/daily-tracking.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { getPasswordRules } from "../common/password.validator";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedUser } from "../auth/authenticated-user.types";

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
	async completeOnboarding(@CurrentUser() user: AuthenticatedUser, @Body() onboardingData: OnboardingDto) {
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
	async getProfile(@CurrentUser() user: AuthenticatedUser) {
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
	async updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() updateData: UpdateProfileDto) {
		try {
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
	async updatePassword(@CurrentUser() user: AuthenticatedUser, @Body() passwordData: UpdatePasswordDto) {
		return await this.usersService.updateUserPassword(user.uid, passwordData);
	}

	@Put('profile/image')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@UseInterceptors(FileInterceptor('file'))
	async uploadProfileImage(
		@CurrentUser() user: AuthenticatedUser,
		@UploadedFile() file: Express.Multer.File,
	) {
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
	async deleteAccount(@CurrentUser() user: AuthenticatedUser) {
		return await this.usersService.deleteUserAccount(user.uid);
	}

	@Get("tracking/month")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get daily tracking entries for a calendar month" })
	async getDailyTrackingMonth(
		@CurrentUser() user: AuthenticatedUser,
		@Query('year') year: string,
		@Query('month') month: string,
	) {
		const yearNum = parseInt(year, 10);
		const monthNum = parseInt(month, 10);
		if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) {
			throw new BadRequestException('Parâmetros year e month são obrigatórios.');
		}
		return await this.usersService.getDailyTrackingMonth(user.uid, yearNum, monthNum);
	}

	@Get("tracking/:date")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Get daily tracking for a date" })
	async getDailyTracking(
		@CurrentUser() user: AuthenticatedUser,
		@Param('date') date: string,
		@Res() res: Response,
	) {
		const data = await this.usersService.getDailyTracking(user.uid, date);
		return res.status(HttpStatus.OK).json(data ?? null);
	}

	@Put("tracking/:date")
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Save daily tracking for a date" })
	async saveDailyTracking(
		@CurrentUser() user: AuthenticatedUser,
		@Param('date') date: string,
		@Body() body: DailyTrackingDto,
	) {
		return await this.usersService.saveDailyTracking(user.uid, date, body);
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
	async checkOnboardingStatus(@CurrentUser() user: AuthenticatedUser) {
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
	async getOnboardingData(@CurrentUser() user: AuthenticatedUser) {
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
	async getUserData(@CurrentUser() user: AuthenticatedUser) {
		if (process.env.NODE_ENV === 'production') {
			throw new NotFoundException();
		}
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
	async testOnboarding(
		@CurrentUser() user: AuthenticatedUser,
		@Body() onboardingData: OnboardingDto,
	) {
		if (process.env.NODE_ENV === 'production') {
			throw new NotFoundException();
		}
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
