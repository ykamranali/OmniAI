"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { RightPanel } from "@/components/layout/RightPanel";

export function AppShell({ children, rightPanel }: { children: ReactNode; rightPanel?: React.ComponentProps<typeof RightPanel>["tabs"] }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-omni-bg text-omni-text">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <RightPanel tabs={rightPanel} />
    </div>
  );
}
