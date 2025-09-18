export type JwtPayload = {
  exp?: number;
  role?: string;
  roles?: string[];
  isAdmin?: boolean;
  [key: string]: any;
};

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function decodeJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false; // no exp claim -> assume not expired
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= payload.exp;
}

export function isLoggedIn(): boolean {
  const token = getToken();
  const payload = decodeJwtPayload(token);
  if (!token || !payload) return false;
  return !isExpired(payload);
}

export function isAdmin(): boolean {
  const token = getToken();
  const payload = decodeJwtPayload(token);
  if (!payload || isExpired(payload)) return false;
  if (payload.isAdmin === true) return true;
  if (
    typeof payload.role === "string" &&
    payload.role.toLowerCase() === "admin"
  )
    return true;
  if (
    Array.isArray(payload.roles) &&
    payload.roles.some((r) => String(r).toLowerCase() === "admin")
  )
    return true;
  return false;
}

import { useEffect, useState } from "react";
export function useAuth() {
  const read = () => {
    const token = getToken();
    const payload = decodeJwtPayload(token);
    return {
      token,
      payload,
      loggedIn: !!token && !!payload && !isExpired(payload),
      admin:
        !!payload &&
        !isExpired(payload) &&
        (payload.isAdmin === true ||
          (typeof payload.role === "string" &&
            payload.role.toLowerCase() === "admin") ||
          (Array.isArray(payload.roles) &&
            payload.roles.some((r) => String(r).toLowerCase() === "admin"))),
    } as const;
  };

  const [state, setState] = useState(read);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setState(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return state;
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
