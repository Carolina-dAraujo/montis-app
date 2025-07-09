import { FirebaseService } from "src/firebase/firebase.service";
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { OnboardingDto } from "./dtos/onboarding";
import { validatePassword } from "../common/password.validator";
import * as firebaseAdmin from "firebase-admin";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const passwordValidation = validatePassword(registerUserDto.password);
      if (!passwordValidation.isValid) {
        throw new BadRequestException(passwordValidation.error);
      }

      const userRecord = await this.firebaseService.createUser({
        email: registerUserDto.email,
        password: registerUserDto.password,
        displayName: registerUserDto.email.split("@")[0],
      });

      const customToken = await this.firebaseService.createCustomToken(userRecord.uid);

      return {
        token: customToken,
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

      const customToken = await this.firebaseService.createCustomToken(userRecord.uid);

      return {
        token: customToken,
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

  async completeOnboarding(uid: string, onboardingData: OnboardingDto): Promise<any> {
    try {
      // Update user profile with onboarding data
      const updateFields: any = {
        displayName: onboardingData.displayName,
      };

      // Note: We'll skip updating phone number in Firebase Auth for now
      // since it requires E.164 format and we're storing it in the database anyway
      // if (onboardingData.phone) {
      //   updateFields.phoneNumber = onboardingData.phone;
      // }

      // Update user in Firebase Auth
      const userRecord = await this.firebaseService.updateUser(uid, updateFields);

      // Store onboarding preferences in Firebase Realtime Database
      const onboardingPreferences: any = {
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

      // Add address fields if provided
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

      // Add phone number to preferences (stored in database, not Firebase Auth)
      if (onboardingData.phone) {
        onboardingPreferences.phone = onboardingData.phone;
      }

      // Only add sobrietyStartDate if it exists
      if (onboardingData.sobrietyStartDate) {
        onboardingPreferences.sobrietyStartDate = onboardingData.sobrietyStartDate;
      }

      // Only add emergency contact info if they exist
      if (onboardingData.emergencyContactName) {
        onboardingPreferences.emergencyContactName = onboardingData.emergencyContactName;
      }

      if (onboardingData.emergencyContactPhone) {
        onboardingPreferences.emergencyContactPhone = onboardingData.emergencyContactPhone;
      }

      // Clean undefined values from the data
      const cleanOnboardingPreferences = this.removeUndefinedValues(onboardingPreferences);

      // Save to Realtime Database
      await this.firebaseService.saveOnboardingData(uid, cleanOnboardingPreferences);

      // Also save initial sobriety data
      const sobrietyData: any = {
        userId: uid,
        lastDrinkDate: onboardingData.lastDrinkDate,
        currentStreak: 0,
        totalDays: 0,
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Only add startDate if sobrietyStartDate exists
      if (onboardingData.sobrietyStartDate) {
        sobrietyData.startDate = onboardingData.sobrietyStartDate;
      }

      const cleanSobrietyData = this.removeUndefinedValues(sobrietyData);
      await this.firebaseService.saveSobrietyData(uid, cleanSobrietyData);

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        onboardingCompleted: true,
        preferences: cleanOnboardingPreferences,
        sobrietyData: cleanSobrietyData,
      };
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw new BadRequestException("Não foi possível completar o onboarding");
    }
  }

  private removeUndefinedValues(obj: any): any {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  async verifyToken(token: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return await this.firebaseService.verifyIdToken(token);
  }

  async getUserProfile(uid: string): Promise<any> {
    try {
      const userRecord = await this.firebaseService.getUser(uid);

      let phoneNumber = userRecord.phoneNumber;
      // Se phoneNumber estiver vazio, tenta buscar em preferences e onboarding
      if (!phoneNumber) {
        const preferences = await this.firebaseService.getPreferences(uid);
        if (preferences && preferences.phone) {
          phoneNumber = preferences.phone;
        } else {
          const onboarding = await this.firebaseService.getOnboardingData(uid);
          if (onboarding && onboarding.phone) {
            phoneNumber = onboarding.phone;
          }
        }
      }

      // Busca a URL da imagem de perfil, se existir
      let profileImage: string | undefined = undefined;
      try {
        const userData = await this.firebaseService.getUserData(uid);
        if (userData && userData.profileImage) {
          profileImage = userData.profileImage;
        }
      } catch (e) {}

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber,
        profileImage,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      throw new BadRequestException("Não foi possível carregar o perfil");
    }
  }

  async updateUserProfile(uid: string, updateData: UpdateProfileDto): Promise<any> {
    try {
      const updateFields: any = {};

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
        const currentPreferences = await this.firebaseService.getPreferences(uid) || {};
        // Atualiza apenas o campo phone, preservando os outros
        const updatedPreferences = { ...currentPreferences, phone: updateData.phone };
        await this.firebaseService.savePreferences(uid, updatedPreferences);
      }

      return {
        uid: userRecord.uid,
        email: userRecord.email,
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

  async updateUserPassword(uid: string, passwordData: UpdatePasswordDto): Promise<any> {
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

  async deleteUserAccount(uid: string): Promise<any> {
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

  async getOnboardingStatus(uid: string): Promise<any> {
    try {
      const onboardingData = await this.firebaseService.getOnboardingData(uid);
      return onboardingData;
    } catch (error) {
      console.error("Get onboarding status error:", error);
      return null;
    }
  }

  async getOnboardingData(uid: string): Promise<any> {
    try {
      const onboardingData = await this.firebaseService.getOnboardingData(uid);
      return onboardingData;
    } catch (error) {
      console.error("Get onboarding data error:", error);
      return null;
    }
  }

  async getAllUserData(uid: string): Promise<any> {
    try {
      const userData = await this.firebaseService.getUserData(uid);
      return userData;
    } catch (error) {
      console.error("Get all user data error:", error);
      return null;
    }
  }

  async uploadProfileImage(uid: string, file: any): Promise<string> {
    // Faz upload para o Storage
    const imageUrl = await this.firebaseService.uploadProfileImage(uid, file);
    // Salva a URL em users/{uid}/profileImage no Realtime Database
    await this.firebaseService.updateUserData(uid, { profileImage: imageUrl }, '');
    return imageUrl;
  }
}
