"use client"

import * as React from "react"
import { Search, Plus, Bot, Shield, Briefcase, Sparkles, BookOpen, PenTool, Video, MessageSquare } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [startingAgentId, setStartingAgentId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadAgents() {
      try {
        const data = await api.agents.getAll()
        setAgents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAgents()
  }, [])

  const ICONS: Record<string, any> = {
    Bot, Shield, Briefcase, BookOpen, PenTool
  }

  const handleStartConversation = async (agent: any) => {
    try {
      setStartingAgentId(agent.id)
      await api.chats.create(`Chat with ${agent.name}`, agent.id)
      router.push('/chat')
    } catch (err) {
      console.error(err)
      setStartingAgentId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground mt-1">Deploy specialized AI assistants for different tasks.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> Create Agent
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search agents..." className="pl-9 bg-background/50 backdrop-blur-sm" />
        </div>
        <Button variant="outline" size="icon"><Sparkles size={16} /></Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading agents...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
          {agents.map((agent) => {
            const Icon = ICONS[agent.icon] || Bot
            return (
              <Card key={agent.id} className="glass-hover group overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${agent.bg} ${agent.color}`}>
                      <Icon size={24} />
                    </div>
                    <Badge variant={agent.status === "Online" ? "default" : agent.status === "Busy" ? "destructive" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider">
                      {agent.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] mt-2">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {JSON.parse(agent.capabilities || "[]").map((cap: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs bg-background/50 font-normal">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50">
                  <Button 
                    onClick={() => handleStartConversation(agent)}
                    disabled={startingAgentId === agent.id}
                    className="w-full gap-2 transition-transform group-hover:scale-[1.02]"
                  >
                    <MessageSquare size={16} /> 
                    {startingAgentId === agent.id ? "Starting..." : "Start Conversation"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
