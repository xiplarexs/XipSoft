/**
 * Response Sanitization Layer
 * 
 * Centralized user data sanitization to prevent sensitive data leaks.
 * All server actions MUST use these functions before returning user data to client.
 * 
 * SECURITY: password_hash, uid, two_factor_secret NEVER sent to client
 */

export const USER_SELECT_FIELDS = {
  /** Fields for public profile queries */
  public: 'id, display_name, photo_url, role, rank_id, reputation, message_count, bio, website, location, job, branch, signature, is_banned, created_at, last_active',
  
  /** Fields for admin panel queries (includes email and activity) */
  admin: 'id, display_name, photo_url, role, rank_id, reputation, message_count, bio, website, location, job, branch, signature, is_banned, created_at, email, last_active, updated_at',
  
  /** Fields for authenticated user's own profile */
  owner: 'id, display_name, photo_url, role, rank_id, reputation, message_count, bio, website, location, job, branch, signature, is_banned, created_at, email, last_active, updated_at',
  
  /** Minimal fields for author info in posts/messages */
  author: 'id, display_name, photo_url, role, rank_id, reputation, created_at',
} as const;
