// ── Auth Context ──────────────────────────────────────────────────────────────
// Stores the logged-in user and token globally.
// Provides signIn / signOut so any component can log in or out.

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  isLoading: boolean; // true while reading localStorage on first load
}

const AuthContext = createContext<AuthContextType | null>(null);

// Decodes a JWT token without any external library.
// The payload is the second segment (base64-encoded JSON).
// Returns null if the token is malformed OR already expired.
function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check the expiry claim. JWT exp is in seconds; Date.now() is in ms.
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // token has expired
    }

    return {
      id:        payload.id,
      firstName: payload.firstName,
      lastName:  payload.lastName,
      email:     payload.email,
      role:      payload.role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first render, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setToken(stored);
        setUser(decoded);
      } else {
        // Token is invalid/expired — clean up
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  function signIn(newToken: string) {
    const decoded = decodeToken(newToken);
    if (decoded) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(decoded);
    }
  }

  function signOut() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// The hook — use this in any component to access auth state
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
