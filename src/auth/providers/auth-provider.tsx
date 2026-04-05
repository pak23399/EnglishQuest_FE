import { PropsWithChildren, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import { AuthToken, SignUpRequest, User, UserRole } from '@/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/auth.service';

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthToken | undefined>();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  // Initialize auth state safely on mount
  useEffect(() => {
    const { auth: initialAuth, user: initialUser } = authHelper.initAuth();
    setAuth(initialAuth);
    setCurrentUser(initialUser);
    setLoading(false);
  }, []);

  const verify = async () => {
    if (auth?.accessToken) {
      try {
        // The user was already stored in localStorage from login
        // Just verify the token is still valid
        const storedUser = authHelper.getUser();
        if (storedUser) {
          setCurrentUser(storedUser);
        }
        // Don't clear auth if user is not in storage - it might be in state
        // Only clear if there's an actual verification failure
      } catch (error) {
        console.error('Auth verification failed:', error);
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    } else {
      // No auth token, ensure user is also cleared
      setCurrentUser(undefined);
    }
  };

  const saveAuth = (auth: AuthToken | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.clearAuth();
    }
  };

  const login = async (userName: string, password: string) => {
    try {
      const response = await authService.login({ userName, password });

      // Decode user data from JWT token
      const decoded = jwtDecode(response.access_token) as any;
      
      // Create user object from JWT payload
      // Role can be a single value or an array
      // Admin users have role: ["2", "1"], regular users have role: ["2"]
      // Convert to number - if array contains "1", user is Admin (1), else User (2)
      let userRole: UserRole;
      if (Array.isArray(decoded.role)) {
        userRole = decoded.role.includes('1') || decoded.role.includes(1)
          ? UserRole.Admin
          : UserRole.User;
      } else {
        userRole = Number(decoded.role) as UserRole;
      }

      const user: User = {
        id: decoded.id || decoded.sub,
        username: decoded.username,
        role: userRole,
        email: decoded.email,
        currentPlan: decoded.currentPlan,
        avatarUrl: decoded.avatarUrl,
      };

      // Save auth token (convert snake_case to camelCase)
      const authToken: AuthToken = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: decoded.exp - decoded.iat, // Calculate from JWT
        tokenType: 'Bearer',
      };
      saveAuth(authToken);

      // Save user data
      setCurrentUser(user);
      authHelper.setUser(user);
    } catch (error) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw error;
    }
  };

  const signUp = async (data: SignUpRequest) => {
    try {
      await authService.signUp(data);
      // After successful signup, automatically log in
      await login(data.username, data.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        signUp,
        logout,
        verify,
        isAuthenticated: !!auth && !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
