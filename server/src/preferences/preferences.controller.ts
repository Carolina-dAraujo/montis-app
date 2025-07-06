import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dtos/update-preferences.dto';
import { UpdatePermissionsDto } from './dtos/update-permissions.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Put('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() preferences: UpdatePreferencesDto,
  ): Promise<{ message: string }> {
    return this.preferencesService.updatePreferences(user.uid, preferences);
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: any) {
    return this.preferencesService.getPreferences(user.uid);
  }

  @Put('permissions')
  async updatePermissions(
    @CurrentUser() user: any,
    @Body() permissions: UpdatePermissionsDto,
  ): Promise<{ message: string }> {
    return this.preferencesService.updatePermissions(user.uid, permissions);
  }

  @Get('permissions')
  async getPermissions(@CurrentUser() user: any) {
    return this.preferencesService.getPermissions(user.uid);
  }
} 