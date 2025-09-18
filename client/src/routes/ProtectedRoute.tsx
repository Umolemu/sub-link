import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isLoggedIn, isAdmin } from "../utils/auth";

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const loggedIn = isLoggedIn();
  if (!loggedIn) return <Navigate to="/" replace />;

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
