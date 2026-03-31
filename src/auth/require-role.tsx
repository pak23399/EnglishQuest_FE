import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import { UserRole } from '@/models/user.model';
import { ROUTE_PATHS } from '@/routing/paths';

interface RequireRoleProps {
  children: ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

/**
 * Component that protects routes by requiring a specific user role.
 * If the user doesn't have the required role, they are redirected.
 */
export function RequireRole({
  children,
  requiredRole,
  redirectTo = ROUTE_PATHS.ERROR_403,
}: RequireRoleProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for auth to load
  if (loading) {
    return null;
  }

  // Check if user has the required role
  if (!user || user.role !== requiredRole) {
    // Redirect to 403 or custom path, preserving the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * Component specifically for protecting admin routes.
 * Shorthand for RequireRole with Admin role.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  return (
    <RequireRole requiredRole={UserRole.Admin}>
      {children}
    </RequireRole>
  );
}
