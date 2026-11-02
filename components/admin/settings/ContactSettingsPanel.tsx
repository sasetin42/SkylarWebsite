import React, { useState } from 'react';
import { PhoneCall, Mail, UserCheck, Plus, Trash2, Edit2, Check, Bell, Shield } from 'lucide-react';
import { ContactProfile } from '../../../types';

interface ContactSettingsPanelProps {
  contacts: ContactProfile[];
  onChangeContacts: (contacts: ContactProfile[]) => void;
}

export const ContactSettingsPanel: React.FC<ContactSettingsPanelProps> = ({ contacts, onChangeContacts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactProfile>>({});

  const handleStartEdit = (contact: ContactProfile) => {
    setEditingId(contact.id);
    setEditForm({ ...contact });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = contacts.map(c => (c.id === editingId ? ({ ...c, ...editForm } as ContactProfile) : c));
    onChangeContacts(updated);
    setEditingId(null);
  };

  const handleToggleEvent = (contactId: string, eventKey: string) => {
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const events = c.notifyEvents.includes(eventKey)
          ? c.notifyEvents.filter(e => e !== eventKey)
          : [...c.notifyEvents, eventKey];
        return { ...c, notifyEvents: events };
      }
      return c;
    });
    onChangeContacts(updated);
  };

  const handleToggleStatus = (contactId: string) => {
    const updated = contacts.map(c => (c.id === contactId ? { ...c, status: c.status === 'Active' ? 'Inactive' as const : 'Active' as const } : c));
    onChangeContacts(updated);
  };

  const AVAILABLE_EVENTS = [
    { id: 'contact_form', label: 'Public Inquiries' },
    { id: 'course_booking', label: 'Student Enrollments' },
    { id: 'corporate_quote', label: 'Corporate Quotations' },
    { id: 'payment_received', label: 'Payment Receipts' },
    { id: 'support_ticket', label: 'Helpdesk Tickets' },
    { id: 'system_error', label: 'Critical Tech Alerts' }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <PhoneCall size={20} />
          </span>
          Departmental Contact Directory & System Notification Routing
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Configure designated departmental representatives and assign which system events dispatch automated notifications to specific desks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact) => {
          const isEditing = editingId === contact.id;

          return (
            <div
              key={contact.id}
              className="bg-gray-900/70 border border-gray-800 hover:border-gray-700 rounded-xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-md"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between pb-3 border-b border-gray-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono">
                      {contact.department}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
                      {contact.name}
                    </h4>
                    <span className="text-xs text-gray-400">{contact.position}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(contact.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        contact.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                    >
                      {contact.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => (isEditing ? handleSaveEdit() : handleStartEdit(contact))}
                      className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors border border-gray-700"
                      title={isEditing ? 'Save edits' : 'Edit profile'}
                    >
                      {isEditing ? <Check size={14} className="text-emerald-400" /> : <Edit2 size={13} />}
                    </button>
                  </div>
                </div>

                {/* Edit Form or Display Details */}
                {isEditing ? (
                  <div className="space-y-3 pt-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Position / Title</label>
                      <input
                        type="text"
                        value={editForm.position || ''}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-gray-300 pt-3 font-mono">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-gray-500" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall size={13} className="text-gray-500" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                )}

                {/* Subscribed Notification Events */}
                <div className="mt-4 pt-3 border-t border-gray-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Bell size={13} className="text-amber-400" />
                    <span>Dispatched Alert Triggers</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_EVENTS.map((ev) => {
                      const isSubscribed = contact.notifyEvents.includes(ev.id);
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => handleToggleEvent(contact.id, ev.id)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all border ${
                            isSubscribed
                              ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                              : 'bg-gray-800/60 border-gray-700/60 text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          {isSubscribed ? '✓ ' : '+ '}
                          {ev.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
