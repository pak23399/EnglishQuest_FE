import { AuthToken, User, UserRole } from '@/models/user.model';
import { getData, setData } from '@/lib/storage';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION || '1.0'
}`;

const USER_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-user-v${
  import.meta.env.VITE_APP_VERSION || '1.0'
}`;

/**
 * Get stored auth information from local storage
 */
const getAuth = (): AuthToken | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthToken | undefined;
    return auth;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    return undefined;
  }
};

/**
 * Save auth information to local storage
 */
const setAuth = (auth: AuthToken) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

/**
 * Remove auth information from local storage
 */
const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

/**
 * Clear all auth data
 */
const clearAuth = () => {
  removeAuth();
};

/**
 * Get stored user from local storage
 */
const getUser = (): User | undefined => {
  try {
    const user = getData(USER_LOCAL_STORAGE_KEY) as User | undefined;
    return user;
  } catch (error) {
    console.error('USER LOCAL STORAGE PARSE ERROR', error);
    return undefined;
  }
};

/**
 * Save user to local storage
 */
const setUser = (user: User) => {
  setData(USER_LOCAL_STORAGE_KEY, user);
};

/**
 * Check if user has specific role
 */
const hasRole = (user: User | null | undefined, role: UserRole): boolean => {
  return user?.role === role;
};

/**
 * Check if user is admin
 */
const isAdmin = (user: User | null | undefined): boolean => {
  return user?.role === UserRole.Admin;
};

/**
 * Initialize auth - load stored auth and user data
 */
const initAuth = (): { auth?: AuthToken; user?: User } => {
  const auth = getAuth();
  const user = getUser();
  return { auth, user };
};

export {
  AUTH_LOCAL_STORAGE_KEY,
  USER_LOCAL_STORAGE_KEY,
  getAuth,
  setAuth,
  removeAuth,
  clearAuth,
  getUser,
  setUser,
  hasRole,
  isAdmin,
  initAuth,
};
