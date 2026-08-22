import { io, type Socket } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || "";

let socket: Socket | null = null;
let registeredClientApp: "web" | "dashboard" = "web";

/**
 * Called once per app at startup (in ProviderWrapper) so the socket handshake
 * carries the right client-app identifier. The server uses it to pick the
 * correct namespaced cookie (web_accessToken vs dashboard_accessToken) instead
 * of always defaulting to the first cookie it finds.
 */
export function initChatSocket(clientApp: "web" | "dashboard") {
  registeredClientApp = clientApp;
  // If a socket was already created with the wrong identity, tear it down.
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(`${API_URL}/chat`, {
      withCredentials: true,
      autoConnect: false,
      auth: { clientApp: registeredClientApp },
      transports: ["websocket"],
    });
  }
  return socket;
}

export function destroyChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
