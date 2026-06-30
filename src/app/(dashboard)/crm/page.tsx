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

  // Add form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'New', // or Stage for deals
    value: '', // for deals
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
        fetchData(); // Refresh data
      } else {
        toast.error('Failed to add record', { id: toastId });
      }
    } catch (error) {
      toast.error('Error adding record', { id: toastId });
    }
  };

  // Drag and drop handlers for Kanban
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;

    // Optimistic update
    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    );
    setDeals(updatedDeals);

    // Call API to update stage
    try {
      const res = await fetch('/api/crm/deals/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dealId, stage: newStage })
      });
      if (res.ok) {
        toast.success(`Moved to ${newStage}`);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Failed to move deal');
      fetchData(); // Revert on failure
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderPipeline = () => {
    const stages = ['Prospect', 'Negotiation', 'Won', 'Lost'];
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          
          return (
            <div 
              key={stage} 
              className="flex-shrink-0 w-80 bg-gray-900/50 rounded-xl border border-gray-800 p-4 flex flex-col"
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-200">{stage}</h3>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{stageDeals.length}</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">${totalValue.toLocaleString()}</div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {stageDeals.map(deal => (
                  <div 
                    key={deal.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-grab hover:border-indigo-500 transition-colors"
                  >
                    <h4 className="font-medium text-white mb-1">{deal.title}</h4>
                    <p className="text-sm text-cyan-400 font-semibold">${(deal.value || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(deal.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderList = (data: any[]) => {
    if (loading) return <div className="text-center text-gray-400 py-10">Loading...</div>;
    
    if (data.length === 0) {
      return (
        <div className="text-center bg-gray-900/50 p-12 rounded-xl border border-gray-800 border-dashed">
          <i className="bx bx-folder-open text-4xl text-gray-600 mb-3 block"></i>
          <h3 className="text-gray-300 font-medium mb-1">No records found</h3>
          <p className="text-gray-500 text-sm mb-4">Get started by adding a new record.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Add New
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">{view === 'leads' ? 'Status' : 'Job Title'}</th>
              <th className="px-6 py-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.company || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {item.email && <span className="flex items-center gap-2"><i className="bx bx-envelope text-gray-500"></i> {item.email}</span>}
                    {item.phone && <span className="flex items-center gap-2"><i className="bx bx-phone text-gray-500"></i> {item.phone}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {view === 'leads' ? (
                    <span className="bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full text-xs font-medium">
                      {item.status}
                    </span>
                  ) : (
                    <span>{item.jobTitle || '-'}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleCall(item.name)} className="text-gray-400 hover:text-cyan-400 transition-colors" title="Call">
                      <i className="bx bx-phone-call text-lg"></i>
                    </button>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="text-gray-400 hover:text-indigo-400 transition-colors" title="Email">
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
    <div className="page-container p-8 h-full overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">CRM & Pipeline</h1>
          <p className="text-gray-400">Manage your leads, track conversions, and manage deals.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              onClick={() => setView('pipeline')}
            >Pipeline</button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'leads' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              onClick={() => setView('leads')}
            >Leads</button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'contacts' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              onClick={() => setView('contacts')}
            >Contacts</button>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <i className="bx bx-plus"></i> Add {view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {view === 'pipeline' ? renderPipeline() : renderList(view === 'leads' ? leads : contacts)}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New {view === 'pipeline' ? 'Deal' : view === 'leads' ? 'Lead' : 'Contact'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>
            <div className="p-6">
              <form id="add-form" onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">{view === 'pipeline' ? 'Deal Title' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={view === 'pipeline' ? "e.g. Enterprise License" : "John Doe"} 
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                {view === 'pipeline' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Value ($)</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: e.target.value})}
                        placeholder="5000" 
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Stage</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@company.com" 
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Phone</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 234 567 8900" 
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-300">Company Name</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        placeholder="Company Inc." 
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </>
                )}
                
                {view === 'leads' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50 rounded-b-2xl">
              <button 
                className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-gray-800 transition-colors" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-form" 
                className="px-5 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
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
