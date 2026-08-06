"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Project, TaskItem, Workspace } from "@/lib/types";

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    api.get<Workspace[]>("/workspaces").then(async (ws) => {
      setWorkspaces(ws);
      if (ws.length === 0) return;
      const projectLists = await Promise.all(ws.map((w) => api.get<Project[]>(`/projects?workspace_id=${w.id}`)));
      const allProjects = projectLists.flat();
      setProjects(allProjects);
      if (allProjects.length > 0) {
        const taskLists = await Promise.all(
          allProjects.slice(0, 5).map((p) => api.get<TaskItem[]>(`/tasks?project_id=${p.id}`))
        );
        setTasks(taskLists.flat());
      }
    });
  }, []);

  return (
    <div className="grid h-full grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <CardDescription>{workspaces.length} workspace(s)</CardDescription>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-omni-muted">
          {workspaces.map((w) => (
            <li key={w.id} className="rounded-omni-sm border border-omni-border px-3 py-2">
              {w.name} <span className="text-xs">({w.plan})</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>{projects.length} project(s)</CardDescription>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-omni-muted">
          {projects.map((p) => (
            <li key={p.id} className="rounded-omni-sm border border-omni-border px-3 py-2">
              {p.name} <span className="text-xs">— {p.status}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>{tasks.length} task(s) across your latest projects</CardDescription>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-omni-muted">
          {tasks.map((t) => (
            <li key={t.id} className="rounded-omni-sm border border-omni-border px-3 py-2">
              {t.title} <span className="text-xs">— {t.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
