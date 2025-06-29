import { FirebaseService } from "src/firebase/firebase.service";
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { AuthResponseDto } from "./dtos/auth-response.dto";
import { validatePassword } from "../common/password.validator";
import * as firebaseAdmin from "firebase-admin";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async registerUser(registerUser: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const passwordValidation = validatePassword(registerUser.password);
      if (!passwordValidation.isValid) {
        throw new BadRequestException(passwordValidation.error);
      }

      const userRecord = await this.firebaseService.createUser({
        email: registerUser.email,
        password: registerUser.password,
        displayName: registerUser.email.split("@")[0],
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

  async loginUser(loginUser: LoginUserDto): Promise<AuthResponseDto> {
    try {
      // First, try to sign in with email and password to validate credentials
      const signInResult = await this.firebaseService.signInWithEmailAndPassword(
        loginUser.email,
        loginUser.password
      );

      // If sign in is successful, create a custom token
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
}
