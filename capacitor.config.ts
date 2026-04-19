import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ukp2sa.app',
  appName: 'ukp2sa',
  webDir: 'out',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
