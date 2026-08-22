import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { jwtVerify } from "jose";
import { parse as parseCookies } from "cookie";

import { InjectLogger } from "@/decorators/logger.decorator";
import { LoggerService } from "@/modules/logger/logger.service";
import { EnvService } from "@/modules/env/env.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

function extractToken(client: Socket): string | null {
  // Mobile: explicit handshake.auth.token (always wins)
  const authToken = client.handshake.auth?.token as string | undefined;
  if (typeof authToken === "string" && authToken.length > 0) return authToken;

  // Browser: httpOnly cookie, namespaced per app.
  // Use the clientApp hint sent by the web/dashboard socket so the right
  // cookie is picked even when both apps are open in the same browser.
  const cookieHeader = client.handshake.headers.cookie;
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    const clientApp = client.handshake.auth?.clientApp as string | undefined;

    if (clientApp === "dashboard") {
      return (
        cookies["dashboard_accessToken"] ??
        cookies["accessToken"] ??
        null
      );
    }

    // Default to web (also handles legacy cookie name)
    return (
      cookies["web_accessToken"] ??
      cookies["accessToken"] ??
      null
    );
  }

  return null;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: "/chat",
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  @InjectLogger()
  private readonly logger!: LoggerService;

  /** conversationId → Map<socketId, userId> */
  private readonly roomMembers = new Map<string, Map<string, string>>();

  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Auth middleware - runs before the client receives the connect event,
   * so client.data.userId/role are guaranteed set when any message handler fires.
   */
  afterInit(server: Server) {
    const secret = new TextEncoder().encode(this.env.get("JWT_ACCESS_SECRET"));

    server.use(async (client, next) => {
      try {
        const token = extractToken(client);
        if (!token) throw new Error("No token");

        const { payload } = await jwtVerify(token, secret);
        if (!payload.sub || !payload.rol) throw new Error("Invalid payload");

        client.data.userId = payload.sub as string;
        client.data.role = payload.rol as string;
        next();
      } catch (err) {
        this.logger.debug("Chat WS rejected", {
          socketId: client.id,
          reason: (err as Error).message,
        });
        next(new Error("Unauthorized"));
      }
    });
  }

  handleConnection(client: Socket) {
    this.logger.debug("Chat WS connected", {
      socketId: client.id,
      userId: client.data.userId,
      role: client.data.role,
    });

    // Auto-join a user-specific room so the conversations list on any screen
    // receives conversation-updated events without needing to join every room.
    void client.join(`user:${client.data.userId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug("Chat WS disconnected", { socketId: client.id });
    for (const [convId, room] of this.roomMembers) {
      room.delete(client.id);
      if (room.size === 0) this.roomMembers.delete(convId);
    }
  }

  @SubscribeMessage("join")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const ok = await this.canAccessConversation(
      conversationId,
      client.data.userId,
      client.data.role,
    );

    if (!ok) {
      client.emit("error", { message: "Access denied to conversation" });
      return;
    }

    await client.join(conversationId);

    // Track membership for delivery-receipt logic
    if (!this.roomMembers.has(conversationId)) {
      this.roomMembers.set(conversationId, new Map());
    }
    this.roomMembers.get(conversationId)!.set(client.id, client.data.userId);

    this.logger.debug("User joined conversation room", {
      userId: client.data.userId,
      conversationId,
    });

    // Catch-up delivery: emit message-delivered for any messages sent by others
    // that arrived while this user was offline/not in the room. This ensures
    // senders get their single-tick → double-tick transition even when the
    // recipient opens the chat after the message was sent.
    const undeliveredByOthers = await this.prisma.message.findMany({
      where: {
        conversationId,
        senderId: { not: client.data.userId },
        readAt: null,
      },
      select: { id: true },
    });

    for (const msg of undeliveredByOthers) {
      this.server.to(conversationId).emit("message-delivered", {
        messageId: msg.id,
        conversationId,
      });
    }
  }

  @SubscribeMessage("leave")
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    void client.leave(conversationId);
    const room = this.roomMembers.get(conversationId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) this.roomMembers.delete(conversationId);
    }
  }

  @SubscribeMessage("typing")
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const senderId = client.data.userId as string;
    const room = this.roomMembers.get(conversationId);
    if (!room) return;

    // Broadcast only to other users - excludes sender's own other devices
    for (const [socketId, userId] of room) {
      if (socketId !== client.id && userId !== senderId) {
        this.server.to(socketId).emit("typing", { conversationId, userId: senderId });
      }
    }
  }

  @SubscribeMessage("stop-typing")
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const senderId = client.data.userId as string;
    const room = this.roomMembers.get(conversationId);
    if (!room) return;

    for (const [socketId, userId] of room) {
      if (socketId !== client.id && userId !== senderId) {
        this.server.to(socketId).emit("stop-typing", { conversationId });
      }
    }
  }

  /** Called by ChatService after a message is persisted via REST */
  broadcastMessage(
    conversationId: string,
    message: any,
    participantUserIds: string[] = [],
  ) {
    this.server.to(conversationId).emit("message", message);

    // Notify every participant's user room so their conversations list updates
    // in real time even when they are not inside the conversation screen.
    for (const uid of participantUserIds) {
      this.server
        .to(`user:${uid}`)
        .emit("conversation-updated", { conversationId });
    }

    // If any recipient (not the sender) is currently in the room, mark as delivered
    const senderId = message?.sender?.id as string | undefined;
    const room = this.roomMembers.get(conversationId);
    if (room && senderId) {
      const hasOnlineRecipient = [...room.values()].some((uid) => uid !== senderId);
      if (hasOnlineRecipient) {
        this.server.to(conversationId).emit("message-delivered", {
          messageId: message.id,
          conversationId,
        });
      }
    }
  }

  /** Called by ChatService after a message is marked read via REST */
  broadcastMessageRead(
    conversationId: string,
    messageId: string,
    readAt: Date,
  ) {
    this.server.to(conversationId).emit("message-read", {
      messageId,
      conversationId,
      readAt,
    });
  }

  private async canAccessConversation(
    conversationId: string,
    userId: string,
    role: string,
  ): Promise<boolean> {
    if (role === "admin") return true;

    try {
      const conv = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
          assignedToId: true,
          patientId: true,
          patient: { select: { userId: true } },
          appointment: {
            select: {
              providerId: true,
              provider: { select: { userId: true } },
            },
          },
        },
      });

      if (!conv) return false;

      if (role === "patient") return conv.patient?.userId === userId;

      if (role === "staff" || role === "staff") {
        if (conv.assignedToId === userId) return true;
        if (conv.appointment?.provider?.userId === userId) return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
