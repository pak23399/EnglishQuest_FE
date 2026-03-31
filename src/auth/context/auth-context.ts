import { createContext, useContext } from 'react';
import { AuthToken, SignUpRequest, User } from '@/models/user.model';

// Create AuthContext with types
export const AuthContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  auth?: AuthToken;
  saveAuth: (auth: AuthToken | undefined) => void;
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  login: (userName: string, password: string) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
  isAuthenticated: boolean;
}>({
  loading: false,
  setLoading: () => {},
  saveAuth: () => {},
  setUser: () => {},
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  verify: async () => {},
  isAuthenticated: false,
});

// Hook definition
export function useAuth() {
  return useContext(AuthContext);
}
