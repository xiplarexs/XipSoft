"use client";

interface UpdateUserProfileData {
  [key: string]: any;
  display_name?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  website?: string | null;
  location?: string | null;
  social_links?: Record<string, string>;
}

interface UpdateSecurityData {
  userId: number | string;
  action: "setup2FA" | "disable2FA" | "changePassword" | "generateBackupCodes" | "verifyEmail" | "verify2FA";
  currentPassword?: string;
  newPassword?: string;
  code?: string;
}

async function updateUserProfile(userId: number | string, data: UpdateUserProfileData): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Baglantı hatası" };
  }
}

async function updateSecurity(data: UpdateSecurityData): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const res = await fetch("/api/user/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Baglantı hatası" };
  }
}

export const globalService = {
  user: {
    updateUserProfile,
    updateSecurity,
  },
};
