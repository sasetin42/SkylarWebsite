
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Wind, HardHat, LifeBuoy, Flame, HeartPulse, ShieldCheck, Zap,
  LayoutGrid, X, Layers, Clock, DollarSign, Users, Award, Star, TrendingUp,
  ChevronDown, SlidersHorizontal, BookOpen, ArrowUpDown, Shield, Calendar, ArrowRight
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { Course, Category } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCourses, getPageContent, addToCart, getCategories } from '../services/storageService';
import { Button } from '../components/Button';
import { Link, useSearchParams } from 'react-router-dom';

// Default slides in case CMS data is missing
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "Our Courses",
    subtitle: "Browse our extensive range of GWO certified safety courses and industrial training.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920",
  }
];

// Sort options
type SortMode = 'popular' | 'az';
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'az', label: 'A → Z' },
];



// Skeleton card for loading state
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-gray-200 rounded flex-1" />
        <div className="h-9 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  </div>
);

interface CustomDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto relative" ref={dropdownRef}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 hover:border-primary hover:bg-white text-sm font-bold text-gray-700 px-4 py-3 rounded-xl transition-all duration-300 w-full min-w-[200px] shadow-sm hover:shadow-md cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          {selectedOption.icon || icon}
          <span className="text-secondary">{selectedOption.label}</span>
        </div>
        <ChevronDown size={15} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <div
        className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-40 transition-all duration-300 transform origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-h-60 overflow-y-auto scrollbar-thin">
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-secondary hover:pl-5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [searchParams] = useSearchParams();
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Filters
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [filterDuration, setFilterDuration] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadCoursesData = () => {
      setIsLoading(true);
      const loaded = getCourses();
      setCourses(loaded);
      setIsLoading(false);

      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        if (categoryParam.toUpperCase() === 'GWO') {
          const allCats = getCategories();
          const pCats = allCats.filter(c => !c.parentId);
          const gwoCat = pCats.find(c => (c.name || '').toLowerCase().includes('wind') || (c.name || '').toLowerCase().includes('gwo'));
          setSelectedCategory(gwoCat ? gwoCat.name : categoryParam);
        } else {
          setSelectedCategory(categoryParam);
        }
      }

      const pageContent = getPageContent('courses');
      if (pageContent) {
        const heroSection = pageContent.sections.find(s => s.id === 'hero');
        if (heroSection?.data?.items && heroSection.data.items.length > 0) {
          const slides = heroSection.data.items.map((item, idx) => ({
            id: idx,
            title: item.title,
            subtitle: item.description,
            image: item.image || DEFAULT_SLIDES[0].image
          }));
          setHeroSlides(slides);
        }
      }
    };

    loadCoursesData();
    window.addEventListener('coursesUpdated', loadCoursesData);
    window.addEventListener('sitePagesUpdated', loadCoursesData);
    window.addEventListener('categoriesUpdated', loadCoursesData);
    return () => {
      window.removeEventListener('coursesUpdated', loadCoursesData);
      window.removeEventListener('sitePagesUpdated', loadCoursesData);
      window.removeEventListener('categoriesUpdated', loadCoursesData);
    };
  }, [searchParams]);

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const categoryList = getCategories();
  const parentCategoryList = categoryList.filter(c => !c.parentId);
  const categories = ['All', ...parentCategoryList.map(c => c.name).filter(Boolean)];
  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level).filter(Boolean)))];

  const categoryOptions = categories.map(cat => {
    let icon = <BookOpen size={14} className="text-gray-400" />;
    if (cat === 'Global Wind Organisation') icon = <Wind size={14} className="text-blue-500" />;
    else if (cat === 'Construction & High Risk Work') icon = <HardHat size={14} className="text-amber-500" />;
    else if (cat === 'Specialised Rescue') icon = <LifeBuoy size={14} className="text-red-500" />;
    else if (cat === 'Workplace Safety & Emergency Response') icon = <Flame size={14} className="text-orange-500" />;
    else if (cat === 'First Aid') icon = <HeartPulse size={14} className="text-emerald-500" />;
    else if (cat === 'WorkSafe-Approved Courses') icon = <ShieldCheck size={14} className="text-indigo-500" />;
    else if (cat === 'Electrical & Utilities') icon = <Zap size={14} className="text-yellow-500" />;
    return {
      value: cat,
      label: cat === 'All' ? 'All Categories' : cat,
      icon: icon
    };
  });

  const selectedCatObj = parentCategoryList.find(c => c.name === selectedCategory);
  const subCategoryList = selectedCatObj ? categoryList.filter(c => c.parentId === selectedCatObj.id) : [];
  const subCategories = ['All', ...subCategoryList.map(c => c.name).filter(Boolean)];
  const subCategoryOptions = subCategories.map(cat => ({
    value: cat,
    label: cat === 'All' ? 'All Sub Categories' : cat,
    icon: <BookOpen size={14} className="text-gray-400" />
  }));

  const levelOptions = levels.map(l => ({
    value: l,
    label: l === 'All' ? 'All Levels' : l,
    icon: <Award size={14} className="text-indigo-500" />
  }));

  const durationOptions = [
    { value: 'All', label: 'Any Duration', icon: <Clock size={14} className="text-gray-400" /> },
    { value: 'Short', label: 'Short (< 3 days)', icon: <Clock size={14} className="text-emerald-500" /> },
    { value: 'Medium', label: 'Medium (3-5 days)', icon: <Clock size={14} className="text-blue-500" /> },
    { value: 'Long', label: 'Long (> 5 days)', icon: <Clock size={14} className="text-indigo-500" /> },
  ];

  const searchLower = (searchTerm || '').trim().toLowerCase();

  const filteredCourses = courses
    .filter(course => {
      if (!course) return false;
      const titleStr = (course.title || '').toLowerCase();
      const idStr = (course.id || '').toLowerCase();
      const shortDescStr = (course.shortDescription || '').toLowerCase();
      const fullDescStr = (course.fullDescription || '').toLowerCase();
      const codeStr = (course.code || '').toLowerCase();
      const catStr = (course.category || '').toLowerCase();

      const matchesSearch = !searchLower ||
                            titleStr.includes(searchLower) ||
                            idStr.includes(searchLower) ||
                            codeStr.includes(searchLower) ||
                            shortDescStr.includes(searchLower) ||
                            fullDescStr.includes(searchLower) ||
                            (Array.isArray(course.prerequisites) && course.prerequisites.some(p => (p || '').toLowerCase().includes(searchLower))) ||
                            (Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.some(w => (w || '').toLowerCase().includes(searchLower)));

      const selCatLower = (selectedCategory || 'All').toLowerCase();
      const matchesCategory = selectedCategory === 'All' || 
        catStr === selCatLower ||
        (selCatLower === 'gwo' && (catStr.includes('wind') || course.isGwo || catStr.includes('gwo')));

      const matchesSubCategory = selectedSubCategory === 'All' || (course.subCategory || '').toLowerCase() === (selectedSubCategory || '').toLowerCase();
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      let matchesDuration = true;
      const d = (course.duration || '').toLowerCase();
      if (filterDuration === 'Short') matchesDuration = d.includes('1 day') || d.includes('2 days') || d.includes('hour');
      if (filterDuration === 'Medium') matchesDuration = d.includes('3 days') || d.includes('4 days') || d.includes('5 days') || d.includes('week');
      if (filterDuration === 'Long') matchesDuration = d.includes('month') || (d.includes('days') && parseInt(d) > 5);
      return matchesSearch && matchesCategory && matchesSubCategory && matchesLevel && matchesDuration;
    })
    .sort((a, b) => {
      if (sortMode === 'az') return (a.title || '').localeCompare(b.title || '');
      return 0; // popular = default order
    });

  const hasActiveFilters = selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedLevel !== 'All' || filterDuration !== 'All' || searchTerm !== '';

  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedLevel('All');
    setFilterDuration('All');
  };

  return (
    <div className="bg-surface min-h-screen pb-24">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img
            src={heroSlides[0]?.image || DEFAULT_SLIDES[0].image}
            alt={heroSlides[0]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>

        {/* Content — in normal flow so section auto-expands to fit */}
        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl">
              <div className="animate-fade-in-up">
                <div className="flex flex-wrap gap-2.5 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                    ★ 4.9/5 Rating
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                    GWO Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                    WorkSafe Approved
                  </span>
                </div>

                <h1
                  className="font-heading font-bold text-white mb-4 drop-shadow-lg"
                  style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}
                >
                  Training <span className="text-accent">Courses</span>
                </h1>
                <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
                <p className="text-gray-200 drop-shadow-md font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                  Explore our comprehensive range of safety training programs designed to elevate your skills in the wind energy and industrial sectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 mt-10 relative z-20">

        {/* ─── 4 Enhanced Course Application KPI Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {/* KPI 1: Accredited Courses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md border border-gray-100 dark:border-slate-800 p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                  {courses.length > 0 ? courses.length : 5} Programs
                </p>
                <span className="text-[9px] font-black text-primary dark:text-accent bg-primary/10 dark:bg-amber-400/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Accredited
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider truncate">
                GWO & Safety Courses
              </p>
            </div>
          </div>

          {/* KPI 2: Fast-Track Duration */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md border border-gray-100 dark:border-slate-800 p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                  1–7 Days
                </p>
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Fast-Track
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider truncate">
                Flexible Course Duration
              </p>
            </div>
          </div>

          {/* KPI 3: Global Standards & Certification */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md border border-gray-100 dark:border-slate-800 p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                  WINDA Certified
                </p>
                <span className="text-[9px] font-black text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Global
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider truncate">
                International Recognition
              </p>
            </div>
          </div>

          {/* KPI 4: Practical Delivery & Facilities */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md border border-gray-100 dark:border-slate-800 p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                  100% Practical
                </p>
                <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Campus / Onsite
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider truncate">
                Hands-On Real Facilities
              </p>
            </div>
          </div>
        </div>

        {/* ─── Controls Bar ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-80 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <label htmlFor="courses-search" className="sr-only">Search courses</label>
              <input
                id="courses-search"
                name="courseSearch"
                autoComplete="off"
                aria-label="Search courses"
                type="text"
                placeholder="Search courses…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end flex-1">
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${showFilters ? 'bg-secondary text-white border-secondary' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-primary hover:text-primary'}`}
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
              </button>

              {/* Sort */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortMenu(v => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border bg-gray-50 border-gray-100 hover:border-primary hover:text-primary transition-all"
                >
                  <ArrowUpDown size={15} />
                  {SORT_OPTIONS.find(o => o.value === sortMode)?.label}
                  <ChevronDown size={14} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30 animate-fade-in-up">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortMode(opt.value); setShowSortMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${sortMode === opt.value ? 'text-primary font-bold' : 'text-gray-700'}`}
                      >
                        {opt.value === sortMode && <span className="mr-2">✓</span>}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="List view"
                >
                  <Layers size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-end animate-fade-in">
              <CustomDropdown
                label="Category"
                value={selectedCategory}
                options={categoryOptions}
                onChange={(val) => { setSelectedCategory(val); setSelectedSubCategory('All'); }}
              />
              {subCategoryList.length > 0 && (
                <CustomDropdown
                  label="Sub Category"
                  value={selectedSubCategory}
                  options={subCategoryOptions}
                  onChange={setSelectedSubCategory}
                />
              )}
              <CustomDropdown
                label="Level"
                value={selectedLevel}
                options={levelOptions}
                onChange={setSelectedLevel}
              />
              <CustomDropdown
                label="Duration"
                value={filterDuration}
                options={durationOptions}
                onChange={setFilterDuration}
              />

              {hasActiveFilters && (
                <button onClick={clearAll} className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-600 ml-auto border border-red-200 hover:border-red-300 px-5 py-3 rounded-xl transition-all cursor-pointer">
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── Results Count + Trending ───────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">
              Showing <span className="text-primary">{filteredCourses.length}</span> of <span className="text-secondary">{courses.length}</span> courses
            </span>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 underline">clear filters</button>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <TrendingUp size={14} className="text-accent" />
            Sorted by: <span className="font-bold text-gray-600">{SORT_OPTIONS.find(o => o.value === sortMode)?.label}</span>
          </div>
        </div>

        {/* ─── Results Section ────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredCourses.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-5">
              {filteredCourses.map(course => {
                let badgeColorClass = "bg-slate-900/90";
                if (course.level && course.level.toLowerCase().includes('new')) {
                  badgeColorClass = "bg-[#FF0055]";
                } else if (course.level && course.level.toLowerCase().includes('popular')) {
                  badgeColorClass = "bg-[#4CAF50]";
                }

                return (
                  <article 
                    key={course.id} 
                    className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5 lg:gap-6 group hover:-translate-y-0.5"
                  >
                    {/* Left Thumbnail with Overlays */}
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="relative w-full md:w-72 lg:w-80 aspect-[16/10] sm:aspect-video md:aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-2xs block"
                    >
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Level / Status Badge */}
                      {course.level && course.level.toLowerCase() !== 'available' && (
                        <div className={`absolute top-2.5 left-2.5 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-white/10 uppercase tracking-wide z-10 ${badgeColorClass}`}>
                          {course.level}
                        </div>
                      )}

                      {/* Price Tag Overlay */}
                      {course.price > 0 ? (
                        <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md text-amber-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-white/10 shadow-md">
                          ${course.price}
                        </div>
                      ) : (
                        <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/90 backdrop-blur-md text-gray-300 font-bold text-[10px] px-2 py-0.5 rounded-md border border-white/10">
                          Inquire
                        </div>
                      )}

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" aria-hidden="true">
                        <span className="bg-white/95 backdrop-blur text-secondary font-bold px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 shadow-lg">
                          Explore Course <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>

                    {/* Center & Right Content Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Header Badges: Category, Code, GWO, and Intake Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#232323] bg-[#FFC107] px-2.5 py-0.5 rounded-md border border-amber-400/50 shadow-2xs truncate max-w-[220px]">
                              {course.category}
                            </span>
                            {course.code && (
                              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0 whitespace-nowrap">
                                {course.code}
                              </span>
                            )}
                            {course.isGwo && (
                              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
                                GWO Certified
                              </span>
                            )}
                          </div>

                          {course.upcomingDates && course.upcomingDates.length > 0 ? (
                            <div 
                              className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs shrink-0"
                              title={`Next scheduled dates: ${course.upcomingDates.slice(0, 2).join(', ')}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>{course.upcomingDates.length} {course.upcomingDates.length === 1 ? 'Intake Scheduled' : 'Intakes Scheduled'}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/60 shadow-2xs shrink-0">
                              ● On-Demand / Inquire
                            </span>
                          )}
                        </div>

                        {/* Course Title */}
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          <Link to={`/courses/${course.id}`} className="hover:underline decoration-amber-400/60 underline-offset-4">
                            {course.title}
                          </Link>
                        </h3>

                        {/* Short Description */}
                        {course.shortDescription && (
                          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm line-clamp-2 mb-3.5 leading-relaxed font-normal">
                            {course.shortDescription}
                          </p>
                        )}

                        {/* Specifications & Key Chips */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-700 shadow-2xs">
                            <Clock size={13} className="text-amber-500 shrink-0" />
                            <span>{course.duration || 'Flexible'}</span>
                          </span>

                          {course.validityMonths && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                              <Shield size={13} className="text-blue-500 shrink-0" />
                              <span>{course.validityMonths}m Validity</span>
                            </span>
                          )}

                          {course.deliveryMode && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                              <Users size={13} className="text-gray-400 shrink-0" />
                              <span>{course.deliveryMode}</span>
                            </span>
                          )}

                          {course.upcomingDates && course.upcomingDates.length > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60 truncate max-w-[280px] shadow-2xs">
                              <Calendar size={13} className="text-emerald-500 shrink-0" />
                              <span className="truncate">Next: {course.upcomingDates[0].split(',')[0]}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer: Price & Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-baseline gap-1.5">
                          {course.price > 0 ? (
                            <>
                              <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                                ${course.price}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/ participant</span>
                            </>
                          ) : (
                            <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
                              Inquire for Corporate & Group Pricing
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <Link to={`/courses/${course.id}`} className="flex-1 sm:flex-initial">
                            <button 
                              type="button"
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer text-center"
                            >
                              View Details
                            </button>
                          </Link>
                          <Button 
                            size="sm" 
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFC107] text-[#041024] hover:bg-[#e5ac06] uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer font-sans" 
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('openInquireModal', { 
                                detail: { courseId: course.id, courseTitle: course.title } 
                              }));
                            }}
                          >
                            INQUIRE NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 shadow-inner">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" onClick={clearAll} className="px-8 py-3">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};