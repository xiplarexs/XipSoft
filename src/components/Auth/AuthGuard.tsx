"use client";

import { useAuth } from "@/hooks/useAuth";
import SignInPrompt from "./SignInPrompt";
import type { ReactNode } from "react";

export default function Authguard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-prism-violet/30 border-t-prism-violet rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  return <>{children}</>;
}
