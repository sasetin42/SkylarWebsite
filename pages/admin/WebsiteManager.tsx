
import React, { useState, useEffect } from 'react';
import {
    Layout, Edit2, Save, Globe, Image as ImageIcon,
    Type, Check, ArrowLeft, Eye, Smartphone, Monitor,
    Info, Home, Palette, RefreshCcw, PaintBucket, Sliders,
    FileText, Plus, Trash2, X, DollarSign, Clock, Star, UploadCloud, Upload,
    MapPin, Zap, ShieldCheck, CheckCircle, Award, ArrowRight
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getSitePages, savePageContent, getPageContent, getThemeSettings, saveThemeSettings, getCourses, saveCourse, saveCourses, getLocations, saveLocations, syncToFirebase, realignAllPagesWithFrontendMaster } from '../../services/storageService';
import { firebaseClient } from '../../services/firebaseClient';
import { SitePage, ThemeSettings, PageSection, Course, Location } from '../../types';
import { SectionRenderer } from '../../components/SectionRenderer';

export const WebsiteManager: React.FC = () => {
    const [pages, setPages] = useState<SitePage[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'theme'>('all');
    const [isRealigning, setIsRealigning] = useState(false);

    // Editor State (Pages)
    const [editingPage, setEditingPage] = useState<SitePage | null>(null);
    const [activePageEditorTab, setActivePageEditorTab] = useState<'content' | 'style'>('content');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState<string>('');
    const [showSavedToast, setShowSavedToast] = useState(false);

    // Editor State (Courses & Locations)
    const [globalCourses, setGlobalCourses] = useState<Course[]>([]);
    const [globalLocations, setGlobalLocations] = useState<Location[]>([]);

    // Editor State (Theme)
    const [theme, setTheme] = useState<ThemeSettings>(getThemeSettings());
    const [isThemeSaved, setIsThemeSaved] = useState(false);

    const selectedPageIdRef = React.useRef(selectedPageId);
    selectedPageIdRef.current = selectedPageId;
    const hasUnsavedChangesRef = React.useRef(hasUnsavedChanges);
    hasUnsavedChangesRef.current = hasUnsavedChanges;

    useEffect(() => {
        const updateLocalPages = () => {
            const updated = getSitePages();
            setPages(updated);
            const curId = selectedPageIdRef.current;
            const isDirty = hasUnsavedChangesRef.current;
            if (curId) {
                const refreshed = updated.find(p => p.id === curId);
                if (refreshed && !isDirty) {
                    setEditingPage(JSON.parse(JSON.stringify(refreshed)));
                }
            }
        };

        updateLocalPages();
        window.addEventListener('sitePagesUpdated', updateLocalPages);
        return () => window.removeEventListener('sitePagesUpdated', updateLocalPages);
    }, []);

    // Keyboard shortcut Ctrl+S / Cmd+S for instant saving
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (selectedPageId && !isSaving) {
                    handleSavePage();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPageId, editingPage, globalCourses, globalLocations, isSaving]);

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

            // Load locations if needed for this page
            if (id === 'locations' || page.sections.some(s => s.type === 'locations-list')) {
                setGlobalLocations(getLocations());
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

    const handleSavePage = async () => {
        if (editingPage) {
            setIsSaving(true);
            try {
                const saved = await savePageContent(editingPage);

                // Also save modified courses if any section was a course-list
                if (editingPage.sections.some(s => s.type === 'course-list')) {
                    await saveCourses(globalCourses);
                }

                // Also save modified locations if editing locations page or locations-list
                if (editingPage.id === 'locations' || editingPage.sections.some(s => s.type === 'locations-list')) {
                    await saveLocations(globalLocations);
                }

                const updated = getSitePages();
                setPages(updated);
                if (saved) {
                    setEditingPage(JSON.parse(JSON.stringify(saved)));
                } else {
                    const refreshed = updated.find(p => p.id === editingPage.id);
                    if (refreshed) {
                        setEditingPage(JSON.parse(JSON.stringify(refreshed)));
                    }
                }
                setHasUnsavedChanges(false);
                setIsSaved(true);
                setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                setShowSavedToast(true);
                setTimeout(() => setIsSaved(false), 2500);
                setTimeout(() => setShowSavedToast(false), 4000);
            } catch (err) {
                console.error("Save info:", err);
                setIsSaved(true);
                setShowSavedToast(true);
                setTimeout(() => setIsSaved(false), 2500);
                setTimeout(() => setShowSavedToast(false), 4000);
            } finally {
                setIsSaving(false);
            }
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

    const addSection = (type: 'hero' | 'content' | 'features' | 'cta' | 'team' | 'accordion' | 'training-programs' | 'locations-list' | 'contact-form') => {
        if (!editingPage) return;
        const sectionId = `${type}_${Date.now()}`;
        if (type === 'locations-list' && globalLocations.length === 0) {
            setGlobalLocations(getLocations());
        }
        const newSection: PageSection = {
            id: sectionId,
            label: type === 'training-programs' ? 'Explore Training Programs' : type === 'locations-list' ? 'Campus Locations' : type === 'contact-form' ? 'Contact Form & Facility Showcase' : `${type.toUpperCase()} Section`,
            type: type,
            data: {
                heading: type === 'training-programs' ? 'Explore Our Training Programs' : type === 'locations-list' ? 'Our Campuses' : type === 'contact-form' ? 'Contact Us' : 'New Section Title',
                subheading: type === 'training-programs' ? 'SPECIALIZED PATHWAYS' : type === 'locations-list' ? 'Training Facilities' : type === 'contact-form' ? 'Ready to get started? Fill out the form below.' : undefined,
                description: type === 'training-programs' || type === 'locations-list' || type === 'contact-form' ? undefined : 'Description text for the section goes here.',
                ...(type === 'hero' || type === 'content' || type === 'cta' ? { buttonText: 'Learn More', buttonLink: '#' } : {}),
                ...(type === 'contact-form' ? {
                    heading: 'Contact Us',
                    subheading: 'Ready to get started? Fill out the form below.',
                    buttonText: 'SEND MESSAGE',
                    slides: [
                        {
                            badge: 'PRACTICAL TRAINING',
                            tag: 'REAL-WORLD PRACTICE',
                            title: 'Hands-On Wind & Height Safety Simulation',
                            location: 'Certified Training Towers & Height Systems',
                            image: '/contact-climbing-training.jpg',
                            fallback: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200'
                        },
                        {
                            badge: 'GWO CERTIFIED EQUIPMENT',
                            tag: 'STANDARDS COMPLIANT',
                            title: 'Modern Safety Equipment & Gear Training Facility',
                            location: 'Skylar Education Asia Accredited Campus',
                            image: '/contact-facility-gear.jpg',
                            fallback: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1200'
                        }
                    ],
                    items: [
                        {
                            badge: 'PRACTICAL TRAINING',
                            tag: 'REAL-WORLD PRACTICE',
                            title: 'Hands-On Wind & Height Safety Simulation',
                            location: 'Certified Training Towers & Height Systems',
                            image: '/contact-climbing-training.jpg',
                            fallback: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200'
                        },
                        {
                            badge: 'GWO CERTIFIED EQUIPMENT',
                            tag: 'STANDARDS COMPLIANT',
                            title: 'Modern Safety Equipment & Gear Training Facility',
                            location: 'Skylar Education Asia Accredited Campus',
                            image: '/contact-facility-gear.jpg',
                            fallback: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1200'
                        }
                    ]
                } : {}),
                ...(type === 'features' || type === 'team' || type === 'accordion' ? { items: [{ title: 'New Item', description: 'Item description text.' }] } : {}),
                ...(type === 'training-programs' ? {
                    subheading: 'SPECIALIZED PATHWAY',
                    heading: 'Global Wind Organisation Training',
                    image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1200',
                    badge1: '★ Certified Standard',
                    badge2: 'Global Wind Organisation',
                    programTag: 'INTERNATIONALLY ACCREDITED PROGRAM',
                    programTitle: 'Global Wind Organisation (GWO)',
                    description: 'SKYLAR EDUCATION ASIA delivers comprehensive, internationally certified GWO safety and technical training programs designed for wind energy technicians, engineers, and site personnel. All modules meet strict Global Wind Organisation standards and are recorded in the WINDA global registry.',
                    validityLabel: 'CERTIFICATION VALIDITY',
                    validityText: '24-Month International Accreditation',
                    secondaryButtonText: 'GWO Benefits',
                    secondaryButtonLink: '/about/gwo-benefits',
                    buttonText: 'View GWO Courses',
                    buttonLink: '/courses?category=Global%20Wind%20Organisation',
                    modules: [
                        { title: 'Basic Safety Training (BST)', description: 'Working at Heights, First Aid, Manual Handling, Fire Awareness', icon: 'ShieldCheck', color: 'accent' },
                        { title: 'Advanced Rescue (ART)', description: 'Hub, Spinner, Nacelle, and Inside Blade Rescue Operations', icon: 'HardHat', color: 'blue' },
                        { title: 'Basic Technical Training (BTT)', description: 'Mechanical, Electrical, Hydraulic, and Bolt Torquing', icon: 'Zap', color: 'emerald' },
                        { title: 'WINDA Global Verification', description: 'Instant digital record verification for onshore & offshore sites', icon: 'Award', color: 'purple' }
                    ],
                    items: [
                        { title: 'Basic Safety Training (BST)', description: 'Working at Heights, First Aid, Manual Handling, Fire Awareness', icon: 'ShieldCheck', color: 'accent' },
                        { title: 'Advanced Rescue (ART)', description: 'Hub, Spinner, Nacelle, and Inside Blade Rescue Operations', icon: 'HardHat', color: 'blue' },
                        { title: 'Basic Technical Training (BTT)', description: 'Mechanical, Electrical, Hydraulic, and Bolt Torquing', icon: 'Zap', color: 'emerald' },
                        { title: 'WINDA Global Verification', description: 'Instant digital record verification for onshore & offshore sites', icon: 'Award', color: 'purple' }
                    ]
                } : {}),
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

    // Special handlers for Training Programs modules
    const updateTrainingModule = (sectionIndex: number, moduleIndex: number, field: string, value: any) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentModules = section.data.modules || section.data.items || [];
        const newModules = [...currentModules];
        newModules[moduleIndex] = { ...newModules[moduleIndex], [field]: value };
        section.data.modules = newModules;
        section.data.items = newModules; // Keep both in sync for compatibility
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const addTrainingModule = (sectionIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentModules = section.data.modules || section.data.items || [];
        const newMod = { title: 'New Training Module', description: 'Module description and key components', icon: 'ShieldCheck', color: 'accent' };
        const newModules = [...currentModules, newMod];
        section.data.modules = newModules;
        section.data.items = newModules;
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const removeTrainingModule = (sectionIndex: number, moduleIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentModules = section.data.modules || section.data.items || [];
        const newModules = currentModules.filter((_, idx) => idx !== moduleIndex);
        section.data.modules = newModules;
        section.data.items = newModules;
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    // Special handlers for Contact Form facility slides
    const updateContactSlide = (sectionIndex: number, slideIndex: number, field: string, value: any) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentSlides = section.data.slides || section.data.items || [];
        const newSlides = [...currentSlides];
        newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value };
        section.data.slides = newSlides;
        section.data.items = newSlides;
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const addContactSlide = (sectionIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentSlides = section.data.slides || section.data.items || [];
        const newSlide = {
            badge: 'PRACTICAL TRAINING',
            tag: 'FACILITY HIGHLIGHT',
            title: 'Hands-On Wind Simulation',
            location: 'Skylar Education Asia Accredited Campus',
            image: '/contact-climbing-training.jpg',
            fallback: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200'
        };
        const newSlides = [...currentSlides, newSlide];
        section.data.slides = newSlides;
        section.data.items = newSlides;
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const removeContactSlide = (sectionIndex: number, slideIndex: number) => {
        if (!editingPage) return;
        const newSections = [...editingPage.sections];
        const section = { ...newSections[sectionIndex] };
        section.data = { ...section.data };
        const currentSlides = section.data.slides || section.data.items || [];
        const newSlides = currentSlides.filter((_, idx) => idx !== slideIndex);
        section.data.slides = newSlides;
        section.data.items = newSlides;
        newSections[sectionIndex] = section;
        setEditingPage({ ...editingPage, sections: newSections });
        setHasUnsavedChanges(true);
    };

    // Special handler for course list items
    const updateGlobalCourse = (courseId: string, field: keyof Course, value: any) => {
        const updatedCourses = globalCourses.map(c =>
            c.id === courseId ? { ...c, [field]: value } : c
        );
        setGlobalCourses(updatedCourses);
        setHasUnsavedChanges(true); // Mark page as dirty to trigger save button
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number, itemIndex?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                alert("File is too large. Max 15MB.");
                e.target.value = '';
                return;
            }
            setIsUploading(true);
            try {
                const mediaData = await firebaseClient.uploadMedia(file, 'website-content');
                if (itemIndex !== undefined) {
                    updateSectionItemData(sectionIndex, itemIndex, 'image', mediaData);
                } else {
                    updateSectionData(sectionIndex, 'image', mediaData);
                }
            } catch (err) {
                try {
                    const compressed = await firebaseClient.compressToDataUrl(file, 960, 960, 0.7);
                    if (itemIndex !== undefined) {
                        updateSectionItemData(sectionIndex, itemIndex, 'image', compressed);
                    } else {
                        updateSectionData(sectionIndex, 'image', compressed);
                    }
                } catch (fallbackErr) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        if (itemIndex !== undefined) {
                            updateSectionItemData(sectionIndex, itemIndex, 'image', base64);
                        } else {
                            updateSectionData(sectionIndex, 'image', base64);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } finally {
                setIsUploading(false);
                e.target.value = ''; // Reset input to allow re-uploading same file
            }
        }
    };

    const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, courseId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const mediaData = await firebaseClient.uploadMedia(file, 'course-images');
                updateGlobalCourse(courseId, 'image', mediaData);
            } catch (err) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    updateGlobalCourse(courseId, 'image', base64);
                };
                reader.readAsDataURL(file);
            } finally {
                setIsUploading(false);
                e.target.value = ''; // Reset input
            }
        }
    };

    // Special handlers for campus locations
    const updateGlobalLocation = (locId: string, field: keyof Location, value: any) => {
        const updated = globalLocations.map(l =>
            l.id === locId ? { ...l, [field]: value } : l
        );
        setGlobalLocations(updated);
        setHasUnsavedChanges(true);
    };

    const handleLocationImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, locId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                alert("File is too large. Max 15MB.");
                e.target.value = '';
                return;
            }
            setIsUploading(true);
            try {
                const mediaData = await firebaseClient.uploadMedia(file, 'location-images');
                updateGlobalLocation(locId, 'image', mediaData);
            } catch (err) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    updateGlobalLocation(locId, 'image', base64);
                };
                reader.readAsDataURL(file);
            } finally {
                setIsUploading(false);
                e.target.value = '';
            }
        }
    };

    const handleAddLocation = () => {
        const newId = `loc-${Date.now()}`;
        const newLocation: Location = {
            id: newId,
            name: 'New Campus Location',
            address: 'Campus Address, City, Province, Philippines',
            phone: '+63 000 000 0000',
            email: 'info@skylarasia.com',
            image: '/angeles-training-centre.jpg',
            coordinates: { lat: 15.14, lng: 120.59 },
            state: 'Pampanga',
            badge: '📍 Training Facility'
        };
        setGlobalLocations([...globalLocations, newLocation]);
        setHasUnsavedChanges(true);
    };

    const handleDeleteLocation = (locId: string) => {
        if (!window.confirm("Are you sure you want to delete this campus location?")) return;
        setGlobalLocations(globalLocations.filter(l => l.id !== locId));
        setHasUnsavedChanges(true);
    };

    // --- Master Realign Handler ---
    const handleRealignAllPages = async () => {
        if (!window.confirm("This will synchronize and realign all Website Content pages with the latest master frontend structure and update Cloud Firestore. Proceed?")) {
            return;
        }
        setIsRealigning(true);
        try {
            const aligned = await realignAllPagesWithFrontendMaster();
            setPages(aligned);
            if (selectedPageId) {
                const refreshed = aligned.find(p => p.id === selectedPageId);
                if (refreshed) {
                    setEditingPage(JSON.parse(JSON.stringify(refreshed)));
                }
            }
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 4000);
        } catch (err) {
            console.error("Realign error:", err);
        } finally {
            setIsRealigning(false);
        }
    };

    // --- Theme Editor Handlers ---
    const handleSaveTheme = async () => {
        setIsSaving(true);
        try {
            await saveThemeSettings(theme);
            setIsThemeSaved(true);
            setShowSavedToast(true);
            setTimeout(() => {
                setIsThemeSaved(false);
                setShowSavedToast(false);
            }, 3500);
        } catch (err) {
            console.error("Theme save error:", err);
        } finally {
            setIsSaving(false);
        }
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
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400">
                                    Last updated: {lastSavedTime ? `Today at ${lastSavedTime}` : new Date(editingPage.lastUpdated).toLocaleDateString()}
                                </p>
                                <span className="inline-flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Firebase Realtime Live
                                </span>
                            </div>
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

                        <Button 
                            onClick={handleSavePage} 
                            disabled={isSaving} 
                            className={`min-w-[145px] transition-all font-bold shadow-md cursor-pointer ${
                                isSaved
                                    ? '!bg-emerald-600 hover:!bg-emerald-700 !text-white ring-2 ring-emerald-400 ring-offset-2 shadow-emerald-500/20'
                                    : isSaving
                                    ? '!bg-amber-500 !text-slate-950 opacity-90'
                                    : hasUnsavedChanges
                                    ? '!bg-amber-500 hover:!bg-amber-600 !text-slate-950 ring-2 ring-amber-400/50 animate-pulse'
                                    : '!bg-amber-500 hover:!bg-amber-600 !text-slate-950'
                            }`}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-1.5">
                                    <RefreshCcw size={16} className="animate-spin" /> Saving...
                                </span>
                            ) : isSaved ? (
                                <span className="flex items-center gap-1.5 text-white">
                                    <Check size={16} className="stroke-[3]" /> Saved Live!
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Save size={16} /> Save Page
                                </span>
                            )}
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
                                                            <label htmlFor={`website-course-title-${course.id}`} className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                                                            <input
                                                                type="text"
                                                                id={`website-course-title-${course.id}`}
                                                                name="websiteCourseTitle"
                                                                autoComplete="off"
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                value={course.title}
                                                                onChange={(e) => updateGlobalCourse(course.id, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label htmlFor={`website-course-price-${course.id}`} className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                                                                <input
                                                                    type="number"
                                                                    id={`website-course-price-${course.id}`}
                                                                    name="websiteCoursePrice"
                                                                    autoComplete="off"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                    value={course.price}
                                                                    onChange={(e) => updateGlobalCourse(course.id, 'price', Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`website-course-duration-${course.id}`} className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-course-duration-${course.id}`}
                                                                    name="websiteCourseDuration"
                                                                    autoComplete="off"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white"
                                                                    value={course.duration}
                                                                    onChange={(e) => updateGlobalCourse(course.id, 'duration', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-course-image-${course.id}`} className="text-[10px] font-bold text-gray-400 uppercase">Image</label>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="text"
                                                                        id={`website-course-image-${course.id}`}
                                                                        name="websiteCourseImage"
                                                                        autoComplete="off"
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-xs font-mono text-gray-500 dark:text-gray-400 pr-8"
                                                                        value={course.image}
                                                                        onChange={(e) => updateGlobalCourse(course.id, 'image', e.target.value)}
                                                                    />
                                                                    <label className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-primary transition-colors">
                                                                        <UploadCloud size={12} />
                                                                        <input type="file" id={`website-course-file-${course.id}`} name="websiteCourseFile" autoComplete="off" className="hidden" accept="image/*" onChange={(e) => handleCourseImageUpload(e, course.id)} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-course-desc-${course.id}`} className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                                                            <textarea
                                                                id={`website-course-desc-${course.id}`}
                                                                name="websiteCourseDescription"
                                                                autoComplete="off"
                                                                rows={2}
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded text-xs text-gray-900 dark:text-white"
                                                                value={course.shortDescription}
                                                                onChange={(e) => updateGlobalCourse(course.id, 'shortDescription', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : section.type === 'locations-list' ? (
                                            <div className="space-y-4">
                                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-xs text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Info size={14} className="shrink-0" />
                                                        <span>Manage & edit training campuses and facilities.</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddLocation}
                                                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-md transition-colors flex items-center gap-1 shadow-sm shrink-0"
                                                    >
                                                        <Plus size={12} /> Add Campus
                                                    </button>
                                                </div>

                                                {globalLocations.map((loc) => (
                                                    <div key={loc.id} className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                                                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2.5">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                {loc.image && (
                                                                    <img src={loc.image} alt={loc.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200 dark:border-gray-600 shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = '/angeles-training-centre.jpg'; }} />
                                                                )}
                                                                <div className="min-w-0">
                                                                    <span className="font-bold text-xs text-gray-800 dark:text-gray-200 block truncate">{loc.name || 'Untitled Campus'}</span>
                                                                    <span className="text-[10px] text-gray-400 font-mono">ID: {loc.id}</span>
                                                                </div>
                                                            </div>
                                                            {globalLocations.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteLocation(loc.id)}
                                                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 rounded-lg transition-colors"
                                                                    title="Delete Location"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Campus Name */}
                                                        <div>
                                                            <label htmlFor={`loc-name-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Campus / Facility Name</label>
                                                            <input
                                                                type="text"
                                                                id={`loc-name-${loc.id}`}
                                                                name={`locName-${loc.id}`}
                                                                autoComplete="off"
                                                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white"
                                                                value={loc.name}
                                                                onChange={(e) => updateGlobalLocation(loc.id, 'name', e.target.value)}
                                                            />
                                                        </div>

                                                        {/* Badge & Province */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label htmlFor={`loc-badge-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Badge Tag</label>
                                                                <input
                                                                    type="text"
                                                                    id={`loc-badge-${loc.id}`}
                                                                    name={`locBadge-${loc.id}`}
                                                                    autoComplete="off"
                                                                    placeholder="e.g. 📍 Training Centre"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.badge || ''}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'badge', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`loc-state-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Province / City</label>
                                                                <input
                                                                    type="text"
                                                                    id={`loc-state-${loc.id}`}
                                                                    name={`locState-${loc.id}`}
                                                                    autoComplete="off"
                                                                    placeholder="e.g. Pampanga"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.state}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'state', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Full Address */}
                                                        <div>
                                                            <label htmlFor={`loc-address-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Physical Address</label>
                                                            <textarea
                                                                id={`loc-address-${loc.id}`}
                                                                name={`locAddress-${loc.id}`}
                                                                autoComplete="off"
                                                                rows={2}
                                                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                value={loc.address}
                                                                onChange={(e) => updateGlobalLocation(loc.id, 'address', e.target.value)}
                                                            />
                                                        </div>

                                                        {/* Google Maps Link */}
                                                        <div>
                                                            <label htmlFor={`loc-map-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Google Maps Direct URL (Optional)</label>
                                                            <input
                                                                type="text"
                                                                id={`loc-map-${loc.id}`}
                                                                name={`locMap-${loc.id}`}
                                                                autoComplete="off"
                                                                placeholder="https://maps.google.com/..."
                                                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                value={loc.googleMapsUrl || ''}
                                                                onChange={(e) => updateGlobalLocation(loc.id, 'googleMapsUrl', e.target.value)}
                                                            />
                                                        </div>

                                                        {/* Phone & Email */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label htmlFor={`loc-phone-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone Number(s)</label>
                                                                <input
                                                                    type="text"
                                                                    id={`loc-phone-${loc.id}`}
                                                                    name={`locPhone-${loc.id}`}
                                                                    autoComplete="off"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.phone}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'phone', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`loc-email-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email Address(es)</label>
                                                                <input
                                                                    type="text"
                                                                    id={`loc-email-${loc.id}`}
                                                                    name={`locEmail-${loc.id}`}
                                                                    autoComplete="off"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.email}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'email', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Image Cover & Upload */}
                                                        <div>
                                                            <label htmlFor={`loc-image-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Campus Image / Cover</label>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="text"
                                                                        id={`loc-image-${loc.id}`}
                                                                        name={`locImage-${loc.id}`}
                                                                        autoComplete="off"
                                                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400 pr-8"
                                                                        value={loc.image}
                                                                        onChange={(e) => updateGlobalLocation(loc.id, 'image', e.target.value)}
                                                                    />
                                                                    <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-primary transition-colors">
                                                                        <UploadCloud size={14} />
                                                                        <input type="file" id={`loc-file-${loc.id}`} name={`locFile-${loc.id}`} autoComplete="off" className="hidden" accept="image/*" onChange={(e) => handleLocationImageUpload(e, loc.id)} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Coordinates (Lat, Lng) */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label htmlFor={`loc-lat-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Latitude</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.0001"
                                                                    id={`loc-lat-${loc.id}`}
                                                                    name={`locLat-${loc.id}`}
                                                                    autoComplete="off"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.coordinates?.lat ?? 15.14}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'coordinates', { ...(loc.coordinates || {}), lat: parseFloat(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`loc-lng-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Longitude</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.0001"
                                                                    id={`loc-lng-${loc.id}`}
                                                                    name={`locLng-${loc.id}`}
                                                                    autoComplete="off"
                                                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                    value={loc.coordinates?.lng ?? 120.59}
                                                                    onChange={(e) => updateGlobalLocation(loc.id, 'coordinates', { ...(loc.coordinates || {}), lng: parseFloat(e.target.value) || 0 })}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* About Campus Description */}
                                                        <div>
                                                            <label htmlFor={`loc-desc-${loc.id}`} className="text-[10px] font-bold text-gray-400 uppercase block mb-1">About Campus Description</label>
                                                            <textarea
                                                                id={`loc-desc-${loc.id}`}
                                                                name={`locDesc-${loc.id}`}
                                                                autoComplete="off"
                                                                rows={3}
                                                                placeholder="Detailed campus description for the location detail page..."
                                                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                value={loc.aboutDescription || ''}
                                                                onChange={(e) => updateGlobalLocation(loc.id, 'aboutDescription', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (section.type === 'training-programs' || section.id === 'training_programs') ? (
                                            <div className="space-y-6">
                                                {/* Notice / Guide */}
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
                                                    <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <span className="font-bold block text-sm">Explore Training Programs & GWO Blueprint Showcase</span>
                                                        <p className="text-blue-700 dark:text-blue-300">
                                                            This section configures the full-width Global Wind Organisation (GWO) featured showcase on the Home Page, including header labels, side banner image, floating badges, module cards (BST, ART, BTT, WINDA), accreditation validity, and direct course action buttons.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 1. SECTION HEADERS */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                        <FileText size={14} className="text-primary" />
                                                        Section Header & Pathway Title
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label htmlFor={`website-tp-subheading-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Top Subheading Tag</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-subheading-${idx}`}
                                                                name="sectionSubheading"
                                                                autoComplete="off"
                                                                placeholder="e.g. SPECIALIZED PATHWAY"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20"
                                                                value={section.data.subheading ?? 'SPECIALIZED PATHWAY'}
                                                                onChange={(e) => updateSectionData(idx, 'subheading', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-tp-heading-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Main Section Heading</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-heading-${idx}`}
                                                                name="sectionHeading"
                                                                autoComplete="off"
                                                                placeholder="e.g. Global Wind Organisation Training"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 font-bold"
                                                                value={section.data.heading ?? 'Global Wind Organisation Training'}
                                                                onChange={(e) => updateSectionData(idx, 'heading', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. SHOWCASE BANNER IMAGE & BADGES (LEFT COLUMN) */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                        <UploadCloud size={14} className="text-primary" />
                                                        Banner Visual & Floating Badges (Left Column)
                                                    </h4>
                                                    <div>
                                                        <label htmlFor={`website-tp-image-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Showcase Banner Image URL</label>
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                id={`website-tp-image-${idx}`}
                                                                name="sectionImage"
                                                                autoComplete="off"
                                                                placeholder="Image URL"
                                                                className="flex-1 p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 font-mono"
                                                                value={section.data.image || (section.data.items && section.data.items[0]?.image) || ''}
                                                                onChange={(e) => updateSectionData(idx, 'image', e.target.value)}
                                                            />
                                                            <label htmlFor={`website-tp-image-file-${idx}`} className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-lg px-3 flex items-center justify-center gap-1 text-xs font-bold transition-colors" title="Upload from device">
                                                                <UploadCloud size={16} /> Upload
                                                                <input type="file" id={`website-tp-image-file-${idx}`} name="sectionImageFile" autoComplete="off" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} />
                                                            </label>
                                                        </div>
                                                        {(section.data.image || (section.data.items && section.data.items[0]?.image)) && (
                                                            <div className="relative w-full h-36 bg-gray-900 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                                                                <img
                                                                    src={section.data.image || (section.data.items && section.data.items[0]?.image)}
                                                                    alt="Banner Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute top-2 left-2 flex gap-1.5">
                                                                    <span className="px-2 py-0.5 rounded-full bg-accent text-secondary text-[10px] font-black uppercase">{section.data.badge1 || "★ Certified Standard"}</span>
                                                                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold uppercase">{section.data.badge2 || "Global Wind Organisation"}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                                        <div>
                                                            <label htmlFor={`website-tp-badge1-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Floating Badge 1 (Accent)</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-badge1-${idx}`}
                                                                name="sectionBadge1"
                                                                autoComplete="off"
                                                                placeholder="e.g. ★ Certified Standard"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                value={section.data.badge1 ?? '★ Certified Standard'}
                                                                onChange={(e) => updateSectionData(idx, 'badge1', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-tp-badge2-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Floating Badge 2 (Dark)</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-badge2-${idx}`}
                                                                name="sectionBadge2"
                                                                autoComplete="off"
                                                                placeholder="e.g. Global Wind Organisation"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                value={section.data.badge2 ?? 'Global Wind Organisation'}
                                                                onChange={(e) => updateSectionData(idx, 'badge2', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. SHOWCASE MAIN CONTENT (RIGHT COLUMN) */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                        <Award size={14} className="text-primary" />
                                                        Showcase Header & Narrative Description (Right Column)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label htmlFor={`website-tp-programTag-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Program Tag / Subtitle</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-programTag-${idx}`}
                                                                name="sectionProgramTag"
                                                                autoComplete="off"
                                                                placeholder="e.g. INTERNATIONALLY ACCREDITED PROGRAM"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold text-amber-600 dark:text-amber-400"
                                                                value={section.data.programTag ?? 'INTERNATIONALLY ACCREDITED PROGRAM'}
                                                                onChange={(e) => updateSectionData(idx, 'programTag', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-tp-programTitle-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Showcase Title</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-programTitle-${idx}`}
                                                                name="sectionProgramTitle"
                                                                autoComplete="off"
                                                                placeholder="e.g. Global Wind Organisation (GWO)"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold"
                                                                value={section.data.programTitle ?? 'Global Wind Organisation (GWO)'}
                                                                onChange={(e) => updateSectionData(idx, 'programTitle', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`website-tp-description-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Main Narrative Description</label>
                                                        <textarea
                                                            id={`website-tp-description-${idx}`}
                                                            name="sectionDescription"
                                                            autoComplete="off"
                                                            rows={3}
                                                            placeholder="Comprehensive overview of GWO training programs..."
                                                            className="w-full p-2.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg leading-relaxed"
                                                            value={section.data.description ?? 'SKYLAR EDUCATION ASIA delivers comprehensive, internationally certified GWO safety and technical training programs designed for wind energy technicians, engineers, and site personnel. All modules meet strict Global Wind Organisation standards and are recorded in the WINDA global registry.'}
                                                            onChange={(e) => updateSectionData(idx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* 4. CORE TRAINING MODULES (4 CARDS GRID) */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                                <Zap size={14} className="text-primary" />
                                                                Core Training Modules / Grid Cards ({((section.data.modules || section.data.items || []).length)})
                                                            </h4>
                                                            <span className="text-[11px] text-gray-500 dark:text-gray-400">Featured modules displayed in the 2x2 blueprint grid.</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => addTrainingModule(idx)}
                                                            className="px-2.5 py-1.5 bg-primary hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                                                        >
                                                            <Plus size={14} /> Add Module Card
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {(section.data.modules || section.data.items || [
                                                            { title: 'Basic Safety Training (BST)', description: 'Working at Heights, First Aid, Manual Handling, Fire Awareness', icon: 'ShieldCheck', color: 'accent' },
                                                            { title: 'Advanced Rescue (ART)', description: 'Hub, Spinner, Nacelle, and Inside Blade Rescue Operations', icon: 'HardHat', color: 'blue' },
                                                            { title: 'Basic Technical Training (BTT)', description: 'Mechanical, Electrical, Hydraulic, and Bolt Torquing', icon: 'Zap', color: 'emerald' },
                                                            { title: 'WINDA Global Verification', description: 'Instant digital record verification for onshore & offshore sites', icon: 'Award', color: 'purple' }
                                                        ]).map((mod, mIdx) => (
                                                            <div key={mIdx} className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-2.5 relative group">
                                                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 font-bold text-[10px] flex items-center justify-center">
                                                                            {mIdx + 1}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Module Card #{mIdx + 1}</span>
                                                                    </div>
                                                                    {(section.data.modules || section.data.items || []).length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeTrainingModule(idx, mIdx)}
                                                                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                                                                            title="Delete Module"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Module Title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-bold"
                                                                        placeholder="e.g. Basic Safety Training (BST)"
                                                                        value={mod.title}
                                                                        onChange={(e) => updateTrainingModule(idx, mIdx, 'title', e.target.value)}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Module Components / Description</label>
                                                                    <textarea
                                                                        rows={2}
                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs"
                                                                        placeholder="e.g. Working at Heights, First Aid, Manual Handling, Fire Awareness"
                                                                        value={mod.description}
                                                                        onChange={(e) => updateTrainingModule(idx, mIdx, 'description', e.target.value)}
                                                                    />
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2 pt-1">
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Icon</label>
                                                                        <select
                                                                            className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs"
                                                                            value={mod.icon || 'ShieldCheck'}
                                                                            onChange={(e) => updateTrainingModule(idx, mIdx, 'icon', e.target.value)}
                                                                        >
                                                                            <option value="ShieldCheck">ShieldCheck</option>
                                                                            <option value="HardHat">HardHat</option>
                                                                            <option value="Zap">Zap</option>
                                                                            <option value="Award">Award</option>
                                                                            <option value="Fan">Fan</option>
                                                                            <option value="Users">Users</option>
                                                                            <option value="CheckCircle">CheckCircle</option>
                                                                            <option value="GraduationCap">GraduationCap</option>
                                                                            <option value="Target">Target</option>
                                                                            <option value="Globe">Globe</option>
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Color Theme</label>
                                                                        <select
                                                                            className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs"
                                                                            value={mod.color || (mIdx === 0 ? 'accent' : mIdx === 1 ? 'blue' : mIdx === 2 ? 'emerald' : 'purple')}
                                                                            onChange={(e) => updateTrainingModule(idx, mIdx, 'color', e.target.value)}
                                                                        >
                                                                            <option value="accent">Gold / Accent</option>
                                                                            <option value="blue">Blue</option>
                                                                            <option value="emerald">Emerald / Green</option>
                                                                            <option value="purple">Purple</option>
                                                                            <option value="amber">Amber</option>
                                                                            <option value="red">Red</option>
                                                                            <option value="cyan">Cyan</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 5. CERTIFICATION VALIDITY FOOTER */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                        <CheckCircle size={14} className="text-emerald-500" />
                                                        Certification Validity Badge (Bottom Bar)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label htmlFor={`website-tp-valLabel-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Validity Tag Label</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-valLabel-${idx}`}
                                                                name="sectionValidityLabel"
                                                                autoComplete="off"
                                                                placeholder="e.g. CERTIFICATION VALIDITY"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                value={section.data.validityLabel ?? 'CERTIFICATION VALIDITY'}
                                                                onChange={(e) => updateSectionData(idx, 'validityLabel', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-tp-valText-${idx}`} className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Validity Text / Period</label>
                                                            <input
                                                                type="text"
                                                                id={`website-tp-valText-${idx}`}
                                                                name="sectionValidityText"
                                                                autoComplete="off"
                                                                placeholder="e.g. 24-Month International Accreditation"
                                                                className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold text-accent"
                                                                value={section.data.validityText ?? '24-Month International Accreditation'}
                                                                onChange={(e) => updateSectionData(idx, 'validityText', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 6. CALL TO ACTION (CTA) BUTTONS */}
                                                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                                                        <ArrowRight size={14} className="text-primary" />
                                                        Action Buttons & Links (Bottom Bar)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Secondary Button */}
                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Secondary Button (Ghost/Outline)</span>
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-bold"
                                                                    placeholder="e.g. GWO Benefits"
                                                                    value={section.data.secondaryButtonText ?? 'GWO Benefits'}
                                                                    onChange={(e) => updateSectionData(idx, 'secondaryButtonText', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">Button Link Target</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono"
                                                                    placeholder="e.g. /about/gwo-benefits"
                                                                    value={section.data.secondaryButtonLink ?? '/about/gwo-benefits'}
                                                                    onChange={(e) => updateSectionData(idx, 'secondaryButtonLink', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Primary Button */}
                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                                                            <span className="text-[10px] font-bold text-amber-500 uppercase block">Primary Button (Gold Solid CTA)</span>
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-bold text-amber-600 dark:text-amber-400"
                                                                    placeholder="e.g. View GWO Courses"
                                                                    value={section.data.buttonText ?? 'View GWO Courses'}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonText', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">Button Link Target</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono"
                                                                    placeholder="e.g. /courses?category=Global%20Wind%20Organisation"
                                                                    value={section.data.buttonLink ?? '/courses?category=Global%20Wind%20Organisation'}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonLink', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (section.type === 'contact-form' || section.id === 'contact_section' || section.id === 'contact') ? (
                                            <div className="space-y-6">
                                                {/* Notice / Guide */}
                                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                                                    <Info size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                    <div className="space-y-1">
                                                        <span className="font-bold block text-sm">Contact Form & Practical Training Facility Showcase</span>
                                                        <p className="text-emerald-700 dark:text-emerald-300">
                                                            Configure the Home Page Contact Us inquiry form labels, submit button, and the left-side Facility Showcase image carousel (Practical Training, Climbing Towers, Gear Simulation, etc.).
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Form Settings (Right Column on Home) */}
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 space-y-4">
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider block">Contact Form Settings (Right Column)</span>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Form Heading Title</label>
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20"
                                                                placeholder="e.g. Contact Us"
                                                                value={section.data.heading ?? 'Contact Us'}
                                                                onChange={(e) => updateSectionData(idx, 'heading', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Submit Button Label</label>
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 font-bold"
                                                                placeholder="e.g. SEND MESSAGE"
                                                                value={section.data.buttonText ?? 'SEND MESSAGE'}
                                                                onChange={(e) => updateSectionData(idx, 'buttonText', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Form Subtitle / Instructions</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20"
                                                            placeholder="e.g. Ready to get started? Fill out the form below."
                                                            value={section.data.subheading ?? 'Ready to get started? Fill out the form below.'}
                                                            onChange={(e) => updateSectionData(idx, 'subheading', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Facility Slider Showcase Items (Left Column on Home) */}
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider block">
                                                                Facility Slider Showcase Cards (Left Column)
                                                            </span>
                                                            <span className="text-[11px] text-gray-500">
                                                                {((section.data.slides || section.data.items || []).length)} Slides in Rotating Carousel
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => addContactSlide(idx)}
                                                            className="px-3 py-1.5 bg-[#FDC70E] hover:bg-[#eab308] text-secondary font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                                        >
                                                            <Plus size={14} /> Add Slide
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {(section.data.slides || section.data.items || []).map((slide: any, sIdx: number) => (
                                                            <div key={sIdx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 relative group shadow-sm">
                                                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                                        Slide #{sIdx + 1} — {slide.title || 'Untitled Slide'}
                                                                    </span>
                                                                    {(section.data.slides || section.data.items || []).length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeContactSlide(idx, sIdx)}
                                                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                                                                        >
                                                                            <Trash2 size={12} /> Remove
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Top Pill Badge (Gold Tag)</label>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white"
                                                                            placeholder="e.g. PRACTICAL TRAINING"
                                                                            value={slide.badge || ''}
                                                                            onChange={(e) => updateContactSlide(idx, sIdx, 'badge', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Bottom Subtitle Tag</label>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white"
                                                                            placeholder="e.g. REAL-WORLD PRACTICE"
                                                                            value={slide.tag || ''}
                                                                            onChange={(e) => updateContactSlide(idx, sIdx, 'tag', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Slide Title / Headline</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white"
                                                                        placeholder="e.g. Hands-On Wind & Height Safety Simulation"
                                                                        value={slide.title || ''}
                                                                        onChange={(e) => updateContactSlide(idx, sIdx, 'title', e.target.value)}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Location / Subtitle Text</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs text-gray-900 dark:text-white"
                                                                        placeholder="e.g. Certified Training Towers & Height Systems"
                                                                        value={slide.location || slide.description || ''}
                                                                        onChange={(e) => {
                                                                            updateContactSlide(idx, sIdx, 'location', e.target.value);
                                                                            updateContactSlide(idx, sIdx, 'description', e.target.value);
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* Slide Image & Upload Section */}
                                                                <div className="space-y-3 pt-1">
                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Slide Image Cover (URL or Device Upload)</label>
                                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                                            <input
                                                                                type="text"
                                                                                className="flex-1 p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
                                                                                placeholder="e.g. /contact-climbing-training.jpg or https://..."
                                                                                value={slide.image || ''}
                                                                                onChange={(e) => updateContactSlide(idx, sIdx, 'image', e.target.value)}
                                                                            />
                                                                            <label
                                                                                htmlFor={`contact-slide-file-${idx}-${sIdx}`}
                                                                                className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
                                                                                title="Upload from device"
                                                                            >
                                                                                <UploadCloud size={15} />
                                                                                <span>Upload Image</span>
                                                                                <input
                                                                                    type="file"
                                                                                    id={`contact-slide-file-${idx}-${sIdx}`}
                                                                                    name={`contactSlideFile-${idx}-${sIdx}`}
                                                                                    autoComplete="off"
                                                                                    className="hidden"
                                                                                    accept="image/*"
                                                                                    onChange={async (e) => {
                                                                                        const file = e.target.files?.[0];
                                                                                        if (file) {
                                                                                            if (file.size > 15 * 1024 * 1024) {
                                                                                                alert("File is too large. Max 15MB.");
                                                                                                e.target.value = '';
                                                                                                return;
                                                                                            }
                                                                                            setIsUploading(true);
                                                                                            try {
                                                                                                const mediaData = await firebaseClient.uploadMedia(file, 'website-content');
                                                                                                updateContactSlide(idx, sIdx, 'image', mediaData);
                                                                                            } catch (err) {
                                                                                                const reader = new FileReader();
                                                                                                reader.onload = (evt) => {
                                                                                                    const base64 = evt.target?.result as string;
                                                                                                    updateContactSlide(idx, sIdx, 'image', base64);
                                                                                                };
                                                                                                reader.readAsDataURL(file);
                                                                                            } finally {
                                                                                                setIsUploading(false);
                                                                                                e.target.value = '';
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Fallback Image URL (Optional)</label>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
                                                                            placeholder="https://images.unsplash.com/..."
                                                                            value={slide.fallback || ''}
                                                                            onChange={(e) => updateContactSlide(idx, sIdx, 'fallback', e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Image Preview */}
                                                                {(slide.image || slide.fallback) && (
                                                                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-slate-900 shadow-inner mt-2">
                                                                        <img
                                                                            src={slide.image || slide.fallback}
                                                                            alt="Slide preview"
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                if (slide.fallback) (e.target as HTMLImageElement).src = slide.fallback;
                                                                            }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                                                                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#FDC70E] text-secondary font-black text-[10px] rounded-full uppercase shadow">
                                                                            {slide.badge || 'PRACTICAL TRAINING'}
                                                                        </div>
                                                                        <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-bold drop-shadow">
                                                                            <span className="text-accent text-[10px] uppercase font-bold block">{slide.tag || 'REAL-WORLD PRACTICE'}</span>
                                                                            {slide.title || 'Slide Title Preview'}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Common Fields */}
                                                {section.data.heading !== undefined && (
                                                    <div>
                                                        <label htmlFor={`website-heading-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Heading</label>
                                                        <input
                                                            type="text"
                                                            id={`website-heading-${idx}`}
                                                            name="sectionHeading"
                                                            autoComplete="off"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.heading}
                                                            onChange={(e) => updateSectionData(idx, 'heading', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.subheading !== undefined && (
                                                    <div>
                                                        <label htmlFor={`website-subheading-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Subheading</label>
                                                        <input
                                                            type="text"
                                                            id={`website-subheading-${idx}`}
                                                            name="sectionSubheading"
                                                            autoComplete="off"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.subheading}
                                                            onChange={(e) => updateSectionData(idx, 'subheading', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.description !== undefined && (
                                                    <div>
                                                        <label htmlFor={`website-description-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                                        <textarea
                                                            id={`website-description-${idx}`}
                                                            name="sectionDescription"
                                                            autoComplete="off"
                                                            rows={3}
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                            value={section.data.description}
                                                            onChange={(e) => updateSectionData(idx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                                {section.data.image !== undefined && (
                                                    <div>
                                                        <label htmlFor={`website-image-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Image</label>
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                id={`website-image-${idx}`}
                                                                name="sectionImage"
                                                                autoComplete="off"
                                                                placeholder="Image URL"
                                                                className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                                value={section.data.image}
                                                                onChange={(e) => updateSectionData(idx, 'image', e.target.value)}
                                                            />
                                                            <label htmlFor={`website-image-file-${idx}`} className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-500 rounded-lg px-3 flex items-center justify-center transition-colors" title="Upload from device">
                                                                <UploadCloud size={18} />
                                                                <input type="file" id={`website-image-file-${idx}`} name="sectionImageFile" autoComplete="off" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} />
                                                            </label>
                                                        </div>
                                                        {section.data.image && (
                                                            <div className="relative w-full h-44 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden group/img flex items-center justify-center">
                                                                <img 
                                                                    src={section.data.image} 
                                                                    alt="Preview" 
                                                                    className="w-full h-full object-cover" 
                                                                    onError={(e) => {
                                                                        const target = e.currentTarget;
                                                                        target.onerror = null;
                                                                        target.src = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200";
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                    <label htmlFor={`website-image-file-${idx}`} className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer shadow-md flex items-center gap-1.5 transition-all">
                                                                        <UploadCloud size={14} /> Replace
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateSectionData(idx, 'image', '')}
                                                                        className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                                                                    >
                                                                        <Trash2 size={14} /> Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Button Fields */}
                                                {(section.data.buttonText !== undefined || section.data.buttonLink !== undefined) && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {section.data.buttonText !== undefined && (
                                                            <div>
                                                                <label htmlFor={`website-btn-text-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-btn-text-${idx}`}
                                                                    name="sectionButtonText"
                                                                    autoComplete="off"
                                                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                    value={section.data.buttonText}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonText', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        {section.data.buttonLink !== undefined && (
                                                            <div>
                                                                <label htmlFor={`website-btn-link-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Button Link</label>
                                                                <input
                                                                    type="text"
                                                                    id={`website-btn-link-${idx}`}
                                                                    name="sectionButtonLink"
                                                                    autoComplete="off"
                                                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                    value={section.data.buttonLink}
                                                                    onChange={(e) => updateSectionData(idx, 'buttonLink', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Trusted Partners field for content sections */}
                                                {(section.id === 'about_intro' || section.type === 'content' || section.data.partners !== undefined) && (
                                                    <div>
                                                        <label htmlFor={`website-partners-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Trusted Partners / Accreditation Text</label>
                                                        <input
                                                            type="text"
                                                            id={`website-partners-${idx}`}
                                                            name="sectionPartners"
                                                            autoComplete="off"
                                                            placeholder="e.g. GWO Certified"
                                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                            value={Array.isArray(section.data.partners) ? section.data.partners.join(', ') : (section.data.partners || '')}
                                                            onChange={(e) => updateSectionData(idx, 'partners', e.target.value.split(',').map(s => s.trim()))}
                                                        />
                                                    </div>
                                                )}

                                                {/* CTA Badge Title & Description fields */}
                                                {(section.type === 'cta' || section.id === 'cta' || section.data.badgeTitle !== undefined) && (
                                                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                        <div>
                                                            <label htmlFor={`website-badge-title-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Badge Title (e.g. Internationally Recognised)</label>
                                                            <input
                                                                type="text"
                                                                id={`website-badge-title-${idx}`}
                                                                name="sectionBadgeTitle"
                                                                autoComplete="off"
                                                                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                value={section.data.badgeTitle || ''}
                                                                onChange={(e) => updateSectionData(idx, 'badgeTitle', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`website-badge-desc-${idx}`} className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Badge Description</label>
                                                            <textarea
                                                                id={`website-badge-desc-${idx}`}
                                                                name="sectionBadgeDescription"
                                                                autoComplete="off"
                                                                rows={2}
                                                                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                                                                value={section.data.badgeDescription || ''}
                                                                onChange={(e) => updateSectionData(idx, 'badgeDescription', e.target.value)}
                                                            />
                                                        </div>
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
                                                                    {section.type === 'team' ? (
                                                                        <div className="space-y-2">
                                                                            <div>
                                                                                <label htmlFor={`website-item-title-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Trainer / Instructor Name</label>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`website-item-title-${idx}-${itemIdx}`}
                                                                                    name="sectionItemTitle"
                                                                                    autoComplete="name"
                                                                                    placeholder="e.g. Sarah Jenkins"
                                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm font-bold"
                                                                                    value={item.title}
                                                                                    onChange={(e) => updateSectionItemData(idx, itemIdx, 'title', e.target.value)}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label htmlFor={`website-item-position-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Position / Role / Designation</label>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`website-item-position-${idx}-${itemIdx}`}
                                                                                    name="sectionItemPosition"
                                                                                    autoComplete="organization-title"
                                                                                    placeholder="e.g. Chief Operation Officer, Lead Instructor"
                                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-semibold"
                                                                                    value={item.position !== undefined ? item.position : (item.description || '')}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.value;
                                                                                        updateSectionItemData(idx, itemIdx, 'position', val);
                                                                                        updateSectionItemData(idx, itemIdx, 'description', val);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div>
                                                                                <label htmlFor={`website-item-title-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Title / Name</label>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`website-item-title-${idx}-${itemIdx}`}
                                                                                    name="sectionItemTitle"
                                                                                    autoComplete="off"
                                                                                    placeholder="Title"
                                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm font-bold"
                                                                                    value={item.title}
                                                                                    onChange={(e) => updateSectionItemData(idx, itemIdx, 'title', e.target.value)}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label htmlFor={`website-item-desc-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Description / Subtitle</label>
                                                                                <textarea
                                                                                    id={`website-item-desc-${idx}-${itemIdx}`}
                                                                                    name="sectionItemDescription"
                                                                                    autoComplete="off"
                                                                                    rows={2}
                                                                                    placeholder="Description"
                                                                                    className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs"
                                                                                    value={item.description}
                                                                                    onChange={(e) => updateSectionItemData(idx, itemIdx, 'description', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    {/* Optional Image for Item */}
                                                                    {item.image !== undefined && (
                                                                        <div>
                                                                            <label htmlFor={`website-item-image-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Photo / Image URL</label>
                                                                            <div className="flex gap-2 items-center">
                                                                                <div className="flex-1 relative">
                                                                                    <input
                                                                                        type="text"
                                                                                        id={`website-item-image-${idx}-${itemIdx}`}
                                                                                        name="sectionItemImage"
                                                                                        autoComplete="off"
                                                                                        placeholder="Item Image URL"
                                                                                        className="w-full p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono text-gray-500 dark:text-gray-400 pr-8"
                                                                                        value={item.image}
                                                                                        onChange={(e) => updateSectionItemData(idx, itemIdx, 'image', e.target.value)}
                                                                                    />
                                                                                    <label className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-primary transition-colors">
                                                                                        <UploadCloud size={12} />
                                                                                        <input type="file" id={`website-item-file-${idx}-${itemIdx}`} name="sectionItemFile" autoComplete="off" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx, itemIdx)} />
                                                                                    </label>
                                                                                </div>
                                                                                {item.image && (
                                                                                    <div className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden shrink-0 relative group/thumb">
                                                                                        <img src={item.image} alt="Thumb" className="w-full h-full object-cover" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {/* Optional Icon for Item */}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Icon:</span>
                                                                        <input
                                                                            type="text"
                                                                            id={`website-item-icon-${idx}-${itemIdx}`}
                                                                            name="sectionItemIcon"
                                                                            autoComplete="off"
                                                                            placeholder="e.g. CheckCircle, User, Star"
                                                                            className="flex-1 p-1.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-xs font-mono text-gray-500 dark:text-gray-400"
                                                                            value={item.icon || ''}
                                                                            onChange={(e) => updateSectionItemData(idx, itemIdx, 'icon', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {/* Team specific fields */}
                                                                    {section.type === 'team' && (
                                                                        <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label htmlFor={`website-item-exp-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Experience</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        id={`website-item-exp-${idx}-${itemIdx}`}
                                                                                        name="sectionItemExperience"
                                                                                        autoComplete="off"
                                                                                        placeholder="e.g. 8 Years"
                                                                                        className="w-full p-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                        value={item.experience || ''}
                                                                                        onChange={(e) => updateSectionItemData(idx, itemIdx, 'experience', e.target.value)}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label htmlFor={`website-item-specs-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Areas of Expertise</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        id={`website-item-specs-${idx}-${itemIdx}`}
                                                                                        name="sectionItemSpecialties"
                                                                                        autoComplete="off"
                                                                                        placeholder="e.g. GWO BST, Rescue, First Aid"
                                                                                        className="w-full p-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                        value={item.specialties || ''}
                                                                                        onChange={(e) => updateSectionItemData(idx, itemIdx, 'specialties', e.target.value)}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <label htmlFor={`website-item-bio-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Biography & Credentials</label>
                                                                                <textarea
                                                                                    id={`website-item-bio-${idx}-${itemIdx}`}
                                                                                    name="sectionItemBio"
                                                                                    autoComplete="off"
                                                                                    rows={2}
                                                                                    placeholder="Detailed trainer background, certificates, and field experience..."
                                                                                    className="w-full p-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                    value={item.bio || ''}
                                                                                    onChange={(e) => updateSectionItemData(idx, itemIdx, 'bio', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                                        <div>
                                                                            <label htmlFor={`website-item-btn-text-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Btn Text</label>
                                                                            <input
                                                                                type="text"
                                                                                id={`website-item-btn-text-${idx}-${itemIdx}`}
                                                                                name="sectionItemButtonText"
                                                                                autoComplete="off"
                                                                                placeholder="Button Text"
                                                                                className="w-full p-1 border border-gray-205 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-[11px]"
                                                                                value={item.buttonText || ''}
                                                                                onChange={(e) => updateSectionItemData(idx, itemIdx, 'buttonText', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label htmlFor={`website-item-btn-link-${idx}-${itemIdx}`} className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Btn Link</label>
                                                                            <input
                                                                                type="text"
                                                                                id={`website-item-btn-link-${idx}-${itemIdx}`}
                                                                                name="sectionItemButtonLink"
                                                                                autoComplete="off"
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
                                    {(['hero', 'training-programs', 'locations-list', 'contact-form', 'content', 'features', 'cta', 'team', 'accordion'] as const).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => addSection(type)}
                                            className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:shadow transition-all"
                                        >
                                            + {type === 'training-programs' ? 'TRAINING PROGRAMS' : type === 'locations-list' ? 'CAMPUSES' : type === 'contact-form' ? 'CONTACT & SHOWCASE' : type.toUpperCase()}
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
                                        <SectionRenderer key={idx} section={section} locationsOverride={globalLocations} />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white flex items-center gap-2.5">
                        <FileText className="text-primary dark:text-blue-400" size={26} />
                        Website Content Manager
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Edit content, manage pages, and configure site themes with real-time live synchronization.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Realtime Live Sync Active
                    </span>
                    <button 
                        type="button"
                        onClick={handleRealignAllPages} 
                        disabled={isRealigning}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-[#FDC70E] hover:bg-[#E5B200] text-[#041024] shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-amber-400"
                        title="Synchronize all pages with default layouts and schema"
                    >
                        <RefreshCcw size={14} className={`text-[#041024] shrink-0 ${isRealigning ? "animate-spin" : ""}`} />
                        <span className="font-black text-[#041024] tracking-wide whitespace-nowrap">{isRealigning ? "Syncing All Pages..." : "⚡ Sync & Realign with Frontend"}</span>
                    </button>
                </div>
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
                                                <span>{page.id === 'usi' || page.name === 'USI Info' || page.id === 'winda' ? 'WINDA Registration' : page.name}</span>
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
                                        <label htmlFor="website-primary-color" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-primary-color" name="themePrimaryColor" autoComplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorPrimary} onChange={e => setTheme({ ...theme, colorPrimary: e.target.value })} />
                                            <input type="text" id="website-primary-hex" name="themePrimaryHex" autoComplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorPrimary} onChange={e => setTheme({ ...theme, colorPrimary: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="website-secondary-color" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-secondary-color" name="themeSecondaryColor" autoComplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorSecondary} onChange={e => setTheme({ ...theme, colorSecondary: e.target.value })} />
                                            <input type="text" id="website-secondary-hex" name="themeSecondaryHex" autoComplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorSecondary} onChange={e => setTheme({ ...theme, colorSecondary: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="website-accent-color" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
                                        <div className="flex gap-2">
                                            <input type="color" id="website-accent-color" name="themeAccentColor" autoComplete="off" className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-700" value={theme.colorAccent} onChange={e => setTheme({ ...theme, colorAccent: e.target.value })} />
                                            <input type="text" id="website-accent-hex" name="themeAccentHex" autoComplete="off" className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 uppercase font-mono text-sm" value={theme.colorAccent} onChange={e => setTheme({ ...theme, colorAccent: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="website-border-radius" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Border Radius (px)</label>
                                        <input type="number" id="website-border-radius" name="themeBorderRadius" autoComplete="off" className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2" value={theme.borderRadius} onChange={e => setTheme({ ...theme, borderRadius: Number(e.target.value) })} />
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

            {/* Saved Confirmation Toast */}
            {showSavedToast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in border border-emerald-400">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Check size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Saved & Stored to Firebase Realtime Live!</p>
                        <p className="text-xs text-emerald-100">All data changes have been completely saved and synced live.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
