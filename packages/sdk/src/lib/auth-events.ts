export interface AuthExpiredDetail {
  errorCode?: string;
  message?: string;
  status?: number;
}

let latestAuthExpiredDetail: AuthExpiredDetail | null = null;

const authExpiredListeners = new Set<
  (detail: AuthExpiredDetail) => void | Promise<void>
>();

export const emitAuthExpired = (detail: AuthExpiredDetail = {}) => {
  latestAuthExpiredDetail = detail;

  authExpiredListeners.forEach((listener) => {
    void listener(detail);
  });
};

export const getAuthExpiredDetail = () => latestAuthExpiredDetail;

export const clearAuthExpired = () => {
  latestAuthExpiredDetail = null;
};

export const onAuthExpired = (
  handler: (detail: AuthExpiredDetail) => void,
) => {
  authExpiredListeners.add(handler);

  return () => {
    authExpiredListeners.delete(handler);
  };
};
