import { FirebaseService } from 'src/firebase/firebase.service';
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerUser(registerUser: RegisterUserDto) {
    return await this.firebaseService.createUser({
      displayName: registerUser.firstName,
      email: registerUser.email,
      password: registerUser.password,
    });
  }
}
