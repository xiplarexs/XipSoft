/**
 * Public types for user-facing API responses
 */

export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PublicMedia {
  url: string;
  sizes?: {
    avatar?: { url: string };
    banner?: { url: string };
    thumbnail?: { url: string };
  };
  type?: 'avatar' | 'banner' | 'thumbnail';
  uploadedAt?: string;
}

export interface PublicUser {
  id: string;
  uid: string;
  username: string;
  email: string;
  display_name: string;
  avatar?: string | PublicMedia;
  banner?: string | PublicMedia;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  reputation?: number;
  message_count?: number;
  rank_id?: number | null;
  role?: 'user' | 'moderator' | 'admin';
  is_banned?: boolean;
  created_at?: string;
  updated_at?: string;
}
