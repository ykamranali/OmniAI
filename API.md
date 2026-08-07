# API Reference

Base URL: `http://localhost:8000/api/v1` (or `https://your-domain/api/v1` behind Nginx).

Interactive docs (Swagger UI) are always available at `/docs` in
non-production environments; disabled by default when `ENVIRONMENT=production`.

All authenticated routes expect `Authorization: Bearer <access_token>`.

## Auth — `/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create a user + personal workspace. Returns tokens. |
| POST | `/auth/login` | Email/password login. Returns tokens. |
| POST | `/auth/refresh` | Exchange a refresh token for a new token pair. |
| GET | `/auth/me` | Current authenticated user. |

## Workspaces — `/workspaces`

| Method | Path | Description |
|---|---|---|
| GET | `/workspaces` | List workspaces you're a member of. |
| POST | `/workspaces` | Create a workspace (you become owner). |
| GET | `/workspaces/{id}` | Get one workspace. |
| PATCH | `/workspaces/{id}` | Update name/description. |
| DELETE | `/workspaces/{id}` | Delete (owner only). |

## Projects — `/projects`

| Method | Path | Description |
|---|---|---|
| GET | `/projects?workspace_id=` | List projects in a workspace. |
| POST | `/projects` | Create a project. |
| GET | `/projects/{id}` | Get one project. |
| PATCH | `/projects/{id}` | Update name/description/status. |
| DELETE | `/projects/{id}` | Delete a project. |

## Chat — `/chat`

| Method | Path | Description |
|---|---|---|
| GET | `/chat/conversations` | List your conversations. |
| POST | `/chat/conversations` | Start a conversation. |
| PATCH | `/chat/conversations/{id}` | Rename / pin. |
| DELETE | `/chat/conversations/{id}` | Delete a conversation. |
| GET | `/chat/conversations/{id}/messages` | List messages. |
| POST | `/chat/conversations/{id}/messages` | Add a message (non-streaming fallback). |
| WS | `/chat/ws/{conversation_id}` | Streaming chat — see below. |

**WebSocket protocol** (`/api/v1/ws/chat/{conversation_id}`):

```jsonc
// client -> server
{ "token": "<jwt access token>", "content": "Build me a landing page" }

// server -> client (repeated as tokens arrive)
{ "type": "delta", "content": "Sure" }
{ "type": "delta", "content": ", here's" }

// server -> client (once, at the end)
{ "type": "done", "message_id": "…" }

// on error
{ "type": "error", "detail": "…" }
```

Send another `{content: "..."}` message on the same socket to continue the
conversation without reconnecting.

## Models — `/models`

| Method | Path | Description |
|---|---|---|
| GET | `/models` | List models available through the LiteLLM gateway (cloud + local). |

## Agents — `/agents`

| Method | Path | Description |
|---|---|---|
| GET | `/agents` | List the 9 built-in specialist agents. |
| POST | `/agents/orchestrate` | Planner Agent decomposes `{project_id, prompt}` into a persisted task graph. |

## Tasks — `/tasks`

| Method | Path | Description |
|---|---|---|
| GET | `/tasks?project_id=` | List a project's task graph. |
| POST | `/tasks` | Create a task. |
| PATCH | `/tasks/{id}` | Update status/priority/result. |
| DELETE | `/tasks/{id}` | Delete a task. |

## Memory — `/memory`

| Method | Path | Description |
|---|---|---|
| GET | `/memory?scope=&scope_id=` | List memory entries for a scope. |
| POST | `/memory` | Upsert a memory entry (`{scope, scope_id, key, value}`). |
| DELETE | `/memory/{id}` | Delete a memory entry. |

## Files — `/files`

| Method | Path | Description |
|---|---|---|
| POST | `/files?workspace_id=` | Upload a file (multipart) → stored in MinIO. |
| GET | `/files?workspace_id=` | List files in a workspace. |
| GET | `/files/{id}/download-url` | Get a presigned download URL. |
| DELETE | `/files/{id}` | Delete a file record. |

## Images — `/images`

| Method | Path | Description |
|---|---|---|
| POST | `/images/generate` | Generate a 2D image from a prompt (`{workspace_id, prompt}`). Requires an image-capable provider key. |
| GET | `/images?workspace_id=` | List image generations. |

## 3D — `/three`

| Method | Path | Description |
|---|---|---|
| POST | `/three/generate` | 3D Agent returns a scene graph JSON (`{scene: {...}}`) for the React Three Fiber canvas. |

## System

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check (used by Docker healthchecks). |
| GET | `/` | Basic app metadata. |

## Error format

```json
{ "detail": "human-readable message" }
```

Standard HTTP status codes: `400` validation, `401` unauthenticated, `403`
forbidden, `404` not found, `429` rate-limited, `500` unexpected error.
