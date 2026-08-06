"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { AgentInfo } from "@/lib/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);

  useEffect(() => {
    api.get<AgentInfo[]>("/agents").then(setAgents).catch(() => setAgents([]));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="mb-1 text-xl font-semibold">Omni Agents</h1>
      <p className="mb-6 text-sm text-omni-muted">
        Specialized agents collaborate on a shared task graph to plan and build your project end to end.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.type}>
            <CardHeader>
              <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-omni-sm bg-gradient-to-br from-omni-blue/20 to-omni-purple/20">
                <Bot size={16} />
              </div>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
