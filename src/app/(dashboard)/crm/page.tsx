"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const initialLeads: any[] = [];

export default function CRMPage() {
  const [view, setView] = useState('leads'); // 'leads' or 'contacts'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState(initialLeads);

  const handleCall = (name: string) => {
    toast(`Initiating VOIP call to ${name}...`, {
      icon: '📞',
      style: {
        borderRadius: '10px',
        background: '#1E293B',
        color: '#fff',
      },
    });
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${view === 'leads' ? 'Lead' : 'Contact'} added successfully!`);
    setIsModalOpen(false);
  };

  const filteredData = leads.filter(item => item.type === (view === 'leads' ? 'lead' : 'contact'));

  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-crm" className="page active" style={{ display: 'block' }}>
          <div className="page-header">
            <div className="header-title">
              <h1>CRM & Pipeline</h1>
              <p>Manage your leads, track conversions, and initiate universal VOIP calls instantly.</p>
            </div>
            <div className="header-actions">
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${view === 'leads' ? 'active' : ''}`}
                  onClick={() => setView('leads')}
                >Leads</button>
                <button 
                  className={`toggle-btn ${view === 'contacts' ? 'active' : ''}`}
                  onClick={() => setView('contacts')}
                >Contacts</button>
              </div>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <i className="bx bx-plus"></i> Add {view === 'leads' ? 'Lead' : 'Contact'}
              </button>
            </div>
          </div>

          {/* CRM Filters */}
          <div className="crm-filters">
            <div className="search-box">
              <i className="bx bx-search"></i>
              <input type="text" placeholder="Search name, company, email..." />
            </div>
            <div className="filter-dropdowns">
              <select>
                <option value="">Status (All)</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
              <select>
                <option value="">Source (All)</option>
                <option value="organic">Organic</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="referral">Referral</option>
              </select>
              <button className="btn btn-secondary btn-icon-only" title="Filter"><i className="bx bx-filter"></i></button>
            </div>
          </div>

          {/* CRM Grid / Empty State */}
          {filteredData.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <i className={`bx ${view === 'leads' ? 'bx-user-pin' : 'bx-id-card'}`} style={{ fontSize: '3rem', color: '#94A3B8', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>No {view === 'leads' ? 'Leads' : 'Contacts'} Found</h3>
              <p style={{ color: '#94A3B8', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>Your {view === 'leads' ? 'pipeline' : 'address book'} is currently empty. Add a new {view === 'leads' ? 'lead' : 'contact'} or import from a CSV to get started.</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add {view === 'leads' ? 'Lead' : 'Contact'}</button>
            </div>
          ) : (
            <div className="leads-grid" id="crm-grid">
              {filteredData.map(item => (
                <div key={item.id} className="lead-card">
                  <div className="lead-card-header">
                    <div className="lead-avatar" style={{ backgroundColor: item.color }}>{item.initials}</div>
                    <div className="lead-menu"><i className="bx bx-dots-horizontal-rounded"></i></div>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="lead-company">{item.company}</p>
                  
                  <div className="lead-contact-info">
                    <a href={`mailto:${item.email}`} className="contact-link"><i className="bx bx-envelope"></i> Email</a>
                    <a href="#" className="contact-link" onClick={(e) => { e.preventDefault(); handleCall(item.name); }}><i className="bx bx-phone"></i> Call</a>
                  </div>

                  <div className="lead-meta">
                    <span className="lead-status-badge">{item.status}</span>
                    <span className="lead-time"><i className="bx bx-time-five"></i> {item.lastContact}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Modal */}
          {isModalOpen && (
            <div className="modal-overlay active">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add New {view === 'leads' ? 'Lead' : 'Contact'}</h2>
                  <button className="modal-close" onClick={() => setIsModalOpen(false)}><i className="bx bx-x"></i></button>
                </div>
                <div className="modal-body">
                  <form id="form-add-lead" onSubmit={handleAddLead}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="john@company.com" required />
                    </div>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input type="text" placeholder="Company Inc." required />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select required>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" form="form-add-lead" className="btn btn-primary">Save {view === 'leads' ? 'Lead' : 'Contact'}</button>
                </div>
              </div>
            </div>
          )}
        </section>
    </div>
  );
}
