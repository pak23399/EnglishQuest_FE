import { AuthToken } from '@/models/auth.model';
import { IEmployee } from '@/models/employee/employee.model';
import { IUser, USER_ROLES, UserRole } from '@/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { loginApi, logoutApi } from '@/services/auth.service';
import { getEmployeeByUserIdApi } from '@/services/employee.service';
import { getAuth } from '../lib/helpers';

export const AuthAdapter = {
  login: async (userName: string, password: string): Promise<AuthToken> => {
    try {
      const token = await loginApi({ userName, password });
      return token;
    } catch (error) {
      throw error;
    }
  },

  async signInEpsSSO(): Promise<void> {
    // TODO: Implement EPS SSO login
    throw new Error('EPS SSO login is not implemented yet');
  },

  register: async () => {
    throw new Error('Registration is disabled in mock mode');
  },

  getCurrentUser: async (): Promise<IUser> => {
    const token = getAuth();
    if (!token) throw new Error('Not logged in');
    const payload = jwtDecode(token.accessToken) as any;
    if (!payload?.id || !payload?.username) {
      throw new Error('Invalid token payload');
    }

    const roles: UserRole[] = Array.isArray(payload.role)
      ? payload.role.map((role: string) => Number(role))
      : payload.role
        ? [Number(payload.role)]
        : [];

    roles.push(USER_ROLES.EXAMINER);

    return {
      id: payload.id,
      userName: payload.username,
      roles: roles,
    };
  },

  getCurrentEmployee: async (): Promise<IEmployee> => {
    const token = getAuth();
    if (!token) throw new Error('Not logged in');

    return await getEmployeeByUserIdApi(token.accessToken);
  },

  // updateUserProfile: async (data: Partial<IUser>): Promise<IUser> => {
  //   return { ...MOCK_USER, ...data };
  // },

  logout: async () => {
    await logoutApi();
  },

  requestPasswordReset: async () => {
    console.warn('Mock: password reset requested');
  },

  resetPassword: async () => {
    console.warn('Mock: password reset');
  },

  resendVerificationEmail: async () => {
    console.warn('Mock: resend verification');
  },
};
