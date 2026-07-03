// ── All TypeScript types for the Vacation System ─────────────────────────────
//
// Naming convention:
//   *Data      → request payload sent TO the backend
//   *Response  → response payload received FROM the backend
//   *FormState → local React form state (before being sent)

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

/** Roles that a user can have. Controls which pages and features are visible. */
export type Role = 'user' | 'admin';

/** Decoded JWT payload — stored in AuthContext after login. */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

/** Request body sent to POST /auth/register */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Request body sent to POST /auth/login */
export interface LoginData {
  email: string;
  password: string;
}

/** Response from POST /auth/register and POST /auth/login */
export interface AuthResponse {
  token: string; // JWT — decoded client-side to get User fields
}

// ─────────────────────────────────────────────────────────────────────────────
// Vacations
// ─────────────────────────────────────────────────────────────────────────────

/** A single vacation record returned by the backend. */
export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;      // "YYYY-MM-DD" or ISO string
  endDate: string;        // "YYYY-MM-DD" or ISO string
  price: number;
  imageFileName: string;  // filename only — prepend IMAGES_URL to get full URL
  likesCount: number;
  isLiked: boolean;       // true if the current user liked this vacation
}

/**
 * Paginated response from GET /vacations.
 * The backend always returns exactly 9 vacations per page.
 */
export interface VacationsResponse {
  total: number;      // total vacations matching the filter
  page: number;       // current page number (1-based)
  pages: number;      // total number of pages
  vacations: Vacation[];
}

/** Query filter applied on the Vacations page. */
export type VacationFilter = 'all' | 'liked' | 'active' | 'upcoming';

/**
 * Local form state for Add Vacation and Edit Vacation.
 * All fields are strings because HTML inputs always return strings.
 * Convert price to number before sending to the backend.
 */
export interface VacationFormState {
  destination: string;
  description: string;
  startDate: string;  // "YYYY-MM-DD"
  endDate: string;    // "YYYY-MM-DD"
  price: string;      // converted to number on submit
}

// ─────────────────────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────────────────────

/** One row in the report: how many users liked a specific destination. */
export interface ReportRow {
  destination: string;
  likesCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI
// ─────────────────────────────────────────────────────────────────────────────

/** Request body for POST /ai */
export interface AiRequest {
  destination: string;
}

/** Response from POST /ai */
export interface AiResponse {
  recommendation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MCP
// ─────────────────────────────────────────────────────────────────────────────

/** Request body for POST /mcp */
export interface McpRequest {
  question: string;
}

/** Response from POST /mcp */
export interface McpResponse {
  answer: string;
}
