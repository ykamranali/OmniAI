"use client";
import React, { useState, useEffect, Suspense } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

function SocialPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch connected accounts from the database
    fetch('/api/social/accounts')
      .then(res => res.json())
      .then(data => {
        if (data.accounts) {
          // Filter out google since it's just used for login usually, unless we want to show it
          const socialMediaAccounts = data.accounts.filter((acc: any) => acc.platform !== 'google');
          setConnectedAccounts(socialMediaAccounts);
        }
      })
      .catch(console.error);

    const connected = searchParams.get('connected');
    const provider = searchParams.get('provider');
    
    if (connected === 'true' && provider) {
      toast.success(`Successfully connected ${provider.charAt(0).toUpperCase() + provider.slice(1)} account!`);
      // Clean up the URL
      router.replace('/social');
    }
  }, [searchParams, router]);

  const handleConnectProvider = (provider: string) => {
    if (provider === 'LinkedIn') {
      toast(`Redirecting to LinkedIn authorization...`, { icon: '🔐' });
      signIn('linkedin', { callbackUrl: '/social?connected=true&provider=linkedin' });
      return;
    }

    // For other providers not yet in NextAuth
    toast(`Redirecting to ${provider} authorization...`, { icon: '🔐' });
    setTimeout(() => {
      window.location.href = `/api/auth/social?provider=${provider.toLowerCase()}`;
    }, 1000);
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-social" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>Social Media Hub</h1>
              <p>Connect and manage all your social channels from one unified dashboard.</p>
            </div>
            <div className="header-actions">
              <div className="view-toggle">
                <button className={`toggle-btn ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>Accounts</button>
                <button className={`toggle-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Calendar</button>
                <button className={`toggle-btn ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => setActiveTab('drafts')}>Drafts</button>
              </div>
              <button className="btn btn-primary" onClick={() => setIsConnectModalOpen(true)}>
                <i className="bx bx-plus"></i> Connect Account
              </button>
            </div>
          </div>

          {activeTab === 'accounts' && (
            <>
              {connectedAccounts.length === 0 ? (
                <div style={{ padding: '5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.5 }}>
                    <i className="bx bxl-facebook-circle" style={{ fontSize: '2rem', color: '#94A3B8' }}></i>
                    <i className="bx bxl-instagram" style={{ fontSize: '2rem', color: '#94A3B8' }}></i>
                    <i className="bx bxl-twitter" style={{ fontSize: '2rem', color: '#94A3B8' }}></i>
                    <i className="bx bxl-linkedin-square" style={{ fontSize: '2rem', color: '#94A3B8' }}></i>
                  </div>
                  <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>No Social Accounts Connected</h3>
                  <p style={{ color: '#94A3B8', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>Connect your brand's social media profiles to enable AI-powered automated posting, scheduling, and real-time engagement analytics.</p>
                  <button className="btn btn-primary btn-lg" onClick={() => setIsConnectModalOpen(true)}>
                    <i className="bx bx-link"></i> Connect Your First Account
                  </button>
                </div>
              ) : (
                <div className="social-accounts-grid">
                  {connectedAccounts.map(account => (
                    <div key={account.id} className="social-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: account.platform === 'facebook' ? '#1877F2' : account.platform === 'twitter' ? '#000' : account.platform === 'linkedin' ? '#0A66C2' : account.platform === 'youtube' ? '#FF0000' : account.platform === 'tiktok' ? '#000' : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`bx bxl-${account.platform === 'twitter' ? 'twitter' : account.platform}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', textTransform: 'capitalize' }}>{account.platform}</h3>
                        <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>{account.username}</p>
                      </div>
                      <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Active</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'calendar' && (
             <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
               <i className="bx bx-calendar-x" style={{ fontSize: '3rem', color: '#94A3B8', marginBottom: '1rem' }}></i>
               <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>Calendar Empty</h3>
               <p style={{ color: '#94A3B8' }}>Connect a social account to start scheduling posts.</p>
             </div>
          )}

          {activeTab === 'drafts' && (
             <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
               <i className="bx bx-edit-alt" style={{ fontSize: '3rem', color: '#94A3B8', marginBottom: '1rem' }}></i>
               <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>No Drafts</h3>
               <p style={{ color: '#94A3B8' }}>Use the AI Studio to generate and save post drafts.</p>
             </div>
          )}

          {/* Connect Account Modal */}
          {isConnectModalOpen && (
            <div className="modal-overlay active">
              <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <h2>Connect Social Account</h2>
                  <button className="modal-close" onClick={() => setIsConnectModalOpen(false)}><i className="bx bx-x"></i></button>
                </div>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                  <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Select a platform to authorize OmniAI Nexus to manage your posts and analytics.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    
                    {/* Facebook */}
                    <button onClick={() => handleConnectProvider('Facebook')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-facebook" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Facebook</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Pages & Groups</span>
                      </div>
                    </button>

                    {/* Instagram */}
                    <button onClick={() => handleConnectProvider('Instagram')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-instagram" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Instagram</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Business Accounts</span>
                      </div>
                    </button>

                    {/* Twitter / X */}
                    <button onClick={() => handleConnectProvider('Twitter')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <i className="bx bxl-twitter" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Twitter (X)</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Profiles</span>
                      </div>
                    </button>

                    {/* LinkedIn */}
                    <button onClick={() => handleConnectProvider('LinkedIn')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-linkedin" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>LinkedIn</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Pages & Profiles</span>
                      </div>
                    </button>

                    {/* YouTube */}
                    <button onClick={() => handleConnectProvider('YouTube')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bxl-youtube" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>YouTube</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Channels</span>
                      </div>
                    </button>

                    {/* TikTok */}
                    <button onClick={() => handleConnectProvider('TikTok')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} className="hover:bg-white/5">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <i className="bx bxl-tiktok" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>TikTok</h4>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Creator & Business</span>
                      </div>
                    </button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
    </div>
  );
}

export default function SocialPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Social Hub...</div>}>
      <SocialPageContent />
    </Suspense>
  );
}

