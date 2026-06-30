"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production Sync Node', key: 'sk_nexus_7c8d92a8f89e248b11a9', date: 'Created May 10, 2026' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile settings saved successfully!');
  };

  const handleIntegrationToggle = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      toast.success(`${name} integration connected!`);
    } else {
      toast.error(`${name} integration disconnected.`);
    }
  };

  const handleGenerateKey = () => {
    if (!newKeyName) {
      toast.error('Please enter a name for the API key');
      return;
    }
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_nexus_${Math.random().toString(36).substring(2, 15)}`,
      date: `Created ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    toast.success('New API Key generated successfully!');
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key copied to clipboard!');
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast.error('API Key revoked.');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Invitation sent successfully!');
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-settings" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>Settings & Preferences</h1>
              <p>Configure user profiles, connect API keys, set up team roles, and adjust subscription billing details.</p>
            </div>
          </div>

          <div className="settings-tabs-container">
            <div className="settings-tabs">
              <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>User Profile</button>
              <button className={`settings-tab ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>Integrations & API</button>
              <button className={`settings-tab ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>Usage & Billing</button>
              <button className={`settings-tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team Management</button>
              <button className={`settings-tab ${activeTab === 'api-keys' ? 'active' : ''}`} onClick={() => setActiveTab('api-keys')}>Developer Keys</button>
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="settings-panel active">
                <div className="settings-card">
                  <h3>Personal Information</h3>
                  
                  <div className="profile-avatar-row">
                    <div className="profile-avatar-large">KA</div>
                    <div className="profile-avatar-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Upload dialog opened')}>Change Photo</button>
                      <button className="btn btn-outline btn-sm" style={{ border: "none", color: "#EF4444", padding: "0" }} onClick={() => toast.error('Avatar removed')}>Remove</button>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSave}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" defaultValue="Kamran Ahmad" required />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" defaultValue="kamran@omniai.nexus" required />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" defaultValue="+1 (555) 019-2834" />
                      </div>
                      <div className="form-group">
                        <label>Company</label>
                        <input type="text" defaultValue="Ahmad Agency Inc." />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Short Biography</label>
                      <textarea rows={3} defaultValue="Founder & lead marketer. Automating business growth architectures."></textarea>
                    </div>

                    <div className="form-group">
                      <label>TimeZone</label>
                      <select className="form-control-select" defaultValue="est">
                        <option value="utc">UTC (Coordinated Universal Time)</option>
                        <option value="est">EST (Eastern Standard Time)</option>
                        <option value="pst">PST (Pacific Standard Time)</option>
                        <option value="cet">CET (Central European Time)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary">Save Profile Changes</button>
                  </form>
                </div>
              </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <div className="settings-panel active">
                <div className="settings-card">
                  <h3>AI Provider Connections</h3>
                  <p className="settings-desc">Link your direct API accounts to query proprietary nodes.</p>

                  <div className="integration-list">
                    <div className="integration-item">
                      <div className="int-avatar" style={{ background: "#10B981", color: "white" }}><i className="bx bx-bot"></i></div>
                      <div className="int-info">
                        <h4>OpenAI Engine</h4>
                        <p>Active query connection. GPT-4o enabled.</p>
                      </div>
                      <div className="int-actions">
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked onChange={(e) => handleIntegrationToggle('OpenAI', e)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="integration-item">
                      <div className="int-avatar" style={{ background: "#6366F1", color: "white" }}><i className="bx bxl-google"></i></div>
                      <div className="int-info">
                        <h4>Google Gemini</h4>
                        <p>API Integration active. Gemini 1.5 Pro enabled.</p>
                      </div>
                      <div className="int-actions">
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked onChange={(e) => handleIntegrationToggle('Gemini', e)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="integration-item">
                      <div className="int-avatar" style={{ background: "#8B5CF6", color: "white" }}><i className="bx bx-shield"></i></div>
                      <div className="int-info">
                        <h4>Claude AI (Anthropic)</h4>
                        <p>API connection valid. Claude 3.5 Sonnet active.</p>
                      </div>
                      <div className="int-actions">
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked onChange={(e) => handleIntegrationToggle('Claude', e)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="integration-item">
                      <div className="int-avatar" style={{ background: "#1E293B", color: "white" }}><i className="bx bx-brain"></i></div>
                      <div className="int-info">
                        <h4>DeepSeek Core</h4>
                        <p>Open-source translation API node.</p>
                      </div>
                      <div className="int-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Redirecting to DeepSeek OAuth...')}>Connect API</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="settings-panel active">
                <div className="settings-card">
                  <h3>Subscription Details</h3>
                  <div className="billing-subscription-card">
                    <div className="sub-tier-badge">Pro Plan</div>
                    <div className="sub-price-row">
                      <h2>$49<span>/month</span></h2>
                      <span>Next renewal: June 29, 2026</span>
                    </div>
                    <p>Includes complete Multi-AI studio integrations, basic campaign optimization & social scheduling packages.</p>
                    <button className="btn btn-primary" onClick={() => toast.success('Redirecting to Stripe payment portal...')}>Upgrade to Enterprise Plan</button>
                  </div>
                </div>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <div className="settings-panel active">
                <div className="settings-card">
                  <h3>Invite Team Member</h3>
                  <form className="invite-team-row" onSubmit={handleInvite}>
                    <input type="email" placeholder="colleague@agency.com" required />
                    <select className="form-control-select-sm" defaultValue="editor">
                      <option value="admin">Admin Manager</option>
                      <option value="editor">Editor (Content creator)</option>
                      <option value="viewer">Viewer Only</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Send Invite</button>
                  </form>

                  <h3 className="mt-8 mb-4">Active Workspace Directory</h3>
                  <div className="team-list">
                    <div className="team-member-item">
                      <div className="team-avatar">KA</div>
                      <div className="team-details">
                        <h4>Kamran Ahmad (You)</h4>
                        <p>kamran@omniai.nexus</p>
                      </div>
                      <span className="role-badge owner">Owner</span>
                    </div>
                    <div className="team-member-item">
                      <div className="team-avatar">AS</div>
                      <div className="team-details">
                        <h4>Alice Smith</h4>
                        <p>alice@omniai.nexus</p>
                      </div>
                      <span className="role-badge admin">Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API KEYS TAB */}
            {activeTab === 'api-keys' && (
              <div className="settings-panel active">
                <div className="settings-card">
                  <h3>Workspace API Keys</h3>
                  <p className="settings-desc">Generate access keys to authenticate custom scripts with the OmniAI Gateway.</p>

                  <div className="generate-key-block">
                    <input type="text" placeholder="E.g., HubSpot Sync script" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleGenerateKey}>Create New Key</button>
                  </div>

                  <div className="api-keys-list">
                    {apiKeys.map(k => (
                      <div key={k.id} className="key-item">
                        <div className="key-details">
                          <h4>{k.name}</h4>
                          <span>{k.key}</span>
                        </div>
                        <div className="key-actions">
                          <span className="key-date">{k.date}</span>
                          <button className="btn btn-secondary btn-icon-only" onClick={() => copyToClipboard(k.key)}><i className="bx bx-copy"></i></button>
                          <button className="btn btn-secondary btn-icon-only" style={{ color: "#EF4444" }} onClick={() => deleteKey(k.id)}><i className="bx bx-trash"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
    </div>
  );
}
