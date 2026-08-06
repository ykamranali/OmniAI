"use client";

import { Pin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-omni-border">
      <div className="p-3">
        <button
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-omni-sm border border-omni-border bg-white/5 py-2 text-sm hover:bg-white/10"
        >
          <Plus size={14} /> New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "mb-1 flex w-full items-center gap-2 rounded-omni-sm px-3 py-2 text-left text-sm text-omni-muted hover:bg-white/5 hover:text-omni-text",
              activeId === c.id && "bg-white/10 text-omni-text"
            )}
          >
            {c.pinned && <Pin size={12} className="shrink-0 text-omni-blue-glow" />}
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
