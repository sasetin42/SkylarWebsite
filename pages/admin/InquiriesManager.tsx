import React, { useState, useEffect } from 'react';
import { CourseInquiry } from '../../types';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '../../services/storageService';
import { Search, Filter, Mail, Phone, Calendar, MapPin, Building, Users, Eye, Trash2, CheckCircle, Clock, FileText, Download, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

export const InquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<CourseInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<CourseInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const [activeInquiry, setActiveInquiry] = useState<CourseInquiry | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const reloadData = () => {
    const data = getInquiries();
    setInquiries(data);
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('inquiriesUpdated', reloadData);
    return () => window.removeEventListener('inquiriesUpdated', reloadData);
  }, []);

  useEffect(() => {
    let result = inquiries;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(i => 
        i.studentName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q) ||
        i.referenceCode.toLowerCase().includes(q) ||
        i.courseTitle.toLowerCase().includes(q) ||
        (i.company && i.company.toLowerCase().includes(q))
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter(i => i.status === selectedStatus);
    }

    if (selectedLocation !== 'All') {
      result = result.filter(i => i.location === selectedLocation);
    }

    setFilteredInquiries(result);
  }, [inquiries, searchTerm, selectedStatus, selectedLocation]);

  const handleStatusChange = (id: string, newStatus: CourseInquiry['status']) => {
    updateInquiryStatus(id, newStatus);
    if (activeInquiry && activeInquiry.id === id) {
      setActiveInquiry({ ...activeInquiry, status: newStatus });
    }
  };

  const handleSaveNote = () => {
    if (!activeInquiry) return;
    updateInquiryStatus(activeInquiry.id, activeInquiry.status, adminNote);
    setActiveInquiry({ ...activeInquiry, notes: adminNote });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry record?')) {
      deleteInquiry(id);
      if (activeInquiry?.id === id) setActiveInquiry(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) return;

    const headers = ['Reference Code', 'Student Name', 'Email', 'Phone', 'Company', 'Course Title', 'Location', 'Preferred Date', 'Participants', 'Status', 'Date Submitted'];
    const rows = filteredInquiries.map(i => [
      i.referenceCode,
      `"${i.studentName}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.company || ''}"`,
      `"${i.courseTitle}"`,
      `"${i.location}"`,
      i.preferredDate || '',
      `"${i.participantsCount}"`,
      i.status,
      new Date(i.createdAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Skylar_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPIs
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === 'New').length;
  const contactedCount = inquiries.filter(i => i.status === 'Contacted' || i.status === 'Quoted').length;
  const resolvedCount = inquiries.filter(i => i.status === 'Resolved').length;

  const getStatusBadge = (status: CourseInquiry['status']) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle size={12} /> New</span>;
      case 'Contacted':
        return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Phone size={12} /> Contacted</span>;
      case 'Quoted':
        return <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FileText size={12} /> Quoted</span>;
      case 'Resolved':
        return <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Resolved</span>;
      case 'Archived':
        return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/30 rounded-full text-xs font-bold flex items-center gap-1 w-fit">Archived</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-300 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            <MessageSquare className="text-accent" /> Course Inquiries Monitoring
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time student and corporate training inquiry tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reloadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Total Inquiries</span>
            <FileText size={18} className="text-slate-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalCount}</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-amber-400 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>New / Unread</span>
            <AlertCircle size={18} className="text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{newCount}</p>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-blue-400 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>In Progress / Quoted</span>
            <Phone size={18} className="text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{contactedCount}</p>
        </div>

        <div className="bg-slate-900 border border-green-500/30 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-green-400 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Resolved / Enrolled</span>
            <CheckCircle size={18} className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{resolvedCount}</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name, email, phone, course or reference code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2.5 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none text-xs font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Quoted">Quoted</option>
              <option value="Resolved">Resolved</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="py-2.5 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none text-xs font-semibold"
          >
            <option value="All">All Locations</option>
            <option value="Pampanga Facility">Pampanga Facility</option>
            <option value="Manila Safety Center">Manila Safety Center</option>
            <option value="On-Site Corporate Facility">On-Site Corporate</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-4 px-6">Ref Code</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Course / Location</th>
                <th className="py-4 px-6">Participants / Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                    No inquiry records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-accent">
                      {inquiry.referenceCode}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{inquiry.studentName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{inquiry.email}</span> &bull; <span>{inquiry.phone}</span>
                      </div>
                      {inquiry.company && (
                        <span className="inline-block mt-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {inquiry.company}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200 truncate max-w-[220px]">
                        {inquiry.courseTitle}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-accent shrink-0" /> {inquiry.location}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300">
                      <div className="font-medium text-slate-200">{inquiry.participantsCount}</div>
                      {inquiry.preferredDate && (
                        <div className="text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={12} /> {inquiry.preferredDate}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(inquiry.status)}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveInquiry(inquiry);
                          setAdminNote(inquiry.notes || '');
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Details"
                      >
                        <Eye size={16} /> View
                      </button>

                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors inline-flex items-center"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail & Status Update Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-white p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">{activeInquiry.referenceCode}</span>
                <h3 className="text-2xl font-bold font-heading text-white mt-1">{activeInquiry.studentName}</h3>
                <p className="text-xs text-slate-400">Submitted on {new Date(activeInquiry.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(activeInquiry.status)}
                <button
                  onClick={() => setActiveInquiry(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['New', 'Contacted', 'Quoted', 'Resolved', 'Archived'] as CourseInquiry['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeInquiry.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeInquiry.status === st
                        ? 'bg-accent text-secondary shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 text-sm">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Email</span>
                <a href={`mailto:${activeInquiry.email}`} className="text-blue-400 hover:underline font-semibold flex items-center gap-1.5">
                  <Mail size={14} /> {activeInquiry.email}
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Phone</span>
                <a href={`tel:${activeInquiry.phone}`} className="text-green-400 hover:underline font-semibold flex items-center gap-1.5">
                  <Phone size={14} /> {activeInquiry.phone}
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Company / Org</span>
                <span className="font-semibold text-slate-200">{activeInquiry.company || 'N/A (Individual)'}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Training Location</span>
                <span className="font-semibold text-slate-200">{activeInquiry.location}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Selected Course</span>
                <span className="font-semibold text-accent">{activeInquiry.courseTitle}</span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Participants / Preferred Date</span>
                <span className="font-semibold text-slate-200">{activeInquiry.participantsCount} &bull; {activeInquiry.preferredDate}</span>
              </div>
            </div>

            {/* Message Body */}
            {activeInquiry.message && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Message / Special Requirements:</span>
                <p className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-slate-300 text-sm leading-relaxed">
                  "{activeInquiry.message}"
                </p>
              </div>
            )}

            {/* Admin Internal Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Internal Admin Notes (Private)
              </label>
              <textarea
                rows={3}
                placeholder="Add internal notes on calls, quotation sent, or follow-up dates..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-accent"
              />
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Notes
              </button>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleDelete(activeInquiry.id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Record
              </button>

              <button
                onClick={() => setActiveInquiry(null)}
                className="px-6 py-2.5 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl text-sm transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
