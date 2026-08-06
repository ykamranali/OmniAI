"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { SceneGraph } from "@/components/three-studio/SceneRenderer";

const SceneRenderer = dynamic(
  () => import("@/components/three-studio/SceneRenderer").then((m) => m.SceneRenderer),
  { ssr: false }
);

const DEFAULT_SCENE: SceneGraph = {
  background: "#050505",
  camera: { position: [0, 2, 8], fov: 50 },
  lights: [
    { type: "ambient", intensity: 0.4 },
    { type: "point", position: [5, 5, 5], intensity: 1.2, color: "#4d7cff" },
  ],
  objects: [
    {
      id: "hero-sphere",
      type: "sphere",
      position: [0, 0, 0],
      args: [1.5, 64, 64],
      material: { color: "#7c3aed", metalness: 0.6, roughness: 0.2 },
      animation: { type: "rotate", axis: "y", speed: 0.3 },
    },
    { id: "particles", type: "particles", count: 400, spread: 12, color: "#22d3ee" },
  ],
};

export default function ThreeStudioPage() {
  const [prompt, setPrompt] = useState("A floating glass orb hero section with particle field");
  const [scene, setScene] = useState<SceneGraph>(DEFAULT_SCENE);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await api.post<{ scene: SceneGraph }>("/three/generate", { prompt });
      setScene(res.scene);
      toast.success("Scene generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a 3D scene..."
          className="flex-1 rounded-omni-sm border border-omni-border bg-white/5 px-4 py-2 text-sm focus:outline-none"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate scene"}
        </Button>
      </div>
      <div className="omni-glass flex-1 overflow-hidden rounded-omni">
        <SceneRenderer scene={scene} />
      </div>
    </div>
  );
}
