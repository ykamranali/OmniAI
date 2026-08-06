"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

const PRESETS = ["Logo", "Poster", "Flyer", "Business card", "Social post", "UI mockup"];

export default function DesignPage() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState(PRESETS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // NOTE: requires a real workspace_id from /workspaces in a wired-up app;
      // swap this for the active workspace once workspace switching is built.
      await api.post("/images/generate", { workspace_id: crypto.randomUUID(), prompt: `${preset}: ${prompt}` });
      toast.success("Generation queued");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-xl font-semibold">Omni 2D Designer</h1>
        <p className="text-sm text-omni-muted">Generate logos, posters, flyers, business cards, social posts, and UI mockups.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              preset === p ? "border-omni-blue bg-omni-blue/10 text-omni-text" : "border-omni-border text-omni-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe the ${preset.toLowerCase()} you want...`}
          className="flex-1 rounded-omni-sm border border-omni-border bg-white/5 px-4 py-2 text-sm focus:outline-none"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          <Sparkles size={16} /> {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="flex flex-1 items-center justify-center text-omni-muted">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon size={32} />
          <p className="text-sm">Generated designs will appear here.</p>
        </div>
      </Card>
    </div>
  );
}
