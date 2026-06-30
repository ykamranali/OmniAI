"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const initialCampaigns: any[] = [];


export default function CampaignsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success('Campaign successfully launched and optimizing!');
  };

  const handlePause = (id: number, currentStatus: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        toast.success(`Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}!`);
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleDelete = (id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.error('Campaign deleted from database.');
  };

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-campaigns" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>Campaign Manager</h1>
              <p>Orchestrate marketing tasks, ads, and workflows into smart conversion funnels.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <i className="bx bx-plus"></i> Create Campaign
            </button>
          </div>

          <div className="filter-bar">
            <div className="btn-group">
              <button className={`btn btn-secondary ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Campaigns</button>
              <button className={`btn btn-secondary ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
              <button className={`btn btn-secondary ${filter === 'paused' ? 'active' : ''}`} onClick={() => setFilter('paused')}>Paused</button>
              <button className={`btn btn-secondary ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
              <button className={`btn btn-secondary ${filter === 'draft' ? 'active' : ''}`} onClick={() => setFilter('draft')}>Drafts</button>
            </div>

            <div className="filter-search-wrapper">
              <input type="text" placeholder="Search campaign titles..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="btn btn-secondary">
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="budget">Sort: Budget</option>
              </select>
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', marginTop: '2rem' }}>
              <i className="bx bx-rocket" style={{ fontSize: '3rem', color: '#94A3B8', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>No Campaigns Found</h3>
              <p style={{ color: '#94A3B8', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>You haven't launched any campaigns yet. Create your first campaign to start tracking metrics and AI generations.</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Your First Campaign</button>
            </div>
          ) : (
            <div className="campaigns-grid">
              {filteredCampaigns.map(camp => (
                <div key={camp.id} className="campaign-card" data-status={camp.status}>
                  <div className="campaign-card-header">
                    <span className={`campaign-status ${camp.status}`}>{camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}</span>
                    <div className="campaign-menu"><i className="bx bx-dots-horizontal-rounded"></i></div>
                  </div>
                  <h3>{camp.title}</h3>
                  <p className="campaign-desc">{camp.desc}</p>
                  
                  <div className="campaign-platforms">
                    {camp.platforms.includes('ig') && <span className="plat-badge ig" title="Instagram"><i className="bx bxl-instagram"></i></span>}
                    {camp.platforms.includes('fb') && <span className="plat-badge fb" title="Facebook"><i className="bx bxl-facebook-circle"></i></span>}
                    {camp.platforms.includes('tw') && <span className="plat-badge tw" title="Twitter/X"><i className="bx bxl-twitter"></i></span>}
                    {camp.platforms.includes('li') && <span className="plat-badge li" title="LinkedIn"><i className="bx bxl-linkedin-square"></i></span>}
                    {camp.platforms.includes('yt') && <span className="plat-badge yt" title="YouTube"><i className="bx bxl-youtube"></i></span>}
                    {camp.platforms.includes('tt') && <span className="plat-badge tt" title="TikTok"><i className="bx bxl-tiktok"></i></span>}
                    {camp.platforms.includes('mail') && <span className="plat-badge mail" title="Email"><i className="bx bx-envelope"></i></span>}
                  </div>

                  <div className="campaign-stats-block">
                    <div className="cmp-stat">
                      <span>Budget</span>
                      <h4>${camp.budget.toLocaleString()}</h4>
                    </div>
                    <div className="cmp-stat">
                      <span>Spent</span>
                      <h4>${camp.spent.toLocaleString()}</h4>
                    </div>
                    <div className="cmp-stat">
                      <span>Leads</span>
                      <h4>{camp.leads.toLocaleString()}</h4>
                    </div>
                    <div className="cmp-stat">
                      <span>Est. ROI</span>
                      <h4 style={{ color: camp.roi !== '-' ? "#10B981" : "inherit" }}>{camp.roi}</h4>
                    </div>
                  </div>

                  <div className="campaign-progress">
                    <div className="progress-label">
                      <span>Completion Progress</span>
                      <span>{camp.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${camp.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="campaign-card-footer">
                    <span className="date-range">{camp.dateRange}</span>
                    <div className="card-action-btns">
                      <button className="btn btn-secondary btn-icon-only" onClick={() => handlePause(camp.id, camp.status)} disabled={camp.status === 'completed'} title={camp.status === 'active' ? "Pause" : "Resume"}>
                        <i className={`bx ${camp.status === 'active' ? 'bx-pause' : 'bx-play'}`}></i>
                      </button>
                      <button className="btn btn-secondary btn-icon-only" title="Settings"><i className="bx bx-edit"></i></button>
                      <button className="btn btn-secondary btn-icon-only" onClick={() => handleDelete(camp.id)} title="Delete"><i className="bx bx-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Campaign Creation Modal */}
          {isModalOpen && (
            <div className="modal" style={{ display: 'block' }}>
              <div className="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Create New Campaign</h2>
                  <button className="modal-close" onClick={() => setIsModalOpen(false)}><i className="bx bx-x"></i></button>
                </div>
                <form onSubmit={handleCreateCampaign}>
                  <div className="form-group">
                    <label>Campaign Name</label>
                    <input type="text" placeholder="E.g., Q3 Enterprise Acquisition" required />
                  </div>
                  
                  <div className="form-group">
                    <label>Campaign Description</label>
                    <textarea placeholder="Describe the focus and deliverables of this campaign..." rows={3} required></textarea>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Campaign Goal</label>
                      <select className="form-control-select">
                        <option value="lead">Lead Generation</option>
                        <option value="brand">Brand Awareness</option>
                        <option value="conv">Conversion Rate Optimization</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Budget (USD)</label>
                      <input type="number" placeholder="e.g. 5000" min="100" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Select Target Channels</label>
                    <div className="channels-checkbox-grid">
                      <label className="checkbox-container">
                        <input type="checkbox" name="channels" value="instagram" defaultChecked />
                        <span className="checkmark"></span>
                        Instagram
                      </label>
                      <label className="checkbox-container">
                        <input type="checkbox" name="channels" value="facebook" defaultChecked />
                        <span className="checkmark"></span>
                        Facebook
                      </label>
                      <label className="checkbox-container">
                        <input type="checkbox" name="channels" value="linkedin" defaultChecked />
                        <span className="checkmark"></span>
                        LinkedIn
                      </label>
                      <label className="checkbox-container">
                        <input type="checkbox" name="channels" value="email" />
                        <span className="checkmark"></span>
                        Email marketing
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Launch Schedule</label>
                    <input type="datetime-local" className="form-control" style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} required />
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem' }}>Select when the campaign should begin posting and tracking.</p>
                  </div>

                  <div className="form-group flex-row-toggle">
                    <div className="toggle-info">
                      <h4>Enable AI Optimization Engine</h4>
                      <p>Auto-budget distribution and dynamically generated ad copy changes based on live ROI.</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Launch Campaign</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
    </div>
  );
}
