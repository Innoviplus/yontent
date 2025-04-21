
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * DEV MODE: This wrapper disables all auth/session/role checks.
 * All routes using <ProtectedRoute> will always render children without restriction.
 * Restore real logic before production!
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return <>{children}</>;
};

export default ProtectedRoute;

