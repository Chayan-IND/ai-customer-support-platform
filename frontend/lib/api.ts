// Small helper for talking to the FastAPI backend.
// Every page uses these functions instead of calling fetch() directly.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type User = {
  id: number;
  email: string;
  role: string;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

// An error that also remembers the HTTP status (401, 409, ...)
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Turn FastAPI's error body into one readable sentence
function readErrorMessage(data: unknown): string {
  const detail = (data as { detail?: unknown } | null)?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  // Validation errors (422) come as a list: [{ loc: [...], msg: "..." }]
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { loc?: unknown[]; msg?: string };
    const field = first.loc?.[first.loc.length - 1];
    return field ? `${String(field)}: ${first.msg ?? "invalid value"}` : (first.msg ?? "Invalid data");
  }

  return "Something went wrong. Please try again.";
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    // fetch only throws when the server cannot be reached at all
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      // the error body was not JSON, keep the generic message
    }
    throw new ApiError(readErrorMessage(data), response.status);
  }

  return (await response.json()) as T;
}

export function loginRequest(email: string, password: string) {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function signupRequest(fullName: string, email: string, password: string) {
  return request<TokenResponse>("/auth/signup", {
    method: "POST",
    body: { full_name: fullName, email, password },
  });
}

export function fetchMe(token: string) {
  return request<User>("/me", { token });
}