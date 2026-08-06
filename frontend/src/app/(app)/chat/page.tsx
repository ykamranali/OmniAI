"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatMessage, Conversation } from "@/lib/types";
import { ConversationList } from "@/components/chat/ConversationList";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const data = await api.get<Conversation[]>("/chat/conversations");
    setConversations(data);
    if (!activeId && data.length > 0) setActiveId(data[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return;
    api.get<ChatMessage[]>(`/chat/conversations/${activeId}/messages`).then(setMessages);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const { sendMessage } = useChatSocket({
    conversationId: activeId,
    onDelta: (chunk) => setStreaming((prev) => prev + chunk),
    onDone: () => {
      setStreaming((finalText) => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), conversation_id: activeId!, role: "assistant", content: finalText, model: null, tokens_used: null, created_at: new Date().toISOString() },
        ]);
        return "";
      });
    },
  });

  async function createConversation() {
    const conversation = await api.post<Conversation>("/chat/conversations", { title: "New Chat" });
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setMessages([]);
  }

  function handleSend(content: string) {
    if (!activeId) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), conversation_id: activeId, role: "user", content, model: null, tokens_used: null, created_at: new Date().toISOString() },
    ]);
    sendMessage(content);
  }

  return (
    <div className="flex h-full">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createConversation}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {activeId ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {streaming && <MessageBubble role="assistant" content={streaming} />}
              <div ref={bottomRef} />
            </div>
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-omni-muted">
            <p>Start a new chat to talk with Omni Agent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
