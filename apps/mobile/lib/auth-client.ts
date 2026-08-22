import * as Device from "expo-device";
import { Platform } from "react-native";
import {
  configureApiClientDeviceInfoAdapter,
  configureApiClientSessionAdapter,
} from "@workspace/sdk";

import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
} from "./auth-storage";

configureApiClientSessionAdapter({
  getSession: getStoredAuthSession,
  setSession: setStoredAuthSession,
  clearSession: clearStoredAuthSession,
});

configureApiClientDeviceInfoAdapter({
  getDeviceInfo: () => {
    const os = [Device.osName ?? Platform.OS, Device.osVersion]
      .filter(Boolean)
      .join(" ");
    const model = [Device.brand, Device.modelName]
      .filter(Boolean)
      .join(" ");

    return {
      deviceType: "mobile",
      deviceInfo: [os, model || "Mobile app"].filter(Boolean).join(" · "),
    };
  },
});
