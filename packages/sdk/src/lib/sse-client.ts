import { API_URL, CLIENT_APP, type ApiClientSessionAdapter } from "./api-client";

export type SseEventHandler = (payload: unknown) => void;

export interface SseSubscriptionOptions {
  /**
   * Session adapter - required for non-browser clients (Expo/mobile) that cannot
   * rely on httpOnly cookies. When provided the access token is appended as a
   * `?accessToken=` query param so the server can read it from the request.
   *
   * Browser clients (Next.js web / dashboard) use httpOnly cookies automatically
   * via `withCredentials: true` and do NOT need this.
   */
  sessionAdapter?: ApiClientSessionAdapter;
}

export interface SseSubscription {
  close: () => void;
}

/**
 * Creates a persistent SSE connection to an API endpoint.
 *
 * What it sends so the server accepts the request:
 *  - `?clientApp=<CLIENT_APP>` - tells the ClientContextMiddleware which app this
 *    is, so it can set `req.clientApp` and derive the matching `req.clientUrl`.
 *    Used as a query param because EventSource cannot send custom headers.
 *  - `withCredentials: true` - forwards the httpOnly auth cookie automatically for
 *    browser (Next.js) clients.
 *  - `?accessToken=<token>` - only added when a `sessionAdapter` is supplied (Expo).
 *
 * Server-side keepalive pings are sent every 25 s as `data: ping` - they are
 * silently ignored here so they don't trigger unnecessary query invalidations.
 */
export async function createSseSubscription(
  path: string,
  onMessage: SseEventHandler,
  options: SseSubscriptionOptions = {},
): Promise<SseSubscription> {
  if (typeof window === "undefined" || !API_URL) {
    return { close: () => {} };
  }

  const params = new URLSearchParams();

  if (CLIENT_APP) {
    params.set("clientApp", CLIENT_APP);
  }

  if (options.sessionAdapter) {
    try {
      const session = await options.sessionAdapter.getSession();
      if (session?.accessToken) {
        params.set("accessToken", session.accessToken);
      }
    } catch {
      // Silently skip - server will reject with 401 if token is missing
    }
  }

  const query = params.toString();
  const url = `${API_URL}${path}${query ? `?${query}` : ""}`;

  const es = new EventSource(url, { withCredentials: true });

  es.onmessage = (event: MessageEvent<string>) => {
    if (event.data === "ping") return;
    try {
      onMessage(JSON.parse(event.data));
    } catch {
      onMessage(event.data);
    }
  };

  return { close: () => es.close() };
}
