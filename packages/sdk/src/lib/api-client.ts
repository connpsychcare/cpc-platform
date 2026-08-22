import axios from "axios";
import qs from "qs";
import type { AuthTokensResponse } from "@workspace/contracts/auth";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuthExpired,
  emitAuthExpired,
  getAuthExpiredDetail,
} from "./auth-events";
import {
  ApiException,
  type ApiError,
  type ApiResponse,
  type ApiSuccess,
} from "./types";
import type { ClientApp } from "@workspace/contracts";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;

export const CLIENT_APP = (process.env.NEXT_PUBLIC_CLIENT_APP ||
  process.env.EXPO_PUBLIC_CLIENT_APP) as ClientApp;

export const isMobileClient = CLIENT_APP === "mobile";

type MaybePromise<T> = T | Promise<T>;

export interface ApiClientSessionAdapter {
  getSession: () => MaybePromise<AuthTokensResponse | null>;
  setSession: (session: AuthTokensResponse) => MaybePromise<void>;
  clearSession: () => MaybePromise<void>;
}

let apiClientSessionAdapter: ApiClientSessionAdapter | null = null;

export interface ApiClientDeviceInfo {
  deviceType?: string;
  deviceInfo?: string;
}

export interface ApiClientDeviceInfoAdapter {
  getDeviceInfo: () => MaybePromise<ApiClientDeviceInfo | null>;
}

let apiClientDeviceInfoAdapter: ApiClientDeviceInfoAdapter | null = null;

type ApiClientRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const ACCESS_TOKEN_ERROR_CODES = new Set([
  "access_token_missing",
  "access_token_expired",
  "access_token_invalid",
]);

const TERMINAL_AUTH_ERROR_CODES = new Set([
  "refresh_token_missing",
  "refresh_token_expired",
  "refresh_token_invalid",
  "session_expired",
]);

const isRefreshThrottled = (error: ApiException) => error.status === 429;

const createHttpClient = (): AxiosInstance =>
  axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30_000,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });

const hasSessionAdapter = () => apiClientSessionAdapter !== null;

const isAuthTokensResponse = (value: unknown): value is AuthTokensResponse => {
  if (!value || typeof value !== "object") return false;

  const tokens = value as Partial<AuthTokensResponse>;
  return (
    typeof tokens.accessToken === "string" &&
    typeof tokens.refreshToken === "string" &&
    typeof tokens.deviceId === "string"
  );
};

const extractAuthTokens = (
  payload: Pick<ApiSuccess<unknown>, "meta">,
): AuthTokensResponse | null => {
  return isAuthTokensResponse(payload.meta) ? payload.meta : null;
};

const syncSessionFromPayload = async (
  payload: Pick<ApiSuccess<unknown>, "meta">,
) => {
  const tokens = extractAuthTokens(payload);

  if (!tokens || !apiClientSessionAdapter) {
    return;
  }

  await apiClientSessionAdapter.setSession(tokens);
  clearAuthExpired();
};

export const configureApiClientSessionAdapter = (
  adapter: ApiClientSessionAdapter | null,
) => {
  apiClientSessionAdapter = adapter;
};

export const configureApiClientDeviceInfoAdapter = (
  adapter: ApiClientDeviceInfoAdapter | null,
) => {
  apiClientDeviceInfoAdapter = adapter;
};

export const clearApiClientSession = async () => {
  if (!apiClientSessionAdapter) {
    return;
  }

  await apiClientSessionAdapter.clearSession();
};

export const getApiClientRequestHeaders = async (options?: {
  includeRefreshToken?: boolean;
}) => {
  const headers: Record<string, string> = {};

  if (CLIENT_APP) {
    headers["x-client-app"] = CLIENT_APP;
  }

  Object.assign(headers, await getDeviceInfoHeaders());

  if (!apiClientSessionAdapter) {
    return headers;
  }

  const session = await apiClientSessionAdapter.getSession();

  if (session?.accessToken) {
    headers["x-access-token"] = session.accessToken;
  }

  if (session?.deviceId) {
    headers["x-device-id"] = session.deviceId;
  }

  if (options?.includeRefreshToken && session?.refreshToken) {
    headers["x-refresh-token"] = session.refreshToken;
  }

  return headers;
};

const applyClientHeaders = async (
  config: InternalAxiosRequestConfig,
  options?: {
    includeRefreshToken?: boolean;
  },
) => {
  config.headers = config.headers ?? {};

  // Let Axios generate the multipart boundary instead of forcing JSON headers.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (CLIENT_APP) {
    config.headers["x-client-app"] = CLIENT_APP;
  } else {
    delete config.headers["x-client-app"];
  }

  const deviceHeaders = await getDeviceInfoHeaders();
  if (deviceHeaders["x-device-type"]) {
    config.headers["x-device-type"] = deviceHeaders["x-device-type"];
  } else {
    delete config.headers["x-device-type"];
  }
  if (deviceHeaders["x-device-info"]) {
    config.headers["x-device-info"] = deviceHeaders["x-device-info"];
  } else {
    delete config.headers["x-device-info"];
  }

  if (config.url === "/auth/signin") {
    config.headers["x-trusted-device"] = String(
      config.data?.rememberDevice ?? false,
    );
  }

  if (!apiClientSessionAdapter) {
    delete config.headers["x-access-token"];
    delete config.headers["x-refresh-token"];
    delete config.headers["x-device-id"];

    return config;
  }

  const session = await apiClientSessionAdapter.getSession();

  if (session?.accessToken) {
    config.headers["x-access-token"] = session.accessToken;
  } else {
    delete config.headers["x-access-token"];
  }

  if (session?.deviceId) {
    config.headers["x-device-id"] = session.deviceId;
  } else {
    delete config.headers["x-device-id"];
  }

  if (options?.includeRefreshToken && session?.refreshToken) {
    config.headers["x-refresh-token"] = session.refreshToken;
  } else {
    delete config.headers["x-refresh-token"];
  }

  return config;
};

