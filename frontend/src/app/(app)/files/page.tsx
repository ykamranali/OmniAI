"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Workspace } from "@/lib/types";

interface FileRecord {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export default function FilesPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);

  const loadFiles = useCallback(async (workspaceId: string) => {
    const data = await api.get<FileRecord[]>(`/files?workspace_id=${workspaceId}`);
    setFiles(data);
  }, []);

  useEffect(() => {
    api.get<Workspace[]>("/workspaces").then((ws) => {
      if (ws.length > 0) {
        setWorkspace(ws[0]);
        loadFiles(ws[0].id);
      }
    });
  }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !workspace) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API_URL}/files?workspace_id=${workspace.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
      body: formData,
    });
    loadFiles(workspace.id);
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Files</h1>
          <p className="text-sm text-omni-muted">Documents, images, and exports stored in your workspace.</p>
        </div>
        <label>
          <input type="file" className="hidden" onChange={handleUpload} />
          <Button asChild>
            <span>
              <Upload size={16} /> Upload
            </span>
          </Button>
        </label>
      </div>

      <div className="omni-glass rounded-omni">
        {files.length === 0 ? (
          <p className="p-8 text-center text-sm text-omni-muted">No files uploaded yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-omni-muted">
              <tr>
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Type</th>
                <th className="px-4 py-3 font-normal">Size</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-t border-omni-border">
                  <td className="flex items-center gap-2 px-4 py-3">
                    <FileText size={14} className="text-omni-muted" /> {f.filename}
                  </td>
                  <td className="px-4 py-3 text-omni-muted">{f.mime_type}</td>
                  <td className="px-4 py-3 text-omni-muted">{Math.round(f.size_bytes / 1024)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
