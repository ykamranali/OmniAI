"use client";

import React from 'react';

export default function IntegrationsPage() {
  return (
    <div className="page-container p-8 h-full overflow-y-auto">
      <section id="page-integrations" className="page active">
        <div className="page-header">
          <div className="header-title">
            <h1>VOIP & App Integrations</h1>
            <p>Connect your favorite tools, configure universal VOIP numbers, and expand OmniAI capabilities.</p>
          </div>
          <button className="btn btn-primary">
            <i className="bx bx-plus"></i> Connect App
          </button>
        </div>

        {/* VOIP Settings */}
        <div className="settings-card" style={{ marginTop: '24px' }}>
          <h3><i className="bx bx-phone-call"></i> Universal VOIP Configuration</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Configure your SIP trunks, Twilio, or RingCentral API keys for integrated dashboard calling.</p>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Provider</label>
            <select className="form-control-select" style={{ width: '100%', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white' }}>
              <option value="twilio">Twilio</option>
              <option value="ringcentral">RingCentral</option>
              <option value="vonage">Vonage (Nexmo)</option>
              <option value="custom_sip">Custom SIP Server</option>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Account SID / Client ID</label>
            <input type="text" className="form-control" defaultValue="ACf1b4a9...8e312a" style={{ width: '100%', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Auth Token / Client Secret</label>
            <input type="password" className="form-control" defaultValue="************************" style={{ width: '100%', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white' }} />
          </div>

          <button className="btn btn-primary">
            Verify Connection
          </button>
        </div>

        {/* Connected Applications */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>Connected Applications</h3>
          
          <div className="accounts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* Salesforce */}
            <div className="account-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', transition: 'all 0.2s ease' }}>
              <div className="account-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#00A1E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white' }}>
                    <i className="bx bxl-salesforce"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Salesforce</h4>
                    <span style={{ fontSize: '12px', color: 'var(--success)' }}>Connected</span>
                  </div>
                </div>
                <div className="dropdown">
                  <i className="bx bx-dots-vertical-rounded"></i>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Syncing leads, opportunities, and contact activity bi-directionally.</p>
            </div>

            {/* Slack */}
            <div className="account-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', transition: 'all 0.2s ease' }}>
              <div className="account-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#E01E5A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white' }}>
                    <i className="bx bxl-slack"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Slack</h4>
                    <span style={{ fontSize: '12px', color: 'var(--success)' }}>Connected</span>
                  </div>
                </div>
                <div className="dropdown">
                  <i className="bx bx-dots-vertical-rounded"></i>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Receive notifications for incoming VOIP calls, new leads, and AI generation tasks.</p>
            </div>

            {/* Stripe */}
            <div className="account-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', transition: 'all 0.2s ease', opacity: 0.7 }}>
              <div className="account-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#635BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white' }}>
                    <i className="bx bxl-stripe"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>Stripe</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Not Connected</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">Connect</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>Sync billing status, process payments directly from CRM.</p>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
