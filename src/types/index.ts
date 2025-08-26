// types/index.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *
 * Based on the user object in the /auth/login and /auth/register responses.
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  provider: string; 
  created_at: string;
  updated_at: string;
  settings?: Record<string, any>; 
}

/**
 * Represents the entire successful authentication response from backend.
 * 
 */
export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: IUser;
}