// Load environment variables
import 'dotenv/config';

export default {
  expo: {
    name: "montis-mobile",
    slug: "montis-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/montis-logo.png",
    scheme: "montismobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/montis-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: false
    },
    extra: {
      // API Configuration
      // For physical device testing, set your computer's IP address
      // You can set this via environment variable: API_URL=http://10.0.0.116:3000
      apiUrl: process.env.API_URL,

      // Production API URL (when ready)
      // You can set this via environment variable: PRODUCTION_API_URL=https://your-production-api.com
      // productionApiUrl: process.env.PRODUCTION_API_URL || 'https://your-production-api.com',
    },
  },
};