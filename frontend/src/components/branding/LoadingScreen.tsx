"use client";

import { motion } from "framer-motion";
import { OmniLogo } from "@/components/branding/OmniLogo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-omni-bg">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-full p-6 omni-glow-blue omni-glow-purple"
      >
        <OmniLogo size={64} />
      </motion.div>
      <div className="text-center">
        <p className="text-lg font-semibold omni-gradient-text">Omni Agent</p>
        <p className="text-sm text-omni-muted">Build Anything. Create Everything.</p>
      </div>
    </div>
  );
}
