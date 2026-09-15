import React, { useState, useEffect } from 'react';
import { 
  Star, Plus, Trash2, Edit2, X, Search, Filter, RefreshCw, 
  Settings, Globe, CheckCircle, Eye, EyeOff, Sparkles, MessageSquare,
  UploadCloud, Loader, Camera, Check
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Testimonial, GoogleReviewSettings } from '../../types';
import { 
  getTestimonials, saveTestimonial, deleteTestimonial, 
  toggleTestimonialStatus, toggleTestimonialFeatured, 
  getGoogleReviewSettings, saveGoogleReviewSettings, syncGoogleReviews 
} from '../../services/storageService';
import { firebaseClient } from '../../services/firebaseClient';

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonials());
  const [googleSettings, setGoogleSettings] = useState<GoogleReviewSettings>(getGoogleReviewSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Google' | 'Website' | 'Manual'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Hidden'>('All');
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Sync Status
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setTestimonials(getTestimonials());
      setGoogleSettings(getGoogleReviewSettings());
    };
    window.addEventListener('testimonialsUpdated', handleUpdate);
    return () => window.removeEventListener('testimonialsUpdated', handleUpdate);
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    source: 'Website',
    status: 'Approved',
    isFeatured: false,
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setSelectedTestimonial(null);
    setFormData({
      id: `t_${Date.now()}`,
      name: '',
      role: '',
      content: '',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      source: 'Manual',
      status: 'Approved',
      isFeatured: false,
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setSelectedTestimonial(t);
    setFormData({ ...t });
    setIsEditModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Avatar image exceeds 10MB limit.");
        e.target.value = '';
        return;
      }
      setIsUploadingAvatar(true);
      try {
        const mediaData = await firebaseClient.uploadMedia(file, 'testimonials', `avatar_${Date.now()}.jpg`);
        setFormData(prev => ({ ...prev, avatar: mediaData }));
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingAvatar(false);
        e.target.value = '';
      }
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) return;
    
    await saveTestimonial(formData as Testimonial);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id);
    }
  };

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const result = await syncGoogleReviews();
    setSyncFeedback(result.message);
    setIsSyncing(false);
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleReviewSettings(googleSettings);
    setIsSettingsModalOpen(false);
    setSyncFeedback('Google Review API settings saved successfully!');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // Filtered List
  const filteredTestimonials = (testimonials || []).filter(t => {
    if (!t) return false;
    const term = (searchTerm || '').toLowerCase().trim();
    const matchesSearch = !term ||
                          (t.name || '').toLowerCase().includes(term) || 
                          (t.content || '').toLowerCase().includes(term) ||
                          (t.role || '').toLowerCase().includes(term);
    const matchesSource = sourceFilter === 'All' || (t.source || 'Website') === sourceFilter;
    const matchesStatus = statusFilter === 'All' || (t.status || 'Approved') === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

  // Metrics
  const totalReviews = testimonials.length;
  const approvedReviews = testimonials.filter(t => (t.status || 'Approved') === 'Approved');
  const avgRating = (testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / (totalReviews || 1)).toFixed(1);
  const googleCount = testimonials.filter(t => t.source === 'Google').length;
  const featuredCount = testimonials.filter(t => t.isFeatured).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
              <Star size={14} className="fill-amber-500" /> Google & Delegate Reviews
            </span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white mt-1">
            Testimonials & Google Reviews
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage customer feedback, sync Google Places reviews, and feature top delegate testimonials across the website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <Settings size={16} /> Google API Setup
          </button>
          <button
            onClick={handleSyncGoogle}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing Google...' : 'Sync Google Reviews'}
          </button>
          <Button onClick={handleOpenAdd} className="flex items-center gap-2">
            <Plus size={18} /> Add Testimonial
          </Button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncFeedback && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 text-sm font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            {syncFeedback}
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-green-600 hover:text-green-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Reviews</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white mt-2">{totalReviews}</div>
          <div className="text-xs text-gray-500 mt-1">{approvedReviews.length} approved for display</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Average Rating</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
              <Star size={20} className="fill-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white mt-2 flex items-center gap-2">
            {avgRating} <span className="text-amber-500 text-lg">★★★★★</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Based on delegate feedback</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Google Reviews</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-lg">
              G
            </div>
          </div>
          <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white mt-2">{googleCount}</div>
          <div className="text-xs text-gray-500 mt-1">Google Places Verified</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Featured on Home</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white mt-2">{featuredCount}</div>
          <div className="text-xs text-gray-500 mt-1">Highlight cards selected</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by author, role, text..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Filter size={14} /> Source:
          </div>
          {(['All', 'Google', 'Website', 'Manual'] as const).map(src => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sourceFilter === src 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {src}
            </button>
          ))}

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            Status:
          </div>
          {(['All', 'Approved', 'Hidden'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st 
                  ? 'bg-secondary text-white shadow-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-4 px-6">Author & Role</th>
                <th className="py-4 px-6">Rating & Source</th>
                <th className="py-4 px-6">Review Content</th>
                <th className="py-4 px-6">Status & Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No testimonials found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar || "https://i.pravatar.cc/150?img=12"}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {t.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} size={14} className="fill-amber-500" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            t.source === 'Google' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {t.source === 'Google' ? 'Google Verified' : (t.source || 'Website')}
                          </span>
                          {t.date && <span className="text-xs text-gray-400">{t.date}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-xs md:text-sm leading-relaxed">
                        "{t.content}"
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 items-start">
                        <button
                          onClick={() => toggleTestimonialStatus(t.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                            (t.status || 'Approved') === 'Approved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          }`}
                        >
                          {(t.status || 'Approved') === 'Approved' ? <Eye size={12} /> : <EyeOff size={12} />}
                          {t.status || 'Approved'}
                        </button>

                        <button
                          onClick={() => toggleTestimonialFeatured(t.id)}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                            t.isFeatured 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Sparkles size={10} /> {t.isFeatured ? 'Featured' : 'Not Featured'}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="testimonial-name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Author Name *</label>
                  <input
                    id="testimonial-name"
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                    placeholder="e.g. Juan Dela Cruz"
                  />
                </div>

                <div>
                  <label htmlFor="testimonial-role" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Role / Job Title *</label>
                  <input
                    id="testimonial-role"
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                    placeholder="e.g. GWO Wind Technician"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="testimonial-rating" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Rating Stars</label>
                  <select
                    id="testimonial-rating"
                    value={formData.rating || 5}
                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★</option>
                    <option value={3}>3 Stars ★★★</option>
                    <option value={2}>2 Stars ★★</option>
                    <option value={1}>1 Star ★</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="testimonial-source" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Source</label>
                  <select
                    id="testimonial-source"
                    value={formData.source || 'Website'}
                    onChange={e => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  >
                    <option value="Google">Google</option>
                    <option value="Website">Website</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="testimonial-status" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Status</label>
                  <select
                    id="testimonial-status"
                    value={formData.status || 'Approved'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Author Photo / Avatar
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shrink-0">
                    <img 
                      src={formData.avatar || 'https://i.pravatar.cc/150?img=12'} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm ${isUploadingAvatar ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                      />
                      <Camera size={14} />
                      {isUploadingAvatar ? 'Uploading to Firebase...' : 'Upload New Photo'}
                    </label>

                    <input
                      id="testimonial-avatar"
                      type="url"
                      value={formData.avatar || ''}
                      onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs dark:text-white"
                      placeholder="Or paste image URL (https://...)"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="testimonial-content" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Review Content *</label>
                <textarea
                  id="testimonial-content"
                  rows={4}
                  required
                  value={formData.content || ''}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  placeholder="Write customer review..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-gray-300 text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <Button type="submit">
                  Save Testimonial
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="text-blue-500" size={20} /> Google Places API Settings
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-sm">
              <div>
                <label htmlFor="testimonial-api-key" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Google Places API Key</label>
                <input
                  id="testimonial-api-key"
                  type="password"
                  value={googleSettings.apiKey || ''}
                  onChange={e => setGoogleSettings({ ...googleSettings, apiKey: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  placeholder="AIzaSy..."
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Optional: Leave blank to use built-in Google verified sync simulator.</span>
              </div>

              <div>
                <label htmlFor="testimonial-place-id" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Google Place ID</label>
                <input
                  id="testimonial-place-id"
                  type="text"
                  value={googleSettings.placeId || ''}
                  onChange={e => setGoogleSettings({ ...googleSettings, placeId: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  placeholder="ChIJ..."
                />
              </div>

              <div>
                <label htmlFor="testimonial-place-url" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Google Maps / Review URL</label>
                <input
                  id="testimonial-place-url"
                  type="text"
                  value={googleSettings.placeUrl || ''}
                  onChange={e => setGoogleSettings({ ...googleSettings, placeUrl: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  placeholder="https://www.google.com/maps/search/?api=1&query=Skylar+Education"
                />
              </div>

              <div>
                <label htmlFor="testimonial-total-reviews" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Total Google Reviews Count</label>
                <input
                  id="testimonial-total-reviews"
                  type="number"
                  value={googleSettings.totalReviewsCount || 154}
                  onChange={e => setGoogleSettings({ ...googleSettings, totalReviewsCount: parseInt(e.target.value) || 154 })}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  placeholder="154"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="testimonial-min-rating" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Minimum Star Rating</label>
                  <select
                    id="testimonial-min-rating"
                    value={googleSettings.minimumRating || 4}
                    onChange={e => setGoogleSettings({ ...googleSettings, minimumRating: parseInt(e.target.value) || 4 })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl dark:text-white"
                  >
                    <option value={5}>5 Stars Only</option>
                    <option value={4}>4 Stars and Above</option>
                    <option value={3}>3 Stars and Above</option>
                  </select>
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-gray-300 text-xs">
                    <input
                      type="checkbox"
                      checked={googleSettings.autoSync}
                      onChange={e => setGoogleSettings({ ...googleSettings, autoSync: e.target.checked })}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    Enable Auto Sync
                  </label>
                </div>
              </div>

              {googleSettings.lastSyncedAt && (
                <div className="text-xs text-gray-400 pt-2">
                  Last Synced: {new Date(googleSettings.lastSyncedAt).toLocaleString()}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <Button type="submit">
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
