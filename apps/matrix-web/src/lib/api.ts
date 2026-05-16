const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bm_token');
}

export function setToken(token: string) {
  localStorage.setItem('bm_token', token);
}

export function clearToken() {
  localStorage.removeItem('bm_token');
  localStorage.removeItem('bm_business_id');
  localStorage.removeItem('bm_org_id');
}

export function getBusinessId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bm_business_id');
}

export function setBusinessId(id: number) {
  localStorage.setItem('bm_business_id', String(id));
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const businessId = getBusinessId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (businessId) headers['X-Business-Id'] = businessId;

  const res = await fetch(`${API_URL}/api/v1${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export { API_URL };
