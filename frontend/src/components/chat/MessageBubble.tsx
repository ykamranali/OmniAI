"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { OmniLogo } from "@/components/branding/OmniLogo";

export function MessageBubble({ role, content }: { role: "user" | "assistant" | "system" | "tool"; content: string }) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 px-6 py-4", isUser && "flex-row-reverse")}>
      <div className="mt-1 shrink-0">
        {isUser ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-omni-blue to-omni-purple text-xs font-semibold text-white">
            You
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-omni-border bg-omni-surface">
            <OmniLogo size={18} />
          </div>
        )}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-omni px-4 py-3 text-sm leading-relaxed",
          isUser ? "bg-gradient-to-br from-omni-blue/20 to-omni-purple/20 border border-omni-border" : "omni-glass"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" customStyle={{ borderRadius: 12 }}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="rounded bg-white/10 px-1.5 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content || (role === "assistant" ? "..." : "")}
        </ReactMarkdown>
      </div>
    </div>
  );
}
