/* eslint-disable @typescript-eslint/no-unused-vars */
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";

// ─── Config ──────────────────────────────────────────────────────────────────

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
  measurementId?: string;
};

function getConfig(): FirebaseConfig {
  const raw = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const missing = (Object.keys(raw) as (keyof typeof raw)[]).filter(
    (k) => k !== "measurementId" && !raw[k],
  );

  if (missing.length) {
    throw new Error(`Firebase: missing env vars: ${missing.join(", ")}`);
  }

  return raw as FirebaseConfig;
}

// ─── App & Messaging ─────────────────────────────────────────────────────────

function getFirebaseApp() {
  if (getApps().length) return getApp();
  const { vapidKey: _, measurementId, ...appConfig } = getConfig();
  return initializeApp({ ...appConfig, measurementId });
}

async function getFirebaseMessaging() {
  if (typeof window === "undefined") {
    throw new Error("Push notifications are only available in the browser.");
  }
  if (!(await isSupported())) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }
  return getMessaging(getFirebaseApp());
}

// ─── Service Worker ───────────────────────────────────────────────────────────

function buildSwUrl() {
  const { vapidKey: _, measurementId, ...swConfig } = getConfig();
  const params = new URLSearchParams(
    Object.entries({
      ...swConfig,
      ...(measurementId ? { measurementId } : {}),
    }),
  );
  return `/firebase-messaging-sw.js?${params}`;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("This browser does not support service workers.");
  }
  return navigator.serviceWorker.register(buildSwUrl(), {
    updateViaCache: "none",
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Register the SW silently - call early so it's ready before permission is requested. */
export async function primeFirebaseMessaging() {
  await registerServiceWorker();
}

/** Request permission, register SW, and return an FCM push token. */
export async function getFirebasePushToken(): Promise<string> {
  if (Notification.permission === "denied") {
    throw new Error("Browser notification permission was denied.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Browser notification permission was not granted.");
  }

  const [messaging, serviceWorkerRegistration] = await Promise.all([
    getFirebaseMessaging(),
    registerServiceWorker(),
  ]);

  const token = await getToken(messaging, {
    vapidKey: getConfig().vapidKey,
    serviceWorkerRegistration,
  });

  if (!token) throw new Error("Unable to obtain a push token.");

  return token;
}

/** Delete the local FCM token (best-effort - server-side removal is authoritative). */
export async function deleteFirebasePushToken() {
  try {
    const messaging = await getFirebaseMessaging();
    await deleteToken(messaging);
  } catch {
    // Swallow - server token removal is what actually stops pushes.
  }
}

/** Subscribe to foreground messages. Returns an unsubscribe function. */
export async function subscribeToForegroundMessages(
  handler: (payload: MessagePayload) => void,
): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  return onMessage(messaging, handler);
}
