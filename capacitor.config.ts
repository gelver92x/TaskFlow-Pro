import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration for TaskFlow.
 *
 * @property appId - Bundle ID for the app (reverse-DNS notation).
 * @property appName - Display name of the app on device.
 * @property webDir - Directory containing the compiled web assets (Angular output).
 * @property server.androidScheme - Forces HTTPS on Android WebView for secure cookies/storage.
 */
const config: CapacitorConfig = {
  appId: 'com.gelver.taskflow',
  appName: 'TaskFlow',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
