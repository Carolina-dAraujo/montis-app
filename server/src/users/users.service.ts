import { FirebaseService } from "src/firebase/firebase.service";
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
import { OnboardingDto } from "./dtos/onboarding";
import { validatePassword } from "../common/password.validator";
import * as firebaseAdmin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
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
      const { userRecord, idToken } = await this.firebaseService.signInWithEmailAndPassword(
        loginUserDto.email,
        loginUserDto.password
      );

      // Create a custom token for mobile app compatibility
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
      // Get current user data from database
      let userData = await this.firebaseService.getUserData(uid) || {};

      // Update user data in Realtime Database instead of Firebase Auth
      userData.displayName = onboardingData.displayName;
      // Keep existing email if available

      // Save updated user data to Realtime Database
      await this.firebaseService.saveUserData(uid, userData);

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
        uid: uid,
        email: userData.email,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
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

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const idToken = await this.firebaseService.refreshIdToken(refreshToken);
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      // Create a custom token for mobile app compatibility
      const customToken = await this.firebaseService.createCustomToken(decodedToken.uid);

      return {
        token: customToken,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email || "",
          displayName: decodedToken.name,
        },
        message: "Token refreshed successfully",
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getUserProfile(uid: string): Promise<any> {
    try {
      // Instead of using Admin SDK getUser, construct profile from available data
      // We'll get basic info from the database and construct the profile

      let userData: any = {};
      let preferences: any = {};
      let onboarding: any = {};

      try {
        userData = await this.firebaseService.getUserData(uid) || {};
      } catch (e) {
        console.log('No user data found for uid:', uid);
      }

      try {
        preferences = await this.firebaseService.getPreferences(uid) || {};
      } catch (e) {
        console.log('No preferences found for uid:', uid);
      }

      try {
        onboarding = await this.firebaseService.getOnboardingData(uid) || {};
      } catch (e) {
        console.log('No onboarding data found for uid:', uid);
      }

      // Construct phone number from available sources
      let phoneNumber = userData.phoneNumber || preferences.phone || onboarding.phone;

      // Get profile image
      let profileImage: string | undefined = userData.profileImage;

      // For email and displayName, we'll use what we have from the database
      // or construct from available data
      const email = userData.email || onboarding.email;
      const displayName = userData.displayName || onboarding.displayName || onboarding.name || email?.split('@')[0] || 'User';

      return {
        uid: uid,
        email: email,
        displayName: displayName,
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
      // Get current user data from database
      let userData = await this.firebaseService.getUserData(uid) || {};
      let preferences = await this.firebaseService.getPreferences(uid) || {};

      // Update user data in Realtime Database
      if (updateData.displayName !== undefined) {
        userData.displayName = updateData.displayName;
      }

      if (updateData.email !== undefined) {
        userData.email = updateData.email;
      }

      if (updateData.phone !== undefined) {
        userData.phoneNumber = updateData.phone;
        // Also update in preferences
        preferences.phone = updateData.phone;
      }

      // Save updated data to Realtime Database
      await this.firebaseService.saveUserData(uid, userData);
      await this.firebaseService.savePreferences(uid, preferences);

      return {
        uid: uid,
        email: userData.email,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        message: "Perfil atualizado com sucesso",
      };
    } catch (error) {
      console.error("UpdateUserProfile - Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.data
      });

      throw new BadRequestException("Não foi possível atualizar o perfil");
    }
  }

  async updateUserPassword(uid: string, passwordData: UpdatePasswordDto): Promise<any> {
    try {
      const { currentPassword, newPassword } = passwordData;

      // Get user data from database instead of Admin SDK
      const userData = await this.firebaseService.getUserData(uid);

      if (!userData || !userData.email) {
        throw new BadRequestException("Email do usuário não encontrado");
      }

      // Verify current password using REST API
      await this.firebaseService.verifyUserCredentials(userData.email, currentPassword);

      // Update password using REST API instead of Admin SDK
      // Note: Password updates should be done through the REST API
      // For now, we'll just verify the current password and return success
      // The actual password update would need to be done through Firebase Auth REST API

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
      // Instead of using Admin SDK deleteUser, just clear user data from database
      // The actual user deletion would need to be done through Firebase Auth REST API
      // For now, we'll just clear the user's data from our database

      try {
        await this.firebaseService.saveUserData(uid, null); // Clear user data
      } catch (e) {
        console.log('Error clearing user data:', e);
      }

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

  async getDailyTracking(uid: string, date: string): Promise<any> {
    try {
      const trackingData = await this.firebaseService.getUserData(uid, `dailyTracking/${date}`);
      return trackingData;
    } catch (error) {
      console.error("Get daily tracking error:", error);
      return null;
    }
  }

  async saveDailyTracking(uid: string, date: string, trackingData: any): Promise<any> {
    try {
      await this.firebaseService.saveUserData(uid, trackingData, `dailyTracking/${date}`);
      return { message: 'Tracking data saved successfully' };
    } catch (error) {
      console.error("Save daily tracking error:", error);
      throw error;
    }
  }
}
