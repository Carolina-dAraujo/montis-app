declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // These are no longer used, but keeping for reference
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_PRODUCTION_API_URL?: string;
    }
  }
}

// Types for app.config.js extra configuration
declare module 'expo-constants' {
  interface Constants {
    expoConfig?: {
      extra?: {
        apiUrl?: string;
        productionApiUrl?: string;
      };
    };
  }
}

export {}; 