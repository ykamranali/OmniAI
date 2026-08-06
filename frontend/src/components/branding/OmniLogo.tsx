import { cn } from "@/lib/utils";

export function OmniLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="omni-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" stroke="url(#omni-logo-gradient)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="9" fill="url(#omni-logo-gradient)" />
      <circle cx="24" cy="6" r="3" fill="#60a5fa" />
      <circle cx="42" cy="24" r="3" fill="#a78bfa" />
      <circle cx="24" cy="42" r="3" fill="#60a5fa" />
      <circle cx="6" cy="24" r="3" fill="#a78bfa" />
    </svg>
  );
}
