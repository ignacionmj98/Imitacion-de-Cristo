import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ignacionmj98.imitaciondecristo",
  appName: "Imitación de Cristo",
  webDir: "dist",
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#7a5c3e",
    },
  },
};

export default config;
