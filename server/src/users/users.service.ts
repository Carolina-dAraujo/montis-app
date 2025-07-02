import { FirebaseService } from "src/firebase/firebase.service";
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from "./dtos/auth";
import { UpdateProfileDto, UpdatePasswordDto } from "./dtos/profile";
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
      const signInResult = await this.firebaseService.signInWithEmailAndPassword(
        loginUserDto.email,
        loginUserDto.password
      );

      const customToken = await this.firebaseService.createCustomToken(signInResult.uid);

      return {
        token: customToken,
        user: {
          uid: signInResult.uid,
          email: signInResult.email || "",
          displayName: signInResult.displayName,
        },
        message: "Login realizado com sucesso",
      };
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email') {
        throw new UnauthorizedException({
          message: "Email ou senha incorretos",
          code: "INVALID_CREDENTIALS"
        });
      }

      if (error.code === 'auth/too-many-requests') {
        throw new UnauthorizedException({
          message: "Muitas tentativas de login. Tente novamente em alguns minutos.",
          code: "TOO_MANY_ATTEMPTS"
        });
      }

      throw new UnauthorizedException({
        message: "Email ou senha incorretos",
        code: "INVALID_CREDENTIALS"
      });
    }
  }

  async verifyToken(token: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return await this.firebaseService.verifyIdToken(token);
  }

  async getUserProfile(uid: string): Promise<any> {
    try {
      const userRecord = await this.firebaseService.getUser(uid);

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
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
}
