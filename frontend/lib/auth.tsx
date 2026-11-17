"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  fetchMe,
  loginRequest,
  signupRequest,
  type TokenResponse,
  type User,
} from "@/lib/api";

const TOKEN_KEY = "supportai_token";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean; // true while we check a saved token on page load
  login: (email: string, password: string) => Promise<User>;
  signup: (fullName: string, email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load: if a token was saved earlier, ask the backend who it belongs to
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const saved = localStorage.getItem(TOKEN_KEY);
      if (!saved) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const me = await fetchMe(saved);
        if (!cancelled) {
          setToken(saved);
          setUser(me);
        }
      } catch (error) {
        // Expired or invalid token: forget it. Network errors keep the token.
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveSession = useCallback((data: TokenResponse) => {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => saveSession(await loginRequest(email, password)),
    [saveSession],
  );

  const signup = useCallback(
    async (fullName: string, email: string, password: string) =>
      saveSession(await signupRequest(fullName, email, password)),
    [saveSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Any component can call useAuth() to get the user and the login/logout functions
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}