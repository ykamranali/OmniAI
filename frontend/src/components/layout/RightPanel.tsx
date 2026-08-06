"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight, ListTodo, Brain, Terminal as TerminalIcon, ScrollText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "preview" | "tasks" | "memory" | "terminal" | "logs";

const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Live Preview", icon: Eye },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "terminal", label: "Terminal", icon: TerminalIcon },
  { id: "logs", label: "Logs", icon: ScrollText },
];

export function RightPanel({ tabs }: { tabs?: Partial<Record<Tab, ReactNode>> }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<Tab>("tasks");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-full w-10 shrink-0 items-center justify-center border-l border-omni-border text-omni-muted hover:text-omni-text"
      >
        <ChevronRight size={16} className="rotate-180" />
      </button>
    );
  }

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-omni-border bg-omni-surface/60">
      <div className="flex items-center justify-between border-b border-omni-border px-3 py-2">
        <div className="flex gap-1">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={TABS.find((t) => t.id === id)?.label}
              className={cn(
                "rounded-omni-sm p-2 text-omni-muted hover:bg-white/5 hover:text-omni-text",
                active === id && "bg-white/10 text-omni-text"
              )}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
        <button onClick={() => setOpen(false)} className="text-omni-muted hover:text-omni-text">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm text-omni-muted">
        {tabs?.[active] ?? <p>No {active} content yet.</p>}
      </div>
    </aside>
  );
}
