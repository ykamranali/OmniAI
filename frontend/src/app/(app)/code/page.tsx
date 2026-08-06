"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileCode2, Play, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_FILES: Record<string, string> = {
  "app.tsx": `export default function App() {\n  return <h1>Hello from Omni Code</h1>;\n}\n`,
  "server.py": `from fastapi import FastAPI\n\napp = FastAPI()\n\n\n@app.get("/")\nasync def root():\n    return {"message": "Hello from Omni Code"}\n`,
};

export default function CodePage() {
  const [activeFile, setActiveFile] = useState("app.tsx");
  const [files, setFiles] = useState(DEFAULT_FILES);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-omni-border bg-omni-surface/60 px-3 py-2">
        {Object.keys(files).map((name) => (
          <button
            key={name}
            onClick={() => setActiveFile(name)}
            className={`flex items-center gap-2 rounded-omni-sm px-3 py-1.5 text-xs ${
              activeFile === name ? "bg-white/10 text-omni-text" : "text-omni-muted hover:bg-white/5"
            }`}
          >
            <FileCode2 size={12} />
            {name}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline">
            <Wand2 size={14} /> AI refactor
          </Button>
          <Button size="sm">
            <Play size={14} /> Run
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <Editor
          theme="vs-dark"
          path={activeFile}
          value={files[activeFile]}
          onChange={(value) => setFiles((prev) => ({ ...prev, [activeFile]: value ?? "" }))}
          options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }}
        />
      </div>
    </div>
  );
}
