
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Wind, HardHat, LifeBuoy, Flame, HeartPulse, ShieldCheck, Zap,
  LayoutGrid, X, Layers, Clock, DollarSign, Users, Award, Star, TrendingUp,
  ChevronDown, SlidersHorizontal, BookOpen, ArrowUpDown
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { CourseCategory, Course } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCourses, getPageContent, addToCart } from '../services/storageService';
import { Button } from '../components/Button';
import { Link, useSearchParams } from 'react-router-dom';

// Default slides in case CMS data is missing
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "Our Courses",
    subtitle: "Browse our extensive range of accredited qualifications and short courses designed for industry.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920",
  }
];

// Sort options
type SortMode = 'popular' | 'price_asc' | 'price_desc' | 'az';
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'az', label: 'A → Z' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  [CourseCategory.GWO]: <Wind size={14} />,
  [CourseCategory.CONSTRUCTION]: <HardHat size={14} />,
  [CourseCategory.RESCUE]: <LifeBuoy size={14} />,
  [CourseCategory.SAFETY]: <Flame size={14} />,
  [CourseCategory.FIRST_AID]: <HeartPulse size={14} />,
  [CourseCategory.WORKSAFE]: <ShieldCheck size={14} />,
  [CourseCategory.ELECTRICAL]: <Zap size={14} />,
};

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [ctaContent, setCtaContent] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Filters
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [filterDuration, setFilterDuration] = useState<string>('All');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const loaded = getCourses();
    setCourses(loaded);
    setIsLoading(false);

    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedCategory(categoryParam);

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
      const ctaSection = pageContent.sections.find(s => s.id === 'cta');
      if (ctaSection) setCtaContent(ctaSection.data);
    }
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

  const categories = ['All', ...Object.values(CourseCategory)];
  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level)))];

  const categoryOptions = categories.map(cat => {
    let icon = <BookOpen size={14} className="text-gray-400" />;
    if (cat === CourseCategory.GWO) icon = <Wind size={14} className="text-blue-500" />;
    else if (cat === CourseCategory.CONSTRUCTION) icon = <HardHat size={14} className="text-amber-500" />;
    else if (cat === CourseCategory.RESCUE) icon = <LifeBuoy size={14} className="text-red-500" />;
    else if (cat === CourseCategory.SAFETY) icon = <Flame size={14} className="text-orange-500" />;
    else if (cat === CourseCategory.FIRST_AID) icon = <HeartPulse size={14} className="text-emerald-500" />;
    else if (cat === CourseCategory.WORKSAFE) icon = <ShieldCheck size={14} className="text-indigo-500" />;
    else if (cat === CourseCategory.ELECTRICAL) icon = <Zap size={14} className="text-yellow-500" />;
    return {
      value: cat,
      label: cat === 'All' ? 'All Categories' : cat,
      icon: icon
    };
  });

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

  const priceOptions = [
    { value: 'All', label: 'Any Price', icon: <DollarSign size={14} className="text-gray-400" /> },
    { value: 'Low', label: 'Under $500', icon: <DollarSign size={14} className="text-emerald-500" /> },
    { value: 'Medium', label: '$500 – $1,500', icon: <DollarSign size={14} className="text-blue-500" /> },
    { value: 'High', label: 'Over $1,500', icon: <DollarSign size={14} className="text-indigo-500" /> },
  ];

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (course.prerequisites && course.prerequisites.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      let matchesPrice = true;
      if (filterPriceRange === 'Low') matchesPrice = course.price < 500;
      if (filterPriceRange === 'Medium') matchesPrice = course.price >= 500 && course.price <= 1500;
      if (filterPriceRange === 'High') matchesPrice = course.price > 1500;
      let matchesDuration = true;
      const d = course.duration?.toLowerCase() || '';
      if (filterDuration === 'Short') matchesDuration = d.includes('1 day') || d.includes('2 days') || d.includes('hour');
      if (filterDuration === 'Medium') matchesDuration = d.includes('3 days') || d.includes('4 days') || d.includes('5 days') || d.includes('week');
      if (filterDuration === 'Long') matchesDuration = d.includes('month') || (d.includes('days') && parseInt(d) > 5);
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesDuration;
    })
    .sort((a, b) => {
      if (sortMode === 'price_asc') return a.price - b.price;
      if (sortMode === 'price_desc') return b.price - a.price;
      if (sortMode === 'az') return a.title.localeCompare(b.title);
      return 0; // popular = default order
    });

  const hasActiveFilters = selectedCategory !== 'All' || selectedLevel !== 'All' || filterDuration !== 'All' || filterPriceRange !== 'All' || searchTerm !== '';

  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setFilterDuration('All');
    setFilterPriceRange('All');
  };

  // Stats derived from course data
  const totalCourses = courses.length;
  const avgPrice = courses.length > 0 ? Math.round(courses.reduce((s, c) => s + c.price, 0) / courses.length) : 0;

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

        {/* ─── Quick Stats Banner ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-secondary leading-none mb-1">{courses.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Courses</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Wind className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-secondary leading-none mb-1">
                {courses.filter(c => c.category === CourseCategory.GWO).length}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">GWO Modules</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <HardHat className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-secondary leading-none mb-1">
                {courses.filter(c => c.category === CourseCategory.CONSTRUCTION).length}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Risk Work</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
              <DollarSign className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-secondary leading-none mb-1">${avgPrice}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Investment</p>
            </div>
          </div>
        </div>

        {/* ─── Controls Bar ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-80 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
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
                onChange={setSelectedCategory}
              />
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
              <CustomDropdown
                label="Price Range"
                value={filterPriceRange}
                options={priceOptions}
                onChange={setFilterPriceRange}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredCourses.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group">
                  <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-[4px] inline-block">{course.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-[4px] inline-block">{course.level}</span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.shortDescription}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                      <div className="flex gap-5 text-sm font-semibold text-gray-600">
                        <span className="flex items-center gap-1.5"><Clock size={15} className="text-gray-400" />{course.duration}</span>
                        <span className="flex items-center gap-1.5 text-primary text-base font-bold"><DollarSign size={15} className="text-gray-400" />{course.price}</span>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm" className="px-5 rounded-lg text-xs font-bold">View Details</Button>
                        </Link>
                        <Button size="sm" className="px-5 rounded-lg text-xs font-bold bg-secondary text-white hover:bg-primary" onClick={() => addToCart(course.id)}>Add to Cart</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* ─── CTA Section ────────────────────────────────────────── */}
        {ctaContent && (
          <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white mt-20 rounded-3xl relative overflow-hidden shadow-2xl animate-fade-in">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="container mx-auto px-8 relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{ctaContent.heading}</h2>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">{ctaContent.subheading}</p>
              <Link to={ctaContent.buttonLink || '/contact'}>
                <Button className="bg-accent text-secondary hover:bg-white hover:text-primary border-none text-lg px-10 py-4 shadow-xl shadow-accent/20">
                  {ctaContent.buttonText}
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};