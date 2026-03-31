export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  currentPlan?: SubscriptionPlan;
  avatarUrl?: string;
}

export enum UserRole {
  Admin = 1,
  User = 2,
}

export enum SubscriptionPlan {
  Free = 0,
  Support = 1,
  Premium = 2,
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
