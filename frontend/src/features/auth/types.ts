export type UserRole = "admin" | "manager" | "viewer";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  role: UserRole;
  created_at?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
