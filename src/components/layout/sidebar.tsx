"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: session } = useSession();

  const handleLogout = async () => {
    toast.success('Logging out...');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside id="sidebar" className="sidebar">
      <div className="sidebar-logo">
        <svg className="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="url(#logo-grad)" />
          <polygon points="50,15 83,30 83,70 50,85 17,70 17,30" fill="#0D1425" />
          <path d="M42,32 L60,45 L40,55 L58,68" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span className="logo-text">OmniAI <span className="logo-badge">NEXUS</span></span>
      </div>

      <nav className="sidebar-nav">
        <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' || pathname === '/' ? 'active' : ''}`}>
          <i className="bx bx-grid-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link href="/ai-studio" className={`nav-item ${pathname === '/ai-studio' ? 'active' : ''}`}>
          <i className="bx bx-bot"></i>
          <span>AI Studio</span>
        </Link>
        <Link href="/social" className={`nav-item ${pathname === '/social' ? 'active' : ''}`}>
          <i className="bx bx-share-alt"></i>
          <span>Social Media</span>
        </Link>
        <Link href="/campaigns" className={`nav-item ${pathname === '/campaigns' ? 'active' : ''}`}>
          <i className="bx bx-rocket"></i>
          <span>Campaigns</span>
        </Link>
        <Link href="/crm" className={`nav-item ${pathname === '/crm' ? 'active' : ''}`}>
          <i className="bx bx-user-pin"></i>
          <span>CRM & Leads</span>
        </Link>
        <Link href="/analytics" className={`nav-item ${pathname === '/analytics' ? 'active' : ''}`}>
          <i className="bx bx-bar-chart-alt-2"></i>
          <span>Analytics</span>
        </Link>
        <Link href="/integrations" className={`nav-item ${pathname === '/integrations' ? 'active' : ''}`}>
          <i className="bx bx-plug"></i>
          <span>VOIP & Integrations</span>
        </Link>
        <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
          <i className="bx bx-cog"></i>
          <span>Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">{session?.user?.name?.charAt(0) || 'G'}</div>
          <div className="user-info">
            <h4 id="profile-name-display">{session?.user?.name || 'Guest User'}</h4>
            <span>Pro Plan</span>
          </div>
          <button id="btn-logout" className="btn-logout-icon" title="Log Out" onClick={handleLogout}>
            <i className="bx bx-log-out"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
