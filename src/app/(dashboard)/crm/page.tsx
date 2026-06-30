"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CRMPage() {
  const [view, setView] = useState<'leads' | 'contacts' | 'pipeline'>('pipeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'New',
    value: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, contactsRes, dealsRes] = await Promise.all([
        fetch('/api/crm/leads'),
        fetch('/api/crm/contacts'),
        fetch('/api/crm/deals')
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts || []);
      }
      if (dealsRes.ok) {
        const data = await dealsRes.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Failed to fetch CRM data', error);
      toast.error('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = `/api/crm/${view}`;
    const payload = view === 'pipeline' 
      ? { title: formData.name, value: formData.value, stage: formData.status }
      : formData;

    const toastId = toast.loading(`Adding ${view.slice(0, -1)}...`);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(`${view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'} added successfully!`, { id: toastId });
        setIsModalOpen(false);
        setFormData({ name: '', email: '', company: '', phone: '', status: 'New', value: '' });
        fetchData(); 
      } else {
        toast.error('Failed to add record', { id: toastId });
      }
    } catch (error) {
      toast.error('Error adding record', { id: toastId });
    }
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;

    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    );
    setDeals(updatedDeals);

    try {
      const res = await fetch('/api/crm/deals/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dealId, stage: newStage })
      });
      if (res.ok) {
        toast.success(`Moved to ${newStage}`, {
          icon: '🚀',
          style: {
            borderRadius: '10px',
            background: '#1E293B',
            color: '#fff',
            border: '1px solid rgba(6, 182, 212, 0.5)'
          },
        });
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Failed to move deal');
      fetchData(); 
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderPipeline = () => {
    const stages = ['Prospect', 'Negotiation', 'Won', 'Lost'];
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          
          let glowColor = 'rgba(255,255,255,0.05)';
          let badgeColor = 'bg-gray-800 text-gray-400';
          if(stage === 'Won') { glowColor = 'rgba(16, 185, 129, 0.1)'; badgeColor = 'bg-emerald-500/20 text-emerald-400'; }
          if(stage === 'Lost') { glowColor = 'rgba(239, 68, 68, 0.1)'; badgeColor = 'bg-red-500/20 text-red-400'; }
          if(stage === 'Negotiation') { glowColor = 'rgba(139, 92, 246, 0.1)'; badgeColor = 'bg-purple-500/20 text-purple-400'; }

          return (
            <div 
              key={stage} 
              className="flex-shrink-0 w-80 rounded-2xl border border-white/10 p-5 flex flex-col transition-all duration-300"
              style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', boxShadow: `inset 0 0 40px ${glowColor}` }}
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-100 tracking-wide">{stage}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${badgeColor}`}>{stageDeals.length}</span>
              </div>
              <div className="text-sm font-medium text-gray-400 mb-5 border-b border-white/5 pb-3">
                ${totalValue.toLocaleString()}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {stageDeals.map(deal => (
                  <div 
                    key={deal.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="group relative bg-white/5 p-4 rounded-xl border border-white/10 cursor-grab hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h4 className="font-semibold text-white mb-1.5">{deal.title}</h4>
                    <p className="text-sm text-cyan-400 font-bold bg-cyan-500/10 inline-block px-2 py-0.5 rounded">${(deal.value || 0).toLocaleString()}</p>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500 font-medium">{new Date(deal.createdAt).toLocaleDateString()}</p>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                        {deal.title.substring(0,2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded-xl p-6 text-center text-gray-500 text-sm font-medium">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderList = (data: any[]) => {
    if (loading) return <div className="flex items-center justify-center h-64 text-cyan-400 animate-pulse font-medium tracking-widest text-sm">LOADING RECORDS...</div>;
    
    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <i className="bx bx-folder-open text-4xl text-cyan-400"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No records found</h3>
          <p className="text-gray-400 mb-8 max-w-md">Your database is completely empty. Start filling it up with amazing new opportunities.</p>
          <button 
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]" 
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bx bx-plus mr-2"></i>Add New Record
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-black/40 text-gray-400">
            <tr>
              <th className="px-6 py-5 font-bold tracking-wider">Name</th>
              <th className="px-6 py-5 font-bold tracking-wider">Company</th>
              <th className="px-6 py-5 font-bold tracking-wider">Contact Info</th>
              <th className="px-6 py-5 font-bold tracking-wider">{view === 'leads' ? 'Status' : 'Job Title'}</th>
              <th className="px-6 py-5 font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600/80 to-cyan-600/80 flex items-center justify-center font-bold text-white shadow-lg">
                      {item.name.substring(0,2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-white text-base">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-medium">{item.company || '-'}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    {item.email && <span className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"><i className="bx bx-envelope"></i> {item.email}</span>}
                    {item.phone && <span className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"><i className="bx bx-phone"></i> {item.phone}</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {view === 'leads' ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Won' || item.status === 'Qualified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'Lost' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {item.status}
                    </span>
                  ) : (
                    <span className="font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/10">{item.jobTitle || '-'}</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleCall(item.name)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg" title="Call">
                      <i className="bx bx-phone-call text-lg"></i>
                    </button>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-500 transition-all shadow-lg" title="Email">
                        <i className="bx bx-envelope text-lg"></i>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="page-container p-4 md:p-8 h-full overflow-y-auto flex flex-col relative">
      {/* Background neon flares */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">CRM & Pipeline</h1>
          <p className="text-gray-400 font-medium text-sm md:text-base">Command center for your leads, conversions, and deals.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Futuristic segmented control */}
          <div className="flex bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
            <button 
              className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${view === 'pipeline' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setView('pipeline')}
            >
              Pipeline
              {view === 'pipeline' && <div className="absolute inset-0 bg-white/10 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"></div>}
            </button>
            <button 
              className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${view === 'leads' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setView('leads')}
            >
              Leads
              {view === 'leads' && <div className="absolute inset-0 bg-white/10 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"></div>}
            </button>
            <button 
              className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${view === 'contacts' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => setView('contacts')}
            >
              Contacts
              {view === 'contacts' && <div className="absolute inset-0 bg-white/10 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"></div>}
            </button>
          </div>
          
          <button 
            className="group relative px-6 py-2.5 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]" 
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-all group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">
              <i className="bx bx-plus text-lg"></i> Add {view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        {view === 'pipeline' ? renderPipeline() : renderList(view === 'leads' ? leads : contacts)}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0F1A] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">New {view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <form id="add-form" onSubmit={handleAddSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{view === 'pipeline' ? 'Deal Title' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={view === 'pipeline' ? "e.g. Enterprise License" : "John Doe"} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
                
                {view === 'pipeline' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Value ($)</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: e.target.value})}
                        placeholder="5000" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stage</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                      >
                        <option value="Prospect">Prospect</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@company.com" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 234 567 8900" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        placeholder="Company Inc." 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </>
                )}
                
                {view === 'leads' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                )}
              </form>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/20">
              <button 
                className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-form" 
                className="px-6 py-2.5 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Save {view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
