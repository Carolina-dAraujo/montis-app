import { Platform } from 'react-native';
import Constants from 'expo-constants';

// API Configuration for different environments
export const API_CONFIG = {
    // Development URLs
    development: {
        // For iOS Simulator
        ios: 'http://localhost:3000',
        // For Android Emulator
        android: 'http://10.0.2.2:3000',
        // For physical devices - must be set via environment variable
        device: Constants.expoConfig?.extra?.apiUrl || null,
    },
    // Production URL
    production: Constants.expoConfig?.extra?.productionApiUrl || 'https://your-production-api.com',
};

// Function to get local IP address (for development)
const getLocalIP = (): string => {
    // If environment variable is set, use it
    if (Constants.expoConfig?.extra?.apiUrl) {
        return Constants.expoConfig.extra.apiUrl.replace('http://', '').replace(':3000', '');
    }

    // No environment variable set - this should not happen in production
    // Return a placeholder that will cause a clear error
    return 'YOUR_LOCAL_IP_NOT_SET';
};

export const getApiUrl = (): string => {
    if (__DEV__) {
        if (Constants.expoConfig?.extra?.apiUrl) {
            const url = Constants.expoConfig.extra.apiUrl;
            console.log('🔍 Using Physical Device URL (configured):', url);
            return url;
        }

        if (Platform.OS === 'ios') {
            const url = API_CONFIG.development.ios;
            console.log('🔍 Using iOS Simulator URL:', url);
            return url;
        } else if (Platform.OS === 'android') {
            const url = API_CONFIG.development.android;
            console.log('🔍 Using Android Emulator URL:', url);
            return url;
        }

        const localIP = getLocalIP();
        const url = `http://${localIP}:3000`;
        console.log('🔍 Using Physical Device URL (fallback):', url);
        return url;
    }

    const url = API_CONFIG.production;
    console.log('🔍 Using Production URL:', url);
    return url;
};

// Instructions for setting up API connection:
/*
1. For iOS Simulator: Uses localhost:3000 automatically
2. For Android Emulator: Uses 10.0.2.2:3000 automatically
3. For Physical Device:
   - MUST set apiUrl in app.config.js
   - Create app.config.js with: extra: { apiUrl: 'http://YOUR_IP:3000' }
   - Make sure your phone and computer are on the same WiFi network

To find your computer's IP address:
- Mac/Linux: Run 'ifconfig' in terminal
- Windows: Run 'ipconfig' in command prompt
- Look for your local network IP (usually 192.168.x.x or 10.0.x.x)

Configuration in app.config.js:
export default {
  expo: {
    // ... other config
    extra: {
      apiUrl: 'http://10.0.0.116:3000',
      productionApiUrl: 'https://your-production-api.com',
    },
  },
};
*/