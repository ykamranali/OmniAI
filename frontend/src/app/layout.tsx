import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Omni Agent — Build Anything. Create Everything.",
  description:
    "Omni Agent is an open-source, self-hostable autonomous agent platform for chat, code, websites, 2D/3D design, and multi-agent project execution. Powered by Omni Digital Solution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: "#0d0d10", color: "#f4f4f6", border: "1px solid #1c1c22" },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
