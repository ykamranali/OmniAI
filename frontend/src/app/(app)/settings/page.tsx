"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto p-6">
      <h1 className="mb-6 text-xl font-semibold">Settings</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your Omni Agent account.</CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-3">
          <Input defaultValue={user?.full_name ?? ""} placeholder="Full name" />
          <Input defaultValue={user?.email ?? ""} disabled />
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Default model</CardTitle>
          <CardDescription>Used for new conversations unless overridden.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <Button variant="destructive" onClick={logout}>
          Sign out
        </Button>
      </Card>
    </div>
  );
}
