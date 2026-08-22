import type { ExpoConfig } from "expo/config";

type AppVariant = "development" | "preview" | "production";

const profileToVariant: Record<string, AppVariant> = {
  development: "development",
  preview: "preview",
  production: "production",
};

const resolveVariant = (): AppVariant => {
  const explicitVariant = process.env.APP_VARIANT;

  if (
    explicitVariant === "development" ||
    explicitVariant === "preview" ||
    explicitVariant === "production"
  ) {
    return explicitVariant;
  }

  const buildProfile = process.env.EAS_BUILD_PROFILE;
  return profileToVariant[buildProfile ?? ""] ?? "development";
};

const variant = resolveVariant();

const variantConfig = {
  development: {
    name: "Connected Psychiatric Care Dev",
    scheme: "ConnectedPsychiatricCaredev",
    bundleId: "com.zhxlabs.ConnectedPsychiatricCare.dev",
    googleServicesFile: "./google-services.dev.json",
  },
  preview: {
    name: "Connected Psychiatric Care Preview",
    scheme: "ConnectedPsychiatricCarepreview",
    bundleId: "com.zhxlabs.ConnectedPsychiatricCare.preview",
    googleServicesFile: "./google-services.preview.json",
  },
  production: {
    name: "Connected Psychiatric Care",
    scheme: "ConnectedPsychiatricCare",
    bundleId: "com.zhxlabs.ConnectedPsychiatricCare",
    googleServicesFile: "./google-services.prod.json",
  },
};

const currentVariant = variantConfig[variant];

const config: ExpoConfig = {
  name: currentVariant.name,
  slug: "cpc-platform",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: currentVariant.scheme,
  owner: "connpsychcare",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: currentVariant.bundleId,
    associatedDomains: ["applinks:connectedpsychiatriccare.com"],
    usesAppleSignIn: true,
    googleServicesFile:
      variant === "production"
        ? "./GoogleService-Info.prod.plist"
        : variant === "preview"
          ? "./GoogleService-Info.preview.plist"
          : "./GoogleService-Info.dev.plist",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      backgroundColor: "#FDFAF4",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: currentVariant.bundleId,
    googleServicesFile: currentVariant.googleServicesFile,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "./plugins/withPodfileModularHeaders",
    "expo-router",
    [
      "@stripe/stripe-react-native",
      {
        enableGooglePay: true,
        merchantIdentifier: "merchant.com.zhxlabs.ConnectedPsychiatricCare",
      },
    ],
    "expo-web-browser",
    "@react-native-google-signin/google-signin",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/icon-transparent.png",
        imageWidth: 180,
        resizeMode: "contain",
        backgroundColor: "#FDFAF4",
        dark: {
          backgroundColor: "#02060F",
        },
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        color: "#1659DB",
        defaultChannel: "default",
        sounds: [],
      },
    ],
    [
      "expo-asset",
      {
        assets: ["./assets/images"],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    appVariant: variant,
    eas: {
      projectId: "395c5b10-89de-4d37-9044-18546d244a2c",
    },
    router: {},
  },
};

export default config;
