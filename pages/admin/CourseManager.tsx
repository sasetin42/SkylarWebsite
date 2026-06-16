
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon, 
  Check, AlertTriangle, Filter, Trash, UploadCloud, ArrowUpRight, Sparkles, Loader, MoreHorizontal, Key
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getCourses, saveCourse, deleteCourse } from '../../services/storageService';
import { generateCourseImage } from '../../services/geminiService';
import { Course, CourseCategory } from '../../types';

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // List State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterDuration, setFilterDuration] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [durationError, setDurationError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // AI Gen State
  const [showGenModal, setShowGenModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [genAspectRatio, setGenAspectRatio] = useState('16:9');
  const [genSize, setGenSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleEdit = (course: Course) => {
    setFormData(course);
    setIsEditing(true);
    setDurationError('');
    setImageError('');
  };

  const handleAdd = () => {
    setFormData({
      id: `c_${Date.now()}`,
      title: '',
      category: CourseCategory.SAFETY,
      shortDescription: '',
      fullDescription: '',
      price: 0,
      duration: '',
      level: 'Short Course',
      image: '',
      upcomingDates: []
    });
    setIsEditing(true);
    setDurationError('');
    setImageError('');
  };

  const validateDuration = (val: string) => {
    // Enforces Format: Number + Space + Unit (Day/Days/Month/Months/Week/Weeks/Hour/Hours)
    const regex = /^\d+\s+(Day|Days|Month|Months|Week|Weeks|Hour|Hours)$/i;
    if (!val) return true; 
    return regex.test(val);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side Validation: Duration
    if (formData.duration && !validateDuration(formData.duration)) {
      setDurationError("Format must be: '5 Days', '1 Month', or '8 Hours'");
      return;
    }
    
    // Client-side Validation: Image
    if (imageError) {
      return; // Don't save if there's an active image error
    }
    
    if (formData.id && formData.title) {
      setIsSaving(true);
      // Simulate network request
      setTimeout(() => {
        saveCourse(formData as Course);
        setCourses(getCourses());
        setIsEditing(false);
        setIsSaving(false);
      }, 800);
    }
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      deleteCourse(showDeleteModal);
      setCourses(getCourses());
      setShowDeleteModal(null);
      setSelectedIds(prev => prev.filter(id => id !== showDeleteModal));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected courses?`)) {
      selectedIds.forEach(id => deleteCourse(id));
      setCourses(getCourses());
      setSelectedIds([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(''); // Reset error
    
    if (file) {
      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid file type. Please upload JPEG, PNG, or GIF.");
        return;
      }

      // Validate File Size (Max 500KB)
      if (file.size > 500 * 1024) {
        setImageError("File size exceeds 500KB. Please select a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Check for API Key before opening modal
  const openGenModal = async () => {
      // Assuming window.aistudio is available in the environment
      if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
      } else {
          // Fallback if environment doesn't support the specific key selector (local dev)
          setHasApiKey(true); 
      }
      setShowGenModal(true);
  };

  const handleSelectApiKey = async () => {
      if ((window as any).aistudio) {
          await (window as any).aistudio.openSelectKey();
          // Assume success after interaction per guidelines, and reset state
          setHasApiKey(true);
      }
  };

  const handleGenerateImage = async () => {
      if (!genPrompt) return;
      setIsGenerating(true);
      const base64 = await generateCourseImage(genPrompt, genAspectRatio, genSize);
      if (base64) {
          setFormData(prev => ({ ...prev, image: base64 }));
          setShowGenModal(false);
          setGenPrompt(''); // reset
      } else {
          // If 404/error, it might be the key. Re-prompt user.
          setHasApiKey(false);
          alert("Failed to generate. You may need to select a valid API Key with access to Gemini 3 Pro.");
      }
      setIsGenerating(false);
  };

  // Filter Logic
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    
    let matchesPrice = true;
    if (filterPrice === 'Low') matchesPrice = c.price < 500;
    if (filterPrice === 'Medium') matchesPrice = c.price >= 500 && c.price <= 1500;
    if (filterPrice === 'High') matchesPrice = c.price > 1500;

    let matchesDuration = true;
    if (filterDuration === 'Short') matchesDuration = /Day|Hour/i.test(c.duration);
    if (filterDuration === 'Medium') matchesDuration = /Week/i.test(c.duration);
    if (filterDuration === 'Long') matchesDuration = /Month/i.test(c.duration);

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCourses.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 animate-fade-in-up relative">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">{formData.id?.startsWith('c_') ? 'Add New Course' : 'Edit Course'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
              <input 
                type="text" 
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as CourseCategory})}
              >
                {Object.values(CourseCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
              <input 
                type="number" 
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.price || 0}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 5 Days"
                className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm ${durationError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}`}
                value={formData.duration || ''}
                onChange={e => {
                  setFormData({...formData, duration: e.target.value});
                  setDurationError('');
                }}
              />
              {durationError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12}/> {durationError}</p>}
            </div>
            
            {/* Image Upload Section with Validation */}
            <div className="md:col-span-2 p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50">
               <div className="flex justify-between items-center mb-4">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Course Image</label>
                   <button 
                      type="button"
                      onClick={openGenModal}
                      className="text-xs flex items-center gap-1 text-accent font-bold hover:text-yellow-500 transition-colors"
                   >
                      <Sparkles size={14} /> Generate with AI
                   </button>
               </div>
               
               <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Image Preview Area */}
                  {formData.image && !imageError && (
                    <div className="w-full md:w-1/3 shrink-0">
                      <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600 group aspect-video">
                        <img src={formData.image} alt="Course Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button type="button" size="sm" variant="danger" onClick={() => setFormData({...formData, image: ''})}>Remove</Button>
                        </div>
                      </div>
                      <p className="text-center text-xs text-green-600 mt-2 font-bold flex justify-center items-center gap-1"><Check size={12}/> Image Loaded</p>
                    </div>
                  )}

                  <div className="flex-1 w-full">
                      <label className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all group ${imageError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}`}>
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud size={20} className="text-primary dark:text-blue-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                             {formData.image ? 'Click to replace image' : 'Click to upload image'}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF up to 500KB</span>
                      </label>
                      
                      {imageError && (
                        <div className="mt-3 text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg w-full">
                          <AlertTriangle size={16} /> {imageError}
                        </div>
                      )}
                  </div>
               </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.shortDescription || ''}
                onChange={e => setFormData({...formData, shortDescription: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Description</label>
              <textarea 
                rows={5}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.fullDescription || ''}
                onChange={e => setFormData({...formData, fullDescription: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="w-32">
                {isSaving ? <><Loader className="animate-spin mr-2" size={16}/> Saving...</> : 'Save Course'}
            </Button>
          </div>
        </form>

        {/* AI Image Generation Modal */}
        {showGenModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-accent">
                            <Sparkles size={20} />
                            <h3 className="text-xl font-bold font-heading text-gray-800 dark:text-white">AI Image Generator</h3>
                        </div>
                        <button onClick={() => setShowGenModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                    </div>

                    {!hasApiKey ? (
                        <div className="text-center py-8">
                            <Key size={48} className="mx-auto text-yellow-500 mb-4" />
                            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">API Key Required</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You need to select a billing project to use the AI generator.</p>
                            <Button onClick={handleSelectApiKey} className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                                Select API Key
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image Prompt</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Describe the image you want (e.g. 'Technicians working on a wind turbine at sunset')"
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent transition-all dark:text-white"
                                    value={genPrompt}
                                    onChange={e => setGenPrompt(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Aspect Ratio</label>
                                    <select 
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                                        value={genAspectRatio}
                                        onChange={e => setGenAspectRatio(e.target.value)}
                                    >
                                        <option value="1:1">1:1 (Square)</option>
                                        <option value="16:9">16:9 (Landscape)</option>
                                        <option value="4:3">4:3 (Standard)</option>
                                        <option value="3:4">3:4 (Portrait)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Quality</label>
                                    <select 
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                                        value={genSize}
                                        onChange={e => setGenSize(e.target.value)}
                                    >
                                        <option value="1K">Standard (1K)</option>
                                        <option value="2K">High (2K)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleGenerateImage} 
                                disabled={isGenerating || !genPrompt}
                                className="w-full mt-4 bg-gradient-to-r from-accent to-yellow-500 text-white border-none shadow-lg hover:shadow-xl"
                            >
                                {isGenerating ? <span className="flex items-center gap-2"><Loader className="animate-spin" size={16}/> Generating...</span> : 'Generate Image'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-secondary dark:text-white">Course Catalog</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage training programs, dates, and pricing.</p>
        </div>
        <Button onClick={handleAdd} className="shadow-lg hover:shadow-xl">
          <Plus size={18} className="mr-2" /> Create Course
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col xl:flex-row gap-4 justify-between items-center">
            
            {/* Search & Bulk Actions */}
            <div className="flex items-center gap-4 w-full xl:w-auto">
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg animate-fade-in">
                        <span className="text-xs font-bold">{selectedIds.length} Selected</span>
                        <button onClick={handleBulkDelete} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"><Trash2 size={16}/></button>
                    </div>
                )}
                
                <div className="relative flex-1 xl:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {Object.values(CourseCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                
                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(e.target.value)}
                >
                    <option value="All">Any Price</option>
                    <option value="Low">Low (&lt; $500)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (&gt; $1.5k)</option>
                </select>

                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                >
                    <option value="All">Any Duration</option>
                    <option value="Short">Short (1-2 Days)</option>
                    <option value="Medium">Medium (Week)</option>
                    <option value="Long">Long (Month+)</option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-wider border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 w-10">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedIds.length === filteredCourses.length && filteredCourses.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4">Course Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredCourses.map(course => (
                        <tr key={course.id} className={`hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors group ${selectedIds.includes(course.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <td className="px-6 py-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={selectedIds.includes(course.id)}
                                    onChange={() => handleSelectRow(course.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                                        <img src={course.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{course.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{course.shortDescription}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-900/50">
                                    {course.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{course.duration}</td>
                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-white font-mono">${course.price}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-sm"><Edit2 size={18}/></button>
                                    <button onClick={() => setShowDeleteModal(course.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 shadow-sm"><Trash2 size={18}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredCourses.length === 0 && (
                <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No courses match your filters.</p>
                    <button onClick={() => {setSearchTerm(''); setFilterCategory('All'); setFilterPrice('All'); setFilterDuration('All');}} className="text-primary text-sm font-bold hover:underline mt-2">Clear Filters</button>
                </div>
            )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trash2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Course?</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">This action cannot be undone. Are you sure you want to proceed?</p>
                  <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={() => setShowDeleteModal(null)}>Cancel</Button>
                      <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-transparent">Delete</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
