// ── Centralized API service ───────────────────────────────────────────────────
// ALL backend calls go through this single file.
//
// Design decisions:
//   • BASE_URL is read from the VITE_API_URL environment variable so the
//     backend address can be changed without touching source code.
//   • The JWT token is attached to every authenticated request automatically.
//   • ApiError carries the HTTP status code so pages can react differently
//     to 401 (wrong password) vs 409 (email already taken), etc.

import type {
  AiResponse,
  AuthResponse,
  LoginData,
  McpResponse,
  RegisterData,
  ReportRow,
  Vacation,
  VacationFilter,
  VacationsResponse,
} from '../types';

// ── Configuration ─────────────────────────────────────────────────────────────
// Set VITE_API_URL in frontend/.env to override (e.g. for production).

const BASE_URL   = import.meta.env.VITE_API_URL   ?? 'http://localhost:3001/api';
const IMAGES_HOST = import.meta.env.VITE_IMAGES_HOST ?? 'http://localhost:3001';

export const IMAGES_URL = `${IMAGES_HOST}/uploads`;

// ── ApiError — carries HTTP status + message ──────────────────────────────────
//
// Usage in a page:
//   } catch (err) {
//     if (err instanceof ApiError && err.status === 409)
//       setError('Email is already registered');
//   }

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Private helpers ───────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('token');
}

/** Returns the Authorization header when a token exists, empty object otherwise. */
function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Reads a fetch Response and:
 *  - throws ApiError (with status + server message) when !res.ok
 *  - returns undefined for 204 No Content
 *  - parses JSON otherwise
 *
 * Special case: a 401 response means the token is expired or invalid.
 * We remove it from localStorage so the next AuthContext read clears the
 * session — the user will see the login page on their next navigation.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      // Stale / expired token — remove it so the app re-reads it as "logged out".
      localStorage.removeItem('token');
    }
    const body = await res.json().catch(() => ({}));
    const msg  = (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  const text = await res.text();
  if (!text) return undefined as unknown as T; // 204 No Content
  return JSON.parse(text) as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(res);
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(res);
}

// ── Vacations ─────────────────────────────────────────────────────────────────

// The backend returns snake_case fields; map them to the camelCase Vacation type.
interface RawVacation {
  vacation_id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number | string;
  image_filename: string;
  likesCount: number;
  isLiked: boolean;
}

function mapVacation(raw: RawVacation): Vacation {
  return {
    id: raw.vacation_id,
    destination: raw.destination,
    description: raw.description,
    startDate: raw.start_date,
    endDate: raw.end_date,
    price: Number(raw.price),
    imageFileName: raw.image_filename,
    likesCount: raw.likesCount ?? 0,
    isLiked: raw.isLiked ?? false,
  };
}

export async function getVacations(
  page = 1,
  filter: VacationFilter = 'all',
): Promise<VacationsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    filter,
    limit: '9',
  });
  const res = await fetch(`${BASE_URL}/vacations?${params}`, {
    headers: authHeaders(),
  });
  const raw = await handleResponse<{ total: number; page: number; pages: number; vacations: RawVacation[] }>(res);
  return { ...raw, vacations: raw.vacations.map(mapVacation) };
}

export async function getVacationById(id: number): Promise<Vacation> {
  const res = await fetch(`${BASE_URL}/vacations/${id}`, {
    headers: authHeaders(),
  });
  const raw = await handleResponse<RawVacation>(res);
  return mapVacation(raw);
}

export async function createVacation(formData: FormData): Promise<Vacation> {
  const res = await fetch(`${BASE_URL}/vacations`, {
    method: 'POST',
    headers: authHeaders(), // NOTE: do NOT set Content-Type; browser sets multipart boundary
    body: formData,
  });
  const raw = await handleResponse<RawVacation>(res);
  return mapVacation(raw);
}

export async function updateVacation(id: number, formData: FormData): Promise<Vacation> {
  const res = await fetch(`${BASE_URL}/vacations/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  const raw = await handleResponse<RawVacation>(res);
  return mapVacation(raw);
}

export async function deleteVacation(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/vacations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<void>(res);
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export async function likeVacation(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/likes/${id}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<void>(res);
}

export async function unlikeVacation(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/likes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<void>(res);
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function getReport(): Promise<ReportRow[]> {
  const res = await fetch(`${BASE_URL}/reports`, {
    headers: authHeaders(),
  });
  return handleResponse<ReportRow[]>(res);
}

export async function downloadReportCsv(): Promise<void> {
  const res = await fetch(`${BASE_URL}/reports/csv`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to download CSV');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vacation-report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── AI ────────────────────────────────────────────────────────────────────────

export async function getAiRecommendation(destination: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/ai`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination }),
  });
  const data = await handleResponse<AiResponse>(res);
  return data.recommendation;
}

// ── MCP ───────────────────────────────────────────────────────────────────────

export async function askMcp(question: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/mcp`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  const data = await handleResponse<McpResponse>(res);
  return data.answer;
}
