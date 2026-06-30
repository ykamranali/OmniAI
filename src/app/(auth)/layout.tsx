import * as React from "react"
import { Sparkles } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout min-h-screen bg-gray-900">
      {children}
    </div>
  )
}
