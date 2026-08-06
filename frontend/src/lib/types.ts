export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  owner_id: string;
  plan: string;
  created_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  created_by: string;
  name: string;
  description: string | null;
  type: "general" | "code" | "website" | "design_2d" | "studio_3d";
  status: "planning" | "in_progress" | "review" | "completed" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  project_id: string | null;
  user_id: string;
  title: string;
  model: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  model: string | null;
  tokens_used: number | null;
  created_at: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  local: boolean;
  context_window: number | null;
}

export interface AgentInfo {
  type: string;
  name: string;
  description: string;
}

export interface TaskItem {
  id: string;
  project_id: string;
  parent_task_id: string | null;
  agent_id: string | null;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "blocked" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  position: number;
  result: string | null;
  created_at: string;
  updated_at: string;
}