const getDeviceInfoHeaders = async () => {
  const headers: Record<string, string> = {};
  const deviceInfo = await apiClientDeviceInfoAdapter?.getDeviceInfo();

  if (deviceInfo?.deviceType) {
    headers["x-device-type"] = deviceInfo.deviceType;
  }

  if (deviceInfo?.deviceInfo) {
    headers["x-device-info"] = deviceInfo.deviceInfo;
  }

  return headers;
};

const resolveApiPayload = <T>(
  response: AxiosResponse<ApiResponse<T>>,
): ApiSuccess<T> => {
  const payload = response.data;

  if (!payload.success) {
    throw new ApiException(payload);
  }

  return payload;
};

const resolveApiPayloadWithSideEffects = async <T>(
  response: AxiosResponse<ApiResponse<T>>,
): Promise<ApiSuccess<T>> => {
  const payload = resolveApiPayload(response);
  await syncSessionFromPayload(payload as ApiSuccess<unknown>);
  return payload;
};

const toApiException = (err: unknown): ApiException => {
  if (err instanceof ApiException) {
    return err;
  }

  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_CANCELED") {
      return new ApiException({
        message: "Request canceled",
        status: 499,
      });
    }

    const res = err.response?.data as ApiError | undefined;

    return new ApiException({
      message: res?.message ?? "Network error",
      status: res?.status ?? 0,
      action: res?.action,
      errorCode: res?.errorCode,
      meta: res?.meta,
    });
  }

  return new ApiException({
    message: "Unexpected error",
    status: 0,
  });
};

const shouldRefreshRequest = (error: ApiException) =>
  !getAuthExpiredDetail() &&
  error.status === 401 &&
  !!error.errorCode &&
  ACCESS_TOKEN_ERROR_CODES.has(error.errorCode);

const isTerminalAuthError = (error: ApiException) =>
  !!error.errorCode && TERMINAL_AUTH_ERROR_CODES.has(error.errorCode);

const emitTerminalAuthExpired = async (error: ApiException) => {
  if (!isTerminalAuthError(error) && !isRefreshThrottled(error)) return;

  await clearApiClientSession();

  emitAuthExpired({
    errorCode: error.errorCode ?? "refresh_throttled",
    message:
      error.status === 429
        ? "Your session could not be refreshed right now. Please sign in again."
        : error.message,
    status: error.status,
  });
};

export const apiClient: AxiosInstance = createHttpClient();

const refreshClient = createHttpClient();
let refreshPromise: Promise<void> | null = null;

const ensureSessionRefreshed = async () => {
  if (isMobileClient && !hasSessionAdapter()) {
    throw new ApiException({
      message: "Session refresh is unavailable in this environment.",
      status: 401,
    });
  }

  if (isMobileClient) {
    const session = await apiClientSessionAdapter?.getSession();
    if (!session?.refreshToken) {
      const error = new ApiException({
        message: "Your session has expired. Please sign in again.",
        status: 401,
        errorCode: "refresh_token_missing",
      });
      await emitTerminalAuthExpired(error);
      throw error;
    }
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiResponse<unknown>>("/auth/refresh")
      .then((response) => resolveApiPayloadWithSideEffects(response))
      .then(() => undefined)
      .catch(async (error) => {
        const apiError = toApiException(error);
        await emitTerminalAuthExpired(apiError);
        throw apiError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => applyClientHeaders(config));
refreshClient.interceptors.request.use((config) =>
  applyClientHeaders(config, { includeRefreshToken: true }),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as ApiClientRequestConfig | undefined;
    const apiError = toApiException(error);

    if (!originalRequest || originalRequest.skipAuthRefresh) {
      throw apiError;
    }

    if (isTerminalAuthError(apiError)) {
      await emitTerminalAuthExpired(apiError);
      throw apiError;
    }

    if (!shouldRefreshRequest(apiError) || originalRequest._retry) {
      throw apiError;
    }

    originalRequest._retry = true;
    await ensureSessionRefreshed();
    return apiClient(originalRequest);
  },
);

export const refreshSession = async <T = null>() =>
  resolveApiPayloadWithSideEffects(
    await refreshClient.post<ApiResponse<T>>("/auth/refresh"),
  );

export const executeApi = async <T = null>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiSuccess<T>> => {
  try {
    return await resolveApiPayloadWithSideEffects(await fn());
  } catch (err: unknown) {
    throw toApiException(err);
  }
};

export default apiClient;
