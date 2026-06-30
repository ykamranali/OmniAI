"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { data: session } = useSession();

  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toast.success(`Searching for: ${e.currentTarget.value}`);
    }
  };

  return (
    <header id="topbar" className="topbar" style={{ position: 'relative' }}>
        <button id="sidebar-toggle" className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="bx bx-menu"></i>
        </button>
        
        <div className="topbar-search">
          <i className="bx bx-search"></i>
          <input 
            type="text" 
            placeholder="Search commands, campaigns, configurations... (Press Enter)" 
            onKeyDown={handleSearch}
          />
        </div>

        <div className="topbar-actions">
          {/* Notifications Dropdown */}
          <div className="topbar-btn-wrapper" style={{ position: 'relative' }}>
            <button className="topbar-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
              <i className="bx bx-bell"></i>
              <span className="badge">3</span>
            </button>
            {showNotifications && (
              <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px', width: '320px', background: '#1A233A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Notifications</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#6366F1' }}>Campaign Success</strong>
                    <p style={{ margin: '4px 0 0', color: '#94A3B8' }}>Summer Sale 2026 reached 10k impressions.</p>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#10B981' }}>New Lead Converted</strong>
                    <p style={{ margin: '4px 0 0', color: '#94A3B8' }}>Sarah Jenkins booked a call.</p>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <strong style={{ color: '#06B6D4' }}>AI Video Generated</strong>
                    <p style={{ margin: '4px 0 0', color: '#94A3B8' }}>TikTok script generated and queued.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Button -> Routes to /chat */}
          <div className="topbar-btn-wrapper">
            <button className="topbar-btn" onClick={() => router.push('/chat')}>
              <i className="bx bx-message-dots"></i>
              <span className="badge">5</span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="topbar-btn-wrapper" style={{ position: 'relative' }}>
            <div className="topbar-avatar-btn" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>{session?.user?.name?.charAt(0) || 'G'}</div>
            {showProfile && (
              <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px', width: '200px', background: '#1A233A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 0', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{session?.user?.name || 'Guest User'}</p>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Pro Plan</span>
                </div>
                <button 
                  style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer' }}
                  onClick={() => { router.push('/settings'); setShowProfile(false); }}
                >
                  <i className="bx bx-user" style={{ marginRight: '8px' }}></i> My Profile
                </button>
                <button 
                  style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer' }}
                  onClick={() => { router.push('/settings'); setShowProfile(false); }}
                >
                  <i className="bx bx-cog" style={{ marginRight: '8px' }}></i> Settings
                </button>
                <button 
                  style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <i className="bx bx-log-out" style={{ marginRight: '8px' }}></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
  );
}
