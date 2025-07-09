import { Injectable } from '@nestjs/common';
import { UpdatePreferencesDto } from './dtos/update-preferences.dto';
import { UpdatePermissionsDto } from './dtos/update-permissions.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Inject } from '@nestjs/common';

export interface Preferences {
  dailyReminders: boolean;
  notificationFrequency: string;
  crisisSupport: boolean;
  shareProgress: boolean;
}

export interface Permissions {
  notifications: {
    granted: boolean;
    canRequest: boolean;
  };
  location: {
    granted: boolean;
    canRequest: boolean;
  };
}

function removeUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

@Injectable()
export class PreferencesService {
  // In a real app, this would be stored in a database
  private preferences: Map<string, Preferences> = new Map();
  private permissions: Map<string, Permissions> = new Map();

  constructor(@Inject(FirebaseService) private readonly firebaseService: FirebaseService) {}

  async updatePreferences(userId: string, preferences: UpdatePreferencesDto): Promise<{ message: string }> {
    // If daily reminders are disabled, set frequency to 'never'
    const notificationFrequency = preferences.dailyReminders 
      ? preferences.notificationFrequency 
      : 'never';

    const prefsToSave = removeUndefined({
      ...preferences,
      notificationFrequency: notificationFrequency,
    });

    // Garantir que os campos obrigatórios estejam presentes
    const prefsForMap: Preferences = {
      dailyReminders: typeof prefsToSave.dailyReminders === 'boolean' ? prefsToSave.dailyReminders : false,
      notificationFrequency: typeof prefsToSave.notificationFrequency === 'string' ? prefsToSave.notificationFrequency : 'daily',
      crisisSupport: typeof prefsToSave.crisisSupport === 'boolean' ? prefsToSave.crisisSupport : false,
      shareProgress: typeof prefsToSave.shareProgress === 'boolean' ? prefsToSave.shareProgress : false,
    };
    this.preferences.set(userId, prefsForMap);

    // Salvar também no Firebase para manter sincronizado
    console.log('Salvando no Firebase:', prefsToSave);
    await this.firebaseService.savePreferences(userId, prefsToSave);

    return { message: 'Preferências atualizadas com sucesso' };
  }

  async getPreferences(userId: string): Promise<Preferences> {
    const userPreferences = this.preferences.get(userId);
    
    if (!userPreferences) {
      // Buscar do Firebase (onboarding) se não houver no Map
      const onboarding = await this.firebaseService.getOnboardingData(userId);
      if (onboarding) {
        return {
          dailyReminders: onboarding.dailyReminders ?? false,
          notificationFrequency: onboarding.notificationFrequency ?? 'daily',
          crisisSupport: onboarding.crisisSupport ?? false,
          shareProgress: onboarding.shareProgress ?? false,
        };
      }
      // Return default preferences
      return {
        dailyReminders: false,
        notificationFrequency: 'daily',
        crisisSupport: false,
        shareProgress: false,
      };
    }

    return userPreferences;
  }

  async updatePermissions(userId: string, permissions: UpdatePermissionsDto): Promise<{ message: string }> {
    this.permissions.set(userId, {
      notifications: {
        granted: permissions.notifications,
        canRequest: !permissions.notifications, // Can request if not granted
      },
      location: {
        granted: permissions.location,
        canRequest: !permissions.location, // Can request if not granted
      },
    });

    // Salvar permissão de localização como booleano no Firebase
    await this.firebaseService.saveUserData(userId, { locationPermission: !!permissions.location }, 'preferences');

    return { message: 'Permissões atualizadas com sucesso' };
  }

  async getPermissions(userId: string): Promise<Permissions> {
    const userPermissions = this.permissions.get(userId);
    
    if (!userPermissions) {
      // Return default permissions
      return {
        notifications: {
          granted: false,
          canRequest: true,
        },
        location: {
          granted: false,
          canRequest: true,
        },
      };
    }

    return userPermissions;
  }
} 