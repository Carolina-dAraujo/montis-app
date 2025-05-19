import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async registerUser(@Body() dto: RegisterUserDto) {
    return await this.usersService.registerUser(dto);
  }
}
