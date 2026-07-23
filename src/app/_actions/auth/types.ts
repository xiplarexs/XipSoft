import type { AuthUser } from "@/context/AuthContext";

export type { AuthUser };

export interface AuthActionResult {
  user: AuthUser | null;
  error?: string;
  session?: string;
}

export interface PasswordActionResult {
  success: boolean;
  error?: string;
}

export interface RequestPasswordResetResult {
  success: boolean;
  error?: string;
  message?: string;
}
