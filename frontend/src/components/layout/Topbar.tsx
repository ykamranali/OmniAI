"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";

const MODELS = ["gpt-4o-mini", "gpt-4o", "claude-sonnet", "gemini-pro", "llama3.1"];

export function Topbar() {
  const { user, logout } = useAuth();
  const [model, setModel] = useState(MODELS[0]);
  const initials = (user?.full_name ?? user?.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-omni-border px-6">
      <div className="flex items-center gap-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="rounded-omni-sm border border-omni-border bg-white/5 px-3 py-1.5 text-sm text-omni-text focus:outline-none"
        >
          {MODELS.map((m) => (
            <option key={m} value={m} className="bg-omni-surface">
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-omni-border bg-white/5 px-4 py-1.5">
          <Search size={14} className="text-omni-muted" />
          <input
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-omni-text placeholder:text-omni-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-omni-muted hover:text-omni-text">
          <Bell size={18} />
        </button>
        <button onClick={logout} title="Sign out">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
