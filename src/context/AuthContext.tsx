"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from 'js-cookie';
import { loginAction, getMeAction, registerAction, logoutAction } from "@/app/_actions/auth-actions";

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  role: string;
  rank_id?: number | null;
  reputation?: number;
  message_count?: number;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  job?: string | null;
  branch?: string | null;
  signature?: string | null;
  is_banned?: boolean;
  last_active?: string | null;
  created_at?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<void>;
  signUp: (email: string, displayName: string, password: string, captchaToken?: string, extraFields?: { birth_date?: string; city?: string; phone?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // PERF: HttpOnly cookie JS'den okunamaz, ama non-httponly bir "hint" cookie
    // varlıgını kontrol ederek DB çagrısını sadece giris yapmıs kullanıcılar için yapalım.
    // "xipsoft_logged_in" cookie'si login'de set edilir (httpOnly: false, güvenlik-hassas degil),
    // logout'ta silinir. Yoksa → kullanıcı giris yapmamıs → getMeAction() gereksiz.
    const hasSessionHint = document.cookie.includes("xipsoft_logged_in=1");

    if (!hasSessionHint) {
      setLoading(false);
      return;
    }

    const loadUserSession = async () => {
      try {
        const dbUser = await getMeAction();
        if (dbUser) setUser(dbUser);
      } catch (err) {
        console.error("[Auth] Session load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!user) return;
    try {
      const dbUser = await getMeAction();
      if (dbUser) setUser(dbUser);
    } catch (err) {
      console.error("Refresh auth error:", err);
    }
  }, [user]);

  const handleSignIn = useCallback(async (email: string, password: string, captchaToken?: string) => {
    const { user: dbUser, error } = await loginAction(email, password, { captchaToken });
    if (error || !dbUser) throw new Error(error ?? 'giris basarısız');
    setUser(dbUser);
    setAuthModalOpen(false);
  }, []);

  const handleSignUp = useCallback(async (email: string, displayName: string, password: string, captchaToken?: string, extraFields?: { birth_date?: string; city?: string; phone?: string }) => {
    const { user: dbUser, error } = await registerAction(email, displayName, password, { captchaToken, extraFields });
    if (error || !dbUser) throw new Error(error ?? 'Kayıt basarısız');
    setUser(dbUser);
    setAuthModalOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await logoutAction();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refresh: handleRefresh,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
