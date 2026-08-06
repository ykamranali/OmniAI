"use client";

import { useState } from "react";
import { Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TEMPLATES = ["Corporate", "E-commerce", "Healthcare", "Logistics", "SaaS", "Portfolio", "Hotel", "Restaurant"];

export default function WebsitesPage() {
  const [selected, setSelected] = useState(TEMPLATES[0]);
  const [brief, setBrief] = useState("");

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-xl font-semibold">Omni Website Builder</h1>
        <p className="text-sm text-omni-muted">
          Describe the site you need — Omni Agent plans, designs, and scaffolds a responsive, SEO-ready site with the DevOps + Frontend + Backend agents.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`omni-glass rounded-omni p-4 text-left text-sm transition-colors ${
              selected === t ? "omni-gradient-border text-omni-text" : "text-omni-muted"
            }`}
          >
            <Globe size={16} className="mb-2" />
            {t}
          </button>
        ))}
      </div>

      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={4}
        placeholder={`Describe your ${selected.toLowerCase()} website: pages, features, tone...`}
        className="rounded-omni border border-omni-border bg-white/5 p-4 text-sm focus:outline-none"
      />

      <Button className="w-fit">
        <Sparkles size={16} /> Generate {selected} website
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>What gets generated</CardTitle>
          <CardDescription>
            Project + architecture plan, responsive UI, contact forms, SEO metadata, admin-ready structure,
            backend routes, database schema, and documentation — tracked live in Tasks.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
