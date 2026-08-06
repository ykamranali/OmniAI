"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquarePlus,
  FolderKanban,
  Bot,
  Files,
  Image as ImageIcon,
  Box,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { OmniLogo } from "@/components/branding/OmniLogo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/chat", label: "New Chat", icon: MessageSquarePlus },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/files", label: "Files", icon: Files },
  { href: "/design", label: "Images", icon: ImageIcon },
  { href: "/three-studio", label: "3D Studio", icon: Box },
  { href: "/workspace", label: "Workspace", icon: LayoutGrid },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-4 border-r border-omni-border bg-omni-surface/60 p-4">
      <Link href="/chat" className="flex items-center gap-2 px-2 py-1">
        <OmniLogo size={28} />
        <span className="text-sm font-semibold omni-gradient-text">Omni Agent</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-omni-sm px-3 py-2 text-sm text-omni-muted transition-colors hover:bg-white/5 hover:text-omni-text",
                active && "bg-white/8 text-omni-text omni-gradient-border"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-omni-sm border border-omni-border p-3 text-xs text-omni-muted">
        Build Anything. Create Everything.
      </div>
    </aside>
  );
}
