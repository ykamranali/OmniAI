import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastProvider } from "@/components/ToastProvider"
import Script from "next/script"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="app-container" id="app-container">
      <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="/css/style.css" />
      
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      <Script src="/js/app.js" strategy="lazyOnload" />

      <ToastProvider />
      <Sidebar />
      <div className="main-content">
        <Header />
        {/* The child pages themselves contain .page-container */}
        {children}
      </div>
    </div>
  )
}
