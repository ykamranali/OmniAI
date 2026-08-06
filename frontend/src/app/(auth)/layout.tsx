import { OmniLogo } from "@/components/branding/OmniLogo";
import { Footer } from "@/components/branding/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-omni-bg">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-3">
          <OmniLogo size={48} />
          <div className="text-center">
            <h1 className="text-2xl font-bold omni-gradient-text">Omni Agent</h1>
            <p className="text-sm text-omni-muted">Build Anything. Create Everything.</p>
          </div>
        </div>
        <div className="omni-glass w-full max-w-sm rounded-omni p-8">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
