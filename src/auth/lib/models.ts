// Define UUID type for consistent usage
export type UUID = string;

// Auth model representing the authentication session
export interface AuthModel {
  access_token: string;
  refresh_token?: string;
}
