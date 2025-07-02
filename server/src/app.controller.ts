import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
} //testando isso e aquilo


@Controller('users')
export class UsersController {
  @Get()
  getUsers(): string {
    // Substitua por lógica real de busca de usuários se necessário
    return "List of users";
  }
}