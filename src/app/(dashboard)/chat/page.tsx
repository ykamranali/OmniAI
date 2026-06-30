"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send, Mic, Paperclip, Square, RefreshCcw, Copy, Pin, Trash, Edit2, Plus, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/services/api"

export default function ChatPage() {
  const [prompt, setPrompt] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  
  const [chats, setChats] = React.useState<any[]>([])
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<any[]>([])

  // Load chat history
  React.useEffect(() => {
    async function loadChats() {
      try {
        const data = await api.chats.getAll()
        setChats(data)
        if (data.length > 0 && !activeChatId) {
          setActiveChatId(data[0].id)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadChats()
  }, [])

  // Load messages for active chat
  React.useEffect(() => {
    if (!activeChatId) return
    async function loadMessages() {
      try {
        const data = await api.chats.getMessages(activeChatId!)
        setMessages(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadMessages()
  }, [activeChatId])

  const handleSend = async () => {
    if (!prompt.trim()) return
    const content = prompt
    setPrompt("")
    
    // Optimistic UI for user message
    const tempUserMsg = { id: Date.now().toString(), role: "user", content }
    setMessages(prev => [...prev, tempUserMsg])
    setIsGenerating(true)

    try {
      let currentChatId = activeChatId
      // Create new chat if none exists
      if (!currentChatId) {
        const newChat = await api.chats.create(content.slice(0, 20) + "...")
        setChats(prev => [newChat, ...prev])
        currentChatId = newChat.id
        setActiveChatId(currentChatId)
      }

      const data = await api.chats.sendMessage(currentChatId!, content)
      
      // Replace optimistic message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id)
        return [...filtered, data.userMessage, data.aiMessage].filter(Boolean)
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const newChat = await api.chats.create("New Conversation")
      setChats(prev => [newChat, ...prev])
      setActiveChatId(newChat.id)
      setMessages([])
    } catch (err) {
      console.error(err)
    }
  }

  const pinnedChats = chats.filter(c => c.pinned)
  const otherChats = chats.filter(c => !c.pinned)

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 hidden lg:flex flex-col gap-4 border-r pr-4">
        <Button onClick={handleNewChat} className="w-full justify-start gap-2" variant="outline">
          <Plus size={16} /> New Chat
        </Button>
        <div className="relative">
          <Input placeholder="Search chats..." className="h-8 text-xs" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            
            {pinnedChats.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Pinned</h4>
                <div className="space-y-1">
                  {pinnedChats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setActiveChatId(chat.id)}
                      className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare size={14} className="shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <Pin size={12} className="text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherChats.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Recent</h4>
                <div className="space-y-1">
                  {otherChats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setActiveChatId(chat.id)}
                      className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare size={14} className="shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass rounded-xl overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>No messages yet. Send a message to start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card/50 border rounded-tl-sm"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "")
                          return !inline && match ? (
                            <div className="relative group mt-4 mb-4">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="icon" className="h-6 w-6">
                                  <Copy size={12} />
                                </Button>
                              </div>
                              <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md !mt-0 !bg-background/80"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code {...props} className="bg-muted px-1.5 py-0.5 rounded-md text-primary font-mono text-xs">
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>KA</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          {isGenerating && (
            <div className="flex gap-4">
              <Avatar className="h-8 w-8 shrink-0 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 p-4 bg-card/50 border rounded-2xl rounded-tl-sm w-24">
                <motion.div className="h-2 w-2 bg-primary rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.div className="h-2 w-2 bg-primary rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.div className="h-2 w-2 bg-primary rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-background/50 backdrop-blur-sm border-t">
          <div className="flex gap-2 max-w-4xl mx-auto items-end bg-card border rounded-2xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full h-10 w-10 text-muted-foreground hover:text-foreground">
              <Paperclip size={18} />
            </Button>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message OmniAI..."
              className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none py-2 px-1 focus:outline-none text-sm placeholder:text-muted-foreground"
              rows={1}
            />
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground">
                <Mic size={18} />
              </Button>
              {isGenerating ? (
                <Button variant="destructive" size="icon" className="rounded-full h-10 w-10 shadow-sm" onClick={() => setIsGenerating(false)}>
                  <Square size={16} fill="currentColor" />
                </Button>
              ) : (
                <Button size="icon" className="rounded-full h-10 w-10 shadow-sm" onClick={handleSend} disabled={!prompt.trim()}>
                  <Send size={16} />
                </Button>
              )}
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-muted-foreground">
            OmniAI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  )
}
