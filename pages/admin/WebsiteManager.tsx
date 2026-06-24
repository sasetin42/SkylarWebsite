
import React, { useState, useEffect } from 'react';
import {
    Layout, Edit2, Save, Globe, Image as ImageIcon,
    Type, Check, ArrowLeft, Eye, Smartphone, Monitor,
    Info, Home, Palette, RefreshCcw, PaintBucket, Sliders,
    FileText, Plus, Trash2, X, DollarSign, Clock, Star, UploadCloud
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getSitePages, savePageContent, getPageContent, getThemeSettings, saveThemeSettings, getCourses, saveCourse } from '../../services/storageService';
import { SitePage, ThemeSettings, PageSection, Course } from '../../types';
import { SectionRenderer } from '../../components/SectionRenderer';

export const WebsiteManager: React.FC = () => {
    const [pages, setPages] = useState<SitePage[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'theme'>('all');

    // Editor State (Pages)
    const [editingPage, setEditingPage] = useState<SitePage | null>(null);
    const [activePageEditorTab, setActivePageEditorTab] = useState<'content' | 'style'>('content');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);

    // Editor State (Courses)
    const [globalCourses, setGlobalCourses] = useState<Course[]>([]);

    // Editor State (Theme)
    const [theme, setTheme] = useState<ThemeSettings>(getThemeSettings());
    const [isThemeSaved, setIsThemeSaved] = useState(false);

    useEffect(() => {
        setPages(getSitePages());
    }, []);

    // --- Page Editor Handlers ---
    const handleSelectPage = (id: string) => {
        const page = getPageContent(id);
        if (page) {
            setEditingPage(JSON.parse(JSON.stringify(page))); // Deep copy
            setSelectedPageId(id);
            setActivePageEditorTab('content'); // Default to content
            setHasUnsavedChanges(false);

            // Load courses if needed for this page
            if (page.sections.some(s => s.type === 'course-list')) {
                setGlobalCourses(getCourses());
            }
        }
    };

    const handleBack = () => {
        if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Discard them?")) {
            return;
        }
        setSelectedPageId(null);
        setEditingPage(null);
        setHasUnsavedChanges(false);
    };

    const handleSavePage = () => {
        if (editingPage) {
            setIsSaving(true);
            setTimeout(() => {
                savePageContent(editingPage);

                // Also save modified courses if any section was a course-list
                if (editingPage.sections.some(s => s.type === 'course-list')) {
                    globalCourses.forEach(c => saveCourse(c));
                }

                setPages(getSitePages());
                setHasUnsavedChanges(false);
                setIsSaving(false);
            }, 800);
        }
    };

    const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        if (direction === 'up' && sectionIndex === 0) return;
        if (direction === 'down' && sectionIndex === newSections.length - 1) return;

        const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        const temp = newSections[sectionIndex];
        newSections[sectionIndex] = newSections[targetIndex];
        newSections[targetIndex] = temp;

        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const addSection = (type: 'hero' | 'content' | 'features' | 'cta' | 'team' | 'accordion') => {
        if (!editingPage) return;
        const sectionId = `${type}_${Date.now()}`;
        const newSection: PageSection = {
            id: sectionId,
            label: `${type.toUpperCase()} Section`,
            type: type,
            data: {
                heading: 'New Section Title',
                description: 'Description text for the section goes here.',
                ...(type === 'hero' || type === 'content' || type === 'cta' ? { buttonText: 'Learn More', buttonLink: '#' } : {}),
                ...(type === 'features' || type === 'team' || type === 'accordion' ? { items: [{ title: 'New Item', description: 'Item description text.' }] } : {}),
                ...(type === 'hero' || type === 'content' || type === 'team' ? { image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800' } : {})
            }
        };
        setEditingPage({
            ...editingPage,
            sections: [...editingPage.sections, newSection]
        });
        setHasUnsavedChanges(true);
    };

    const deleteSection = (sectionIndex: number) => {
        if (!editingPage) return;
        if (!window.confirm("Are you sure you want to delete this section?")) return;
        const newSections = editingPage.sections.filter((_, idx) => idx !== sectionIndex);
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const updateSectionData = (sectionIndex: number, field: string, value: any) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            data: { ...newSections[sectionIndex].data, [field]: value }
        };
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    // Update item inside section items array (for sliders, features list etc)
    const updateSectionItemData = (sectionIndex: number, itemIndex: number, field: string, value: any) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] }; // Shallow copy section
        section.data = { ...section.data }; // Shallow copy data

        if (section.data.items) {
            const newItems = [...section.data.items]; // Shallow copy items array
            newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }; // Copy item and update
            section.data.items = newItems;
            newSections[sectionIndex] = section;
            setEditingPage({ ...editingPage, sections: newSections });
            setHasUnsavedChanges(true);
        }
    };

    const addSectionItem = (sectionIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };

        const newItem = { title: 'New Item', description: 'Description here', image: '', icon: '' };
        section.data.items = [...(section.data.items || []), newItem];

        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };

        if (section.data.items) {
            section.data.items = section.data.items.filter((_, idx) => idx !== itemIndex);
            newSections[sectionIndex] = section;
            setEditingPage({ ...editingPage, sections: newSections });
            setHasUnsavedChanges(true);
        }
    };

    // Special handler for course list items
    const updateGlobalCourse = (courseId: string, field: keyof Course, value: any) => {
        const updatedCourses = globalCourses.map(c =>
            c.id === courseId ? { ...c, [field]: value } : c
        );
        setGlobalCourses(updatedCourses);
        setHasUnsavedChanges(true); // Mark page as dirty to trigger save button
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number, itemIndex?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (itemIndex !== undefined) {
                    updateSectionItemData(sectionIndex, itemIndex, 'image', base64);
                } else {
                    updateSectionData(sectionIndex, 'image', base64);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>, courseId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateGlobalCourse(courseId, 'image', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Theme Editor Handlers ---
    const handleSaveTheme = () => {
        saveThemeSettings(theme);
        setIsThemeSaved(true);
        setTimeout(() => setIsThemeSaved(false), 2000);
    };

    // --- Renders ---

    if (selectedPageId && editingPage) {
        return (
            <div className="fixed inset-0 z-40 bg-gray-100 dark:bg-gray-900 flex flex-col animate-fade-in">
                {/* Editor Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                                <FileText size={18} className="text-primary dark:text-blue-400" /> {editingPage.name}
                            </h2>
                            <p className="text-xs text-gray-400">Last updated: {new Date(editingPage.lastUpdated).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary dark:text-blue-400' : 'text-gray-400'}`}>
                                <Monitor size={18} />
                            </button>
                            <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary dark:text-blue-400' : 'text-gray-400'}`}>
                                <Smartphone size={18} />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>

                        <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="hidden md:flex dark:text-white dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                            {showPreview ? <><Eye size={18} className="mr-2" /> Hide Preview</> : <><Eye size={18} className="mr-2" /> Show Preview</>}
                        </Button>
                        <Button onClick={handleSavePage} disabled={!hasUnsavedChanges || isSaving} className="w-32">
                            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Editor Sidebar */}
                    <div className="w-full md:w-[450px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 custom-scrollbar">
                        <div className="p-6 space-y-8 pb-20">
                            {editingPage.sections.map((section, idx) => (
                                <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
                                    <div className="bg-gray-100/80 dark:bg-gray-700/80 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">{section.label}</span>
                                            <span className="text-[10px] bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded uppercase">{section.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => moveSection(idx, 'up')} 
                                                disabled={idx === 0} 
                                                className="p-1 hover:bg-gray-250 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400 disabled:opacity-30 transition-colors"
                                                title="Move Up"
                                            >
                                                <ArrowLeft size={14} className="rotate-90" />
                                            </button>
                                            <button 
                                                onClick={() => moveSection(idx, 'down')} 
                                                disabled={idx === editingPage.sections.length - 1} 
                                                className="p-1 hover:bg-gray-250 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400 disabled:opacity-30 transition-colors"
                                                title="Move Down"
                                            >
                                                <ArrowLeft size={14} className="-rotate-90" />
                                            </button>
                                            <button 
                                                onClick={() => deleteSection(idx)} 
                                                className="p-1 hover:bg-red-500 hover:text-white rounded text-red-500 transition-colors"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {/* SPECIAL HANDLING FOR COURSE LIST */}
                                        {section.type === 'course-list' ? (
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 mb-2">
                                                    <Info size={14} className="inline mr-1 mb-0.5" />
                                                    Editing courses here updates the global course catalog.
                                                </div>
                                                {globalCourses.map((course) => (
                                                    <div key={course.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                                                        <div className="flex items-center gap-2 mb-1 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                            {course.image && <img src={course.image} className="w-8 h-8 rounded object-cover" />}
                                                            <span className="font-bold text-xs text-gray-700 dark:text-gray-200 flex-1 truncate">{course.title}</span>
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                                                            <input
                                                                type="text"
                                                                id={`website-course-title-${course.id}`}
                                                                name="websiteCourseTitle"
                                                                autocomplete="off"
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                value={course.title}
                                                                onChange={(e) => updateGlobalCourse(course.id, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                                                                <input
                                                                    type="number"
                                                                    id={`website-course-price-${course.id}`}
                                                                    name="websiteCoursePrice"
                                                                    autocomplete="off"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                    value={course.price}
                                                                    onChange={(e) => updateGlobalCourse(course.id, 'price', Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-course-duration-${course.id}`}
                                                                    name="websiteCourseDuration"
                                                                    autocomplete="off"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                    value={course.duration}
                                                                    onChange={(e) => updateGlobalCourse(course.id, 'duration', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Image</label>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="text"
                                                                        id={`website-course-image-${course.id}`}
                                                                        name="websiteCourseImage"
                                                                        autocomplete="off"
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-xs font-mono text-gray-500 dark:text-gray-400 pr-8"
                                                                        value={course.image}
                                                                        onChange={(e) => updateGlobalCourse(course.id, 'image', e.target.value)}
                                                                    />
                                                                    <label className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-primary transition-colors">
                                                                        <UploadCloud size={12} />
                                                                        <input type="file" id={`website-course-file-${course.id}`} name="websiteCourseFile" autocomplete="off" className="hidden" accept="image/*" onChange={(e) => handleCourseImageUpload(e, course.id)} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                                                            <textarea
                                                                id={`website-course-desc-${course.id}`}
                                                                name="websiteCourseDescription"
                                                                autocomplete="off"
                                                                rows={2}
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-xs text-gray-900 dark:text-white"
                                                                value={course.shortDescription}
                                                                onChange={(e) => updateGlobalCourse(course.id, 'shortDescription', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Common Fields */}
                                                {section.data.heading !== undefined && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Heading</label>
                                                        <input
                                                            type="text"
                                                            id={`website-heading-${idx}`}
                                                            name="sectionHeading"
                                                            autocomplete="off"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.heading}
                                                            onChange={(e) => updateSectionData(idx, 'heading', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.subheading !== undefined && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Subheading</label>
                                                        <input
                                                            type="text"
                                                            id={`website-subheading-${idx}`}
                                                            name="sectionSubheading"
                                                            autocomplete="off"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.subheading}
                                                            onChange={(e) => updateSectionData(idx, 'subheading', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.description !== undefined && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                                        <textarea
                                                            id={`website-description-${idx}`}
                                                            name="sectionDescription"
                                                            autocomplete="off"
                                                            rows={3}
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.description}
                                                            onChange={(e) => updateSectionData(idx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.image !== undefined && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Image</label>
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                id={`website-image-${idx}`}
                                                                name="sectionImage"
                                                                autocomplete="off"
                                                                placeholder="Image URL"
                                                                className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                                value={section.data.image}
                                                                onChange={(e) => updateSectionData(idx, 'image', e.target.value)}
                                                            />
                                                            <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded-lg px-3 flex items-center justify-center transition-colors" title="Upload from device">
                                                                <UploadCloud size={18} />
                                                                <input type="file" id={`website-image-file-${idx}`} name="sectionImageFile" autocomplete="off" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} />
                                                            </label>
                                                        </div>
                                                        {section.data.image && (
                                                            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden group/img">
                                                                <img src={section.data.image} alt="Preview" className="w-full h-full object-cover" />
                                                                <button
                                                                    onClick={() => updateSectionData(idx, 'image', '')}
                                                                    className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md hover:bg-red-50"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Button Fields */}
                                                {(section.data.buttonText !== undefined || section.data.buttonLink !== undefined) && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {section.data.buttonText !== undefined && (
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-btn-text-${idx}`}
                                                                    name="sectionButtonText"
                                                                    autocomplete="off"
                                                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                    value={section.data.buttonText}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonText', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        {section.data.buttonLink !== undefined && (
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Button Link</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-btn-link-${idx}`}
                                                                    name="sectionButtonLink"
                                                                    autocomplete="off"
                                                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                    value={section.data.buttonLink}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonLink', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Array Items (Slides, Features, etc) */}
                                                {section.data.items && (
                                                    <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Items ({section.data.items.length})</label>
                                                            <button onClick={() => addSectionItem(idx)} className="text-xs flex items-center gap-1 text-primary dark:text-blue-400 hover:underline font-bold">
                                                                <Plus size={12} /> Add Item
                                                            </button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {section.data.items.map((item, itemIdx) => (
                                                                <div key={itemIdx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm space-y-2 relative group">
                                                                    <button onClick={() => removeSectionItem(idx, itemIdx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="text"
                                                                        id={`website-item-title-${idx}-${itemIdx}`}
                                                                        name="sectionItemTitle"
                                                                        autocomplete="off"
                                                                        placeholder="Title"
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm font-bold mb-1"
                                                                        value={item.title}
                                                                        onChange={(e) => updateSectionItemData(idx, itemIdx, 'title', e.target.value)}
                                                                    />
                                                                    <textarea
                                                                        id={`website-item-desc-${idx}-${itemIdx}`}
                                                                        name="sectionItemDescription"
                                                                        autocomplete="off"
                                                                        rows={2}
                                                                        placeholder="Description"
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs"
                                                                        value={item.description}
                                                                        onChange={(e) => updateSectionItemData(idx, itemIdx, 'description', e.target.value)}
                                                                    />
                                                                    {/* Optional Image for Item */}
                                                                    {item.image !== undefined && (
                                                                        <div className="flex gap-2 items-center">
                                                                            <div className="flex-1 relative">
                                                                                <input
                                                                                    type="text"
                                                                                    id={`website-item-image-${idx}-${itemIdx}`}
                                                                                    name="sectionItemImage"
                                                                                    autocomplete="off"
                                                                                    placeholder="Item Image URL"
                                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono text-gray-500 dark:text-gray-400 pr-8"
                                                                                    value={item.image}
                                                                                    onChange={(e) => updateSectionItemData(idx, itemIdx, 'image', e.target.value)}
                                                                                />
                                                                                <label className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-primary transition-colors">
                                                                                    <UploadCloud size={12} />
                                                                                    <input type="file" id={`website-item-file-${idx}-${itemIdx}`} name="sectionItemFile" autocomplete="off" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx, itemIdx)} />
                                                                                </label>
                                                                            </div>
                                                                            {item.image && (
                                                                                <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden shrink-0 relative group/thumb">
                                                                                    <img src={item.image} alt="Thumb" className="w-full h-full object-cover" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {/* Optional Icon for Item */}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Icon:</span>
                                                                        <input
                                                                            type="text"
                                                                            id={`website-item-icon-${idx}-${itemIdx}`}
                                                                            name="sectionItemIcon"
                                                                            autocomplete="off"
                                                                            placeholder="e.g. CheckCircle, User, Star"
                                                                            className="flex-1 p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono text-gray-500 dark:text-gray-400"
                                                                            value={item.icon || ''}
                                                                            onChange={(e) => updateSectionItemData(idx, itemIdx, 'icon', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Btn Text</label>
                                                                            <input
                                                                                type="text"
                                                                                id={`website-item-btn-text-${idx}-${itemIdx}`}
                                                                                name="sectionItemButtonText"
                                                                                autocomplete="off"
                                                                                placeholder="Button Text"
                                                                                className="w-full p-1 border border-gray-205 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                value={item.buttonText || ''}
                                                                                onChange={(e) => updateSectionItemData(idx, itemIdx, 'buttonText', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Btn Link</label>
                                                                            <input
                                                                                type="text"
                                                                                id={`website-item-btn-link-${idx}-${itemIdx}`}
                                                                                name="sectionItemButtonLink"
                                                                                autocomplete="off"
                                                                                placeholder="Button Link"
                                                                                className="w-full p-1 border border-gray-205 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                value={item.buttonLink || ''}
                                                                                onChange={(e) => updateSectionItemData(idx, itemIdx, 'buttonLink', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Section Controls */}
                            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/10 text-center space-y-3">
                                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Add New Content Section</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['hero', 'content', 'features', 'cta', 'team', 'accordion'] as const).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => addSection(type)}
                                            className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:shadow transition-all"
                                        >
                                            + {type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    {showPreview && (
                        <div className="flex-1 bg-gray-200 dark:bg-gray-900 overflow-hidden flex items-center justify-center p-8">
                            <div
                                className={`bg-white shadow-2xl transition-all duration-300 overflow-y-auto overflow-x-hidden ${previewDevice === 'mobile'
                                    ? 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800'
                                    : 'w-full h-full rounded-xl border border-gray-300'
                                    }`}
                            >
                                <div className={previewDevice === 'mobile' ? 'scale-90 origin-top' : ''}>
                                    {editingPage.sections.map((section, idx) => (
                                        <SectionRenderer key={idx} section={section} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <div>
                <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Website Manager</h2>
                <p className="text-gray-500 dark:text-gray-400">Edit content, manage pages, and configure site themes.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Global Settings</h4>
                            <button
                                onClick={() => setActiveTab('theme')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'theme' ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Palette size={18} /> Global Theme
                            </button>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Edit Pages</h4>
                            <div className="space-y-1">
                                {pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handleSelectPage(page.id)}
                                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Layout size={18} className="text-gray-400" />
                                            <div className="flex flex-col">
                                                <span>{page.name}</span>
                                                <span className="text-[10px] text-gray-400 font-normal">{page.sections.length} editable sections</span>
                                            </div>
                                        </div>
                                        <Edit2 size={14} className="text-gray-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Area */}
                <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                    {activeTab === 'theme' ? (
                        <div className="w-full max-w-2xl animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-secondary dark:text-white">Global Theme</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Manage brand colors and typography.</p>
                                </div>
                                <Button onClick={handleSaveTheme} disabled={isThemeSaved}>
                                    {isThemeSaved ? <span className="flex items-center gap-2"><Check size={18} /> Saved</span> : 'Save Theme'}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-primary-color" name="themePrimaryColor" autocomplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorPrimary} onChange={e => setTheme({ ...theme, colorPrimary: e.target.value })} />
                                            <input type="text" id="website-primary-hex" name="themePrimaryHex" autocomplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorPrimary} onChange={e => setTheme({ ...theme, colorPrimary: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-secondary-color" name="themeSecondaryColor" autocomplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorSecondary} onChange={e => setTheme({ ...theme, colorSecondary: e.target.value })} />
                                            <input type="text" id="website-secondary-hex" name="themeSecondaryHex" autocomplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorSecondary} onChange={e => setTheme({ ...theme, colorSecondary: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-accent-color" name="themeAccentColor" autocomplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorAccent} onChange={e => setTheme({ ...theme, colorAccent: e.target.value })} />
                                            <input type="text" id="website-accent-hex" name="themeAccentHex" autocomplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorAccent} onChange={e => setTheme({ ...theme, colorAccent: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Border Radius (px)</label>
                                        <input type="number" id="website-border-radius" name="themeBorderRadius" autocomplete="off" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2" value={theme.borderRadius} onChange={e => setTheme({ ...theme, borderRadius: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Globe size={64} className="mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Select a Page to Edit</h3>
                            <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400">Choose a page from the sidebar to update its content, images, and layout in real-time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
