import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
} from '@/models/user.model';
import apiClient from '@/lib/api-client';

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(
    data: SignUpRequest,
  ): Promise<{ status: boolean; message: string }> {
    const response = await apiClient.post('/auth/SignUp', data);
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/Login', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/auth/change-password', data);
  },
};
