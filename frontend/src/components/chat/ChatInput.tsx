"use client";

import { useState, type KeyboardEvent } from "react";
import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatInput({ onSend, disabled }: { onSend: (content: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="omni-glass mx-6 mb-6 flex items-end gap-2 rounded-omni p-3">
      <button className="p-2 text-omni-muted hover:text-omni-text" title="Attach file">
        <Paperclip size={18} />
      </button>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Message Omni Agent..."
        className="max-h-40 flex-1 resize-none bg-transparent py-2 text-sm text-omni-text placeholder:text-omni-muted focus:outline-none"
      />
      <button className="p-2 text-omni-muted hover:text-omni-text" title="Voice input">
        <Mic size={18} />
      </button>
      <Button size="icon" onClick={submit} disabled={disabled || !value.trim()}>
        <SendHorizontal size={16} />
      </Button>
    </div>
  );
}
