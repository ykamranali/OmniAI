"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/lib/auth";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api/v1/ws";

interface UseChatSocketOptions {
  conversationId: string | null;
  onDelta: (content: string) => void;
  onDone: (messageId: string) => void;
  onError?: (detail: string) => void;
}

export function useChatSocket({ conversationId, onDelta, onDone, onError }: UseChatSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const socket = new WebSocket(`${WS_URL}/${conversationId}`);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "delta") onDelta(data.content);
      else if (data.type === "done") onDone(data.message_id);
      else if (data.type === "error") onError?.(data.detail);
    };

    return () => socket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const sendMessage = useCallback((content: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ token: getAccessToken(), content }));
  }, []);

  return { connected, sendMessage };
}
