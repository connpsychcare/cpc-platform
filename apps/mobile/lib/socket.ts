import { io, type Socket } from "socket.io-client";
import { getStoredAuthSession } from "./auth-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

let socket: Socket | null = null;

export async function getChatSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const session = await getStoredAuthSession();

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(`${API_URL}/chat`, {
    auth: { token: session?.accessToken ?? "" },
    autoConnect: false,
    transports: ["websocket"],
  });

  return socket;
}

export function destroyChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
