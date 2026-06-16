
import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, Mail, Phone, Search, User, X
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getCorporateClients, saveCorporateClient, deleteCorporateClient } from '../../services/storageService';
import { CorporateClient } from '../../types';

export const CorporateManager: React.FC = () => {
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CorporateClient>>({});

  useEffect(() => {
    setClients(getCorporateClients());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName) {
       saveCorporateClient({ ...formData, id: formData.id || `cc_${Date.now()}` } as CorporateClient);
       setClients(getCorporateClients());
       setIsEditing(false);
       setFormData({});
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this corporate client?')) {
        deleteCorporateClient(id);
        setClients(getCorporateClients());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Corporate Partners</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage B2B contracts and bulk enrollments.</p>
        </div>
        <Button onClick={() => { setFormData({}); setIsEditing(true); }} className="shadow-lg hover:shadow-xl">
          <Plus size={16} className="mr-2" /> Add Client
        </Button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white">{formData.id ? 'Edit Client' : 'New Client'}</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
           </div>
           
           <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Company Name</label>
                  <input className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
              </div>
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">ABN</label>
                  <input className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.abn || ''} onChange={e => setFormData({...formData, abn: e.target.value})} required />
              </div>
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Contact Person</label>
                  <input className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} required />
              </div>
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Email</label>
                  <input className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.contractStatus || 'Active'} onChange={e => setFormData({...formData, contractStatus: e.target.value as any})}>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Expired</option>
                  </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit">Save Partner</Button>
              </div>
           </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
                <div key={client.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm">
                            <Building2 size={28} />
                        </div>
                        <div className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${
                            client.contractStatus === 'Active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                        }`}>
                            {client.contractStatus}
                        </div>
                    </div>
                    <h3 className="font-bold text-xl text-secondary dark:text-white mb-1">{client.companyName}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-mono">ABN: {client.abn}</p>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-gray-400"/> <span className="font-medium">{client.contactPerson}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-400"/> <span className="truncate">{client.email}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{client.studentCount} Students</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(client); setIsEditing(true); }} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800"><Edit2 size={18}/></button>
                            <button onClick={() => handleDelete(client.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800"><Trash2 size={18}/></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
