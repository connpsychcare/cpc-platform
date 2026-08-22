const FIREBASE_VERSION = "12.11.0";

const { searchParams } = new URL(self.location.href);

const config = {
  apiKey: searchParams.get("apiKey"),
  authDomain: searchParams.get("authDomain"),
  projectId: searchParams.get("projectId"),
  storageBucket: searchParams.get("storageBucket"),
  messagingSenderId: searchParams.get("messagingSenderId"),
  appId: searchParams.get("appId"),
  measurementId: searchParams.get("measurementId") || undefined,
};

const isValid = ["apiKey", "projectId", "messagingSenderId", "appId"].every(
  (k) => config[k],
);

if (isValid) {
  importScripts(
    `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`,
    `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`,
  );

  firebase.initializeApp(config);

  firebase.messaging().onBackgroundMessage(({ notification, data }) => {
    const tag = data?.notificationId ?? data?.href ?? undefined;
    self.registration.showNotification(
      notification?.title ?? "New notification",
      {
        body: notification?.body,
        icon: "/icon-192.png",
        tag,
        data,
      },
    );
  });
}

self.addEventListener("message", (e) => {
  if (e.data?.type === "CLOSE_NOTIFICATION" && e.data.tag) {
    self.registration.getNotifications({ tag: e.data.tag }).then((list) => {
      list.forEach((n) => n.close());
    });
  }
});

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url;
  if (!url) return;

  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => "focus" in c);
        return existing
          ? existing.navigate(url).then(() => existing.focus())
          : self.clients.openWindow(url);
      }),
  );
});
