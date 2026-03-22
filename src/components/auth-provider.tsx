"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  login: async () => ({ success: false }),
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = "auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setUser(parsed);
        }
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; message?: string }> => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.authorized && data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
          return { success: true };
        }

        return {
          success: false,
          message: data.message || "Authentication failed",
        };
      } catch {
        return { success: false, message: "Failed to connect to server" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isHydrated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
