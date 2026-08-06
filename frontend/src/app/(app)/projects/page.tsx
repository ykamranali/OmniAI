"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Project, Workspace } from "@/lib/types";

export default function ProjectsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.get<Workspace[]>("/workspaces").then(async (ws) => {
      setWorkspaces(ws);
      if (ws.length > 0) {
        const all = await Promise.all(ws.map((w) => api.get<Project[]>(`/projects?workspace_id=${w.id}`)));
        setProjects(all.flat());
      }
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-omni-muted">Everything Omni Agent is building for you, across all workspaces.</p>
        </div>
        <Button disabled={workspaces.length === 0}>
          <Plus size={16} /> New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-omni-muted">
          <FolderKanban size={28} />
          <p>No projects yet. Start a chat and ask Omni Agent to build something.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{p.name}</CardTitle>
                  <Badge>{p.status}</Badge>
                </div>
                <CardDescription>{p.description ?? "No description yet."}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
