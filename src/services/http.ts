import { config, isBackendConfigured } from '../config';

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isBackendConfigured) {
    throw new ApiError('Kissonde backend is not configured.', undefined, 'BACKEND_NOT_CONFIGURED');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? config.requestTimeoutMs);

  try {
    const response = await fetch(`${config.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });

    const raw = await response.text();
    let body: unknown = undefined;
    if (raw) {
      try { body = JSON.parse(raw); } catch { body = raw; }
    }

    if (!response.ok) {
      const structured = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
      const message = typeof structured.message === 'string' ? structured.message : `Request failed with status ${response.status}`;
      const code = typeof structured.code === 'string' ? structured.code : undefined;
      throw new ApiError(message, response.status, code);
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') throw new ApiError('Request timed out.', undefined, 'TIMEOUT');
    throw new ApiError('Network request failed.', undefined, 'NETWORK_ERROR');
  } finally {
    clearTimeout(timeout);
  }
}
