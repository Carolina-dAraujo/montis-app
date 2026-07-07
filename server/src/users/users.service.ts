import { FirebaseService } from "src/firebase/firebase.service";
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { OnboardingDto } from "./dtos/onboarding";
import { DailyTrackingDto } from "./dtos/tracking/daily-tracking.dto";
import { validatePassword } from "../common/password.validator";
import { removeUndefinedValues } from "../common/remove-undefined";
import type { UserProfile, UpdateProfileResponse, MessageResponse } from "@montis/contracts/profile";
import type {
	CompleteOnboardingResult,
	OnboardingPreferences,
} from "@montis/contracts/onboarding";
import type { SobrietyRtdbRecord } from "@montis/contracts/sobriety-rtdb";
import type { UserPreferences } from "@montis/contracts/preferences";
import * as firebaseAdmin from "firebase-admin";
import { UpdateRequest } from "firebase-admin/lib/auth/auth-config";
import { Express } from "express";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  /** Returns a Firebase ID token (not a custom token) for client Authorization headers. */
  private async issueIdToken(uid: string): Promise<string> {
    const customToken = await this.firebaseService.createCustomToken(uid);
    return this.firebaseService.exchangeCustomTokenForIdToken(customToken);
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const passwordValidation = validatePassword(registerUserDto.password);
      if (!passwordValidation.isValid) {
        throw new BadRequestException(passwordValidation.error);
      }

      const userRecord = await this.firebaseService.createUser({
        email: registerUserDto.email,
        password: registerUserDto.password,
      });

      const idToken = await this.issueIdToken(userRecord.uid);

      return {
        token: idToken,
        user: {
          uid: userRecord.uid,
          email: userRecord.email || "",
          displayName: userRecord.displayName,
        },
        message: "Usuário registrado com sucesso",
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException({
          message: "Não foi possível criar a conta. Verifique os dados e tente novamente.",
          code: "REGISTRATION_FAILED"
        });
      }

      if (error.code === 'auth/invalid-email') {
        throw new BadRequestException("Email inválido");
      }

      if (error.code === 'auth/weak-password') {
        throw new BadRequestException("Senha muito fraca");
      }

      throw new BadRequestException("Erro ao registrar usuário. Tente novamente.");
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    try {
      const userRecord = await this.firebaseService.signInWithEmailAndPassword(
        loginUserDto.email,
        loginUserDto.password
      );

      const idToken = await this.issueIdToken(userRecord.uid);

      return {
        token: idToken,
        user: {
          uid: userRecord.uid,
          email: userRecord.email || "",
          displayName: userRecord.displayName,
        },
        message: "Login realizado com sucesso",
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new UnauthorizedException("Email ou senha incorretos");
    }
  }

  async completeOnboarding(uid: string, onboardingData: OnboardingDto): Promise<CompleteOnboardingResult> {
    try {
      const updateFields: UpdateRequest = {
        displayName: onboardingData.displayName,
      };

      const userRecord = await this.firebaseService.updateUser(uid, updateFields);

      const onboardingPreferences: OnboardingPreferences = {
        displayName: onboardingData.displayName,
        birthDate: onboardingData.birthDate,
        sobrietyGoal: onboardingData.sobrietyGoal,
        lastDrinkDate: onboardingData.lastDrinkDate,
        dailyReminders: onboardingData.dailyReminders,
        notificationFrequency: onboardingData.notificationFrequency,
        crisisSupport: onboardingData.crisisSupport,
        shareProgress: onboardingData.shareProgress,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      };

      if (onboardingData.address) {
        onboardingPreferences.address = onboardingData.address;
      }
      if (onboardingData.city) {
        onboardingPreferences.city = onboardingData.city;
      }
      if (onboardingData.neighborhood) {
        onboardingPreferences.neighborhood = onboardingData.neighborhood;
      }
      if (onboardingData.cep) {
        onboardingPreferences.cep = onboardingData.cep;
      }
      if (onboardingData.phone) {
        onboardingPreferences.phone = onboardingData.phone;
      }
      if (onboardingData.sobrietyStartDate) {
        onboardingPreferences.sobrietyStartDate = onboardingData.sobrietyStartDate;
      }
      if (onboardingData.emergencyContactName) {
        onboardingPreferences.emergencyContactName = onboardingData.emergencyContactName;
      }
      if (onboardingData.emergencyContactPhone) {
        onboardingPreferences.emergencyContactPhone = onboardingData.emergencyContactPhone;
      }

      const cleanOnboardingPreferences = removeUndefinedValues(
        onboardingPreferences as Record<string, unknown>,
      ) as Partial<OnboardingPreferences>;

      await this.firebaseService.saveOnboardingData(uid, cleanOnboardingPreferences);

      const sobrietyData: Partial<SobrietyRtdbRecord> = {
        userId: uid,
        lastDrinkDate: onboardingData.lastDrinkDate,
        currentStreak: 0,
        totalDays: 0,
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onboardingData.sobrietyStartDate) {
        sobrietyData.startDate = onboardingData.sobrietyStartDate;
      }

      const cleanSobrietyData = removeUndefinedValues(
        sobrietyData as Record<string, unknown>,
      ) as Partial<SobrietyRtdbRecord>;
      await this.firebaseService.saveSobrietyData(uid, cleanSobrietyData);

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        onboardingCompleted: true,
        preferences: cleanOnboardingPreferences,
        sobrietyData: cleanSobrietyData as Record<string, unknown>,
      };
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw new BadRequestException("Não foi possível completar o onboarding");
    }
  }

  async verifyToken(token: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return await this.firebaseService.verifyIdToken(token);
  }

  async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const userRecord = await this.firebaseService.getUser(uid);

      let phoneNumber = userRecord.phoneNumber;
      let displayName = userRecord.displayName;

      const preferences = await this.firebaseService.getPreferences(uid);
      const onboarding = await this.firebaseService.getOnboardingData(uid);

      if (onboarding?.displayName) {
        displayName = onboarding.displayName;
      } else if (preferences?.displayName) {
        displayName = preferences.displayName;
      }

      // Se phoneNumber estiver vazio, tenta buscar em preferences e onboarding
      if (!phoneNumber) {
        if (preferences && preferences.phone) {
          phoneNumber = preferences.phone;
        } else if (onboarding && onboarding.phone) {
          phoneNumber = onboarding.phone;
        }
      }

      // Busca a URL da imagem de perfil, se existir
      let profileImage: string | undefined = undefined;
      try {
        const userData = await this.firebaseService.getUserData<{ profileImage?: string }>(uid);
        if (userData?.profileImage) {
          profileImage = userData.profileImage;
        }
      } catch {
        // profile image is optional
      }

      return {
        uid: userRecord.uid,
        email: userRecord.email ?? '',
        displayName,
        phoneNumber,
        profileImage,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      throw new BadRequestException("Não foi possível carregar o perfil");
    }
  }

  async updateUserProfile(uid: string, updateData: UpdateProfileDto): Promise<UpdateProfileResponse> {
    try {
      const updateFields: UpdateRequest = {};

      if (updateData.displayName !== undefined) {
        updateFields.displayName = updateData.displayName;
      }

      if (updateData.phone !== undefined) {
        updateFields.phoneNumber = updateData.phone;
      }

      if (updateData.email !== undefined) {
        updateFields.email = updateData.email;
      }

      const userRecord = await this.firebaseService.updateUser(uid, updateFields);

      // Se o telefone foi atualizado, também atualiza em preferences no Realtime Database
      if (updateData.phone !== undefined) {
        // Busca as preferências atuais
        const currentPreferences = (await this.firebaseService.getPreferences(uid)) ?? {};
        const updatedPreferences: UserPreferences = { ...currentPreferences, phone: updateData.phone };
        await this.firebaseService.savePreferences(uid, updatedPreferences);
      }

      return {
        uid: userRecord.uid,
        email: userRecord.email ?? '',
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        message: "Perfil atualizado com sucesso",
      };
    } catch (error) {
      console.error("UpdateUserProfile - Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.data
      });

      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        throw new BadRequestException("Usuário não encontrado");
      }

      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException("Este email já está em uso");
      }

      if (error.code === 'auth/invalid-email') {
        throw new BadRequestException("Email inválido");
      }

      if (error.code === 'auth/phone-number-already-exists') {
        throw new BadRequestException("Este número de telefone já está em uso");
      }

      throw new BadRequestException("Não foi possível atualizar o perfil");
    }
  }

  async updateUserPassword(uid: string, passwordData: UpdatePasswordDto): Promise<MessageResponse> {
    try {
      const { currentPassword, newPassword } = passwordData;

      const userRecord = await this.firebaseService.getUser(uid);

      if (!userRecord.email) {
        throw new BadRequestException("Email do usuário não encontrado");
      }

      await this.firebaseService.verifyUserCredentials(userRecord.email, currentPassword);

      await this.firebaseService.updateUser(uid, { password: newPassword });

      return {
        message: "Senha atualizada com sucesso",
      };
    } catch (error) {
      console.error("Update password error:", error);
      if (error instanceof UnauthorizedException) {
        throw new BadRequestException("Senha atual incorreta");
      }
      throw new BadRequestException("Não foi possível atualizar a senha");
    }
  }

  async deleteUserAccount(uid: string): Promise<MessageResponse> {
    try {
      await this.firebaseService.deleteUser(uid);

      return {
        message: "Conta excluída com sucesso",
      };
    } catch (error) {
      console.error("Delete account error:", error);
      throw new BadRequestException("Não foi possível excluir a conta");
    }
  }

  async getOnboardingStatus(uid: string): Promise<OnboardingPreferences | null> {
    try {
      const onboardingData = await this.firebaseService.getOnboardingData(uid);
      return onboardingData;
    } catch (error) {
      console.error("Get onboarding status error:", error);
      return null;
    }
  }

  async getOnboardingData(uid: string): Promise<OnboardingPreferences | null> {
    try {
      const onboardingData = await this.firebaseService.getOnboardingData(uid);
      return onboardingData;
    } catch (error) {
      console.error("Get onboarding data error:", error);
      return null;
    }
  }

  async getAllUserData(uid: string): Promise<Record<string, unknown> | null> {
    try {
      const userData = await this.firebaseService.getUserData(uid);
      return userData;
    } catch (error) {
      console.error("Get all user data error:", error);
      return null;
    }
  }

  async uploadProfileImage(uid: string, file: Express.Multer.File): Promise<string> {
    // Faz upload para o Storage
    const imageUrl = await this.firebaseService.uploadProfileImage(uid, file);
    // Salva a URL em users/{uid}/profileImage no Realtime Database
    await this.firebaseService.updateUserData(uid, { profileImage: imageUrl }, '');
    return imageUrl;
  }

  private assertValidTrackingDate(date: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Data inválida. Use o formato YYYY-MM-DD.');
    }
  }

  async getDailyTracking(uid: string, date: string): Promise<DailyTrackingDto | null> {
    this.assertValidTrackingDate(date);
    const data = await this.firebaseService.getDailyTracking(uid, date);
    return data as DailyTrackingDto | null;
  }

  async saveDailyTracking(uid: string, date: string, body: DailyTrackingDto): Promise<DailyTrackingDto> {
    this.assertValidTrackingDate(date);
    await this.firebaseService.saveDailyTracking(uid, date, { ...body });
    return body;
  }

  async getDailyTrackingMonth(
    uid: string,
    year: number,
    month: number,
  ): Promise<Record<string, DailyTrackingDto>> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Mês inválido. Use um valor entre 1 e 12.');
    }
    const data = await this.firebaseService.getDailyTrackingForMonth(uid, year, month);
    return data as unknown as Record<string, DailyTrackingDto>;
  }
}
