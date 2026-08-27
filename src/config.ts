export const config = {
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, ''),
  requestTimeoutMs: 12000,
};

export const isBackendConfigured = config.apiBaseUrl.length > 0;
