import { Injectable } from '@nestjs/common';
import { UpdatePreferencesDto } from './dtos/update-preferences.dto';
import { UpdatePermissionsDto } from './dtos/update-permissions.dto';

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

@Injectable()
export class PreferencesService {
  // In a real app, this would be stored in a database
  private preferences: Map<string, Preferences> = new Map();
  private permissions: Map<string, Permissions> = new Map();

  async updatePreferences(userId: string, preferences: UpdatePreferencesDto): Promise<{ message: string }> {
    // If daily reminders are disabled, set frequency to 'never'
    const notificationFrequency = preferences.dailyReminders 
      ? preferences.notificationFrequency 
      : 'never';

    this.preferences.set(userId, {
      dailyReminders: preferences.dailyReminders,
      notificationFrequency: notificationFrequency,
      crisisSupport: preferences.crisisSupport,
      shareProgress: preferences.shareProgress,
    });

    return { message: 'Preferências atualizadas com sucesso' };
  }

  async getPreferences(userId: string): Promise<Preferences> {
    const userPreferences = this.preferences.get(userId);
    
    if (!userPreferences) {
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