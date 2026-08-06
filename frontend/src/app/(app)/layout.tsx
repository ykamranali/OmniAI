"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingScreen } from "@/components/branding/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <LoadingScreen />;

  return <AppShell>{children}</AppShell>;
}
