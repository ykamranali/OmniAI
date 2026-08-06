"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/branding/LoadingScreen";
import { getAccessToken } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getAccessToken() ? "/chat" : "/login");
  }, [router]);

  return <LoadingScreen />;
}
