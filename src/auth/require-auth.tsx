// import { Outlet } from 'react-router-dom';

/**
 * Component to protect routes that require authentication.
 * TEMPORARY: Authentication disabled for development
 * TODO: Re-enable authentication checks before production
 */
// export const RequireAuth = () => {
//   // TEMPORARY: Skip all authentication checks
//   return <Outlet />;
// };

// ===== COMMENTED OUT - ORIGINAL AUTHENTICATION CODE =====
import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
  const { auth, verify, loading: globalLoading, user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // If we have auth token and haven't verified yet, verify
      if (auth?.accessToken && !hasVerified.current) {
        hasVerified.current = true;
        try {
          await verify();
        } catch (error) {
          console.error('Verification error:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [auth?.accessToken, verify]);

  // Show screen loader while checking authentication
  if (loading || globalLoading) {
    return <ScreenLoader />;
  }

  // If not authenticated (need both auth token and user), redirect to login
  if (!auth?.accessToken || !user) {
    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If authenticated, render child routes
  return <Outlet />;
};
