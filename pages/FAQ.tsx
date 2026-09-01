import React, { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { 
  Search, BookOpen, ShieldCheck, Award, HelpCircle, 
  MapPin, CheckCircle2, ChevronRight, ThumbsUp, ThumbsDown,
  Phone, Mail, ArrowRight, Share2, Check, ExternalLink,
  Layers, Clock, GraduationCap, FileCheck, Sparkles, Filter,
  Calendar, Info, CreditCard, Users
} from 'lucide-react';
import { getPageContent, getCourses } from '../services/storageService';
import { SitePage, Course, PageSectionItem } from '../types';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { InquireModal } from '../components/InquireModal';

interface FAQArticleProps {
  item: PageSectionItem;
  coursesMap: Map<string, Course>;
  onInquireCourse: (course: Course) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQArticle: React.FC<FAQArticleProps> = ({ 
  item, 
  coursesMap, 
  onInquireCourse,
  isOpen,
  onToggle
}) => {
  const [helpfulStatus, setHelpfulStatus] = useState<'none' | 'yes' | 'no'>('none');
  const [copied, setCopied] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(item.helpfulCount || 12);

  const handleVote = (type: 'yes' | 'no') => {
    if (helpfulStatus === type) return;
    if (type === 'yes') {
      setHelpfulCount(prev => prev + 1);
    } else if (helpfulStatus === 'yes') {
      setHelpfulCount(prev => Math.max(0, prev - 1));
    }
    setHelpfulStatus(type);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set('q', item.title);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (text?: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      
      // List item detection
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bulletContent = trimmed.slice(2);
        return (
          <li key={i} className="flex items-start gap-2.5 my-1 text-gray-700 leading-relaxed list-none">
            <span className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
            <span>
              {bulletContent.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="font-semibold text-secondary">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </span>
          </li>
        );
      }

      // Numbered item detection
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex items-start gap-3 my-1.5 text-gray-700 leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
              {numMatch[1]}
            </span>
            <span>
              {numMatch[2].split(/(\*\*.*?\*\*)/g).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="font-semibold text-secondary">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </span>
          </div>
        );
      }

      return (
        <p key={i} className="mb-3 text-gray-700 leading-relaxed">
          {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold text-secondary">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  // Associated Courses
  const linkedCourses = (item.relatedCourseIds || [])
    .map(id => coursesMap.get(id))
    .filter((c): c is Course => Boolean(c));

  return (
    <div className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
      isOpen ? 'border-primary/40 ring-2 ring-primary/5 shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header / Question Accordion Trigger */}
      <button 
        className="w-full flex items-start gap-4 p-5 md:p-6 text-left transition-colors group cursor-pointer"
        onClick={onToggle}
      >
        <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
          isOpen ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 group-hover:bg-primary group-hover:text-white'
        }`}>
          {isOpen ? '−' : '+'}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          {item.category && (
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-dark bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/25">
                {item.category}
              </span>
              {item.tags && item.tags.slice(0, 2).map((t, idx) => (
                <span key={idx} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}
          <h3 className={`font-heading font-bold text-base md:text-lg leading-snug transition-colors ${
            isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'
          }`}>
            {item.title}
          </h3>
        </div>

        <div 
          onClick={handleCopyLink}
          title="Copy direct question link"
          className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors shrink-0"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
        </div>
      </button>

      {/* Accordion Body */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 md:p-8 pt-2 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
          
          {/* Main Answer Content */}
          <div className="text-gray-700 text-sm md:text-[15px] space-y-2">
            {renderContent(item.description)}
          </div>

          {/* Key Takeaways / Highlights */}
          {item.keyPoints && item.keyPoints.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                <Sparkles size={15} className="text-accent" /> Key Takeaways
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-950">
                {item.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Linked Relevant Courses */}
          {linkedCourses.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-primary" /> Related Courses & Certifications
                </span>
                <span className="text-xs text-gray-400">
                  {linkedCourses.length} available
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedCourses.map(course => (
                  <div 
                    key={course.id} 
                    className="p-3.5 bg-white border border-gray-200 rounded-xl hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {course.code || 'COURSE'}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {course.duration || 'Flexible'}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-secondary group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
                      <span className="text-xs font-black text-secondary">
                        {course.price > 0 ? `₱${course.price.toLocaleString()}` : 'Free / TBA'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onInquireCourse(course)}
                          className="text-[11px] h-7 px-2 py-0 rounded-lg"
                        >
                          Inquire
                        </Button>
                        <Link 
                          to={`/courses/${course.id}`} 
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline h-7 px-2"
                        >
                          Details <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer & Helpful Voting */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Was this article helpful?</span>
              <button 
                onClick={() => handleVote('yes')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                  helpfulStatus === 'yes'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    : 'hover:bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                <ThumbsUp size={13} className={helpfulStatus === 'yes' ? 'fill-emerald-700' : ''} />
                <span>Yes ({helpfulCount})</span>
              </button>
              <button 
                onClick={() => handleVote('no')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                  helpfulStatus === 'no'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                    : 'hover:bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                <ThumbsDown size={13} className={helpfulStatus === 'no' ? 'fill-rose-700' : ''} />
                <span>No</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck size={14} className="text-accent" /> Verified by Skylar Academic & Compliance Team
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openArticleIndex, setOpenArticleIndex] = useState<number | null>(0); // First open by default

  // Inquire Modal State
  const [inquireCourse, setInquireCourse] = useState<Course | null>(null);
  const [isInquireModalOpen, setIsInquireModalOpen] = useState(false);

  useEffect(() => {
    const loadContent = () => {
      const content = getPageContent('faq');
      if (content) setPageContent(content);
      setCourses(getCourses());
    };
    loadContent();
    window.addEventListener('sitePagesUpdated', loadContent);
    window.addEventListener('coursesUpdated', loadContent);
    return () => {
      window.removeEventListener('sitePagesUpdated', loadContent);
      window.removeEventListener('coursesUpdated', loadContent);
    };
  }, []);

  // Sync URL search query param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, []);

  const coursesMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach(c => map.set(c.id, c));
    return map;
  }, [courses]);

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const faqList = pageContent?.sections.find(s => s.id === 'faq_list')?.data;
  const allItems: PageSectionItem[] = faqList?.items || [];

  // Extract Categories with count
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allItems.length };
    allItems.forEach(item => {
      const cat = item.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allItems]);

  const categories = Object.keys(categoriesWithCounts);

  // Popular search suggestions
  const popularKeywords = ['GWO BST', 'WINDA ID', 'Advanced Rescue', 'Medical Fitness', 'PPE & Boots', 'Refund Policy', 'Corporate Packages'];

  // Filter items based on active category and search
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (!item) return false;
      
      // Category Filter
      if (selectedCategory !== 'All') {
        const itemCat = item.category || 'General';
        if (itemCat !== selectedCategory) return false;
      }

      // Search Query
      const q = (searchQuery || '').toLowerCase().trim();
      if (!q) return true;

      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      const tagMatch = (item.tags || []).some(t => t.toLowerCase().includes(q));
      const keyPointsMatch = (item.keyPoints || []).some(k => k.toLowerCase().includes(q));
      const catMatch = (item.category || '').toLowerCase().includes(q);

      // Check if matches related course names
      const relatedCourseMatch = (item.relatedCourseIds || []).some(cId => {
        const c = coursesMap.get(cId);
        return c && (c.title.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q));
      });

      return titleMatch || descMatch || tagMatch || keyPointsMatch || catMatch || relatedCourseMatch;
    });
  }, [allItems, selectedCategory, searchQuery, coursesMap]);

  const heroBg = hero?.image || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920';

  const handleOpenInquire = (course: Course) => {
    setInquireCourse(course);
    setIsInquireModalOpen(true);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'GWO Standards & Syllabi':
        return <Award size={15} className="shrink-0 text-accent" />;
      case 'WINDA & Certifications':
        return <ShieldCheck size={15} className="shrink-0 text-blue-400" />;
      case 'Enrolment & Payment':
        return <CreditCard size={15} className="shrink-0 text-emerald-400" />;
      case 'Prerequisites & Medical':
        return <FileCheck size={15} className="shrink-0 text-purple-400" />;
      case 'Training Gear & PPE':
        return <Sparkles size={15} className="shrink-0 text-amber-400" />;
      case 'Facilities & Logistics':
        return <MapPin size={15} className="shrink-0 text-rose-400" />;
      case 'Corporate & Group Booking':
        return <Users size={15} className="shrink-0 text-indigo-400" />;
      case 'Policies & Compliance':
        return <BookOpen size={15} className="shrink-0 text-teal-400" />;
      default:
        return <Layers size={15} className="shrink-0" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* ─── Premium Knowledge Base Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Knowledge Base Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-[#0b1e36]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-[110px] pb-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2.5 mb-5 animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  <BookOpen size={13} /> Knowledge Base & Help Hub
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  <ShieldCheck size={13} className="text-accent" /> GWO Standards & Policies
                </span>
              </div>

              <h1
                className="font-heading font-bold text-white mb-4 drop-shadow-lg"
                style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', lineHeight: '1.2' }}
              >
                Find Answers & <span className="text-accent">Knowledge Resources</span>
              </h1>
              
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed mb-6 text-sm md:text-base">
                Explore in-depth documentation on GWO safety certifications, training syllabi, WINDA authentication, enrollment procedures, and venue facilities.
              </p>

              {/* Instant Search Bar */}
              <div className="relative max-w-2xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search questions, course codes, WINDA guidelines, or keywords (e.g. BST, medical, PPE)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-28 py-3.5 bg-white/95 text-gray-900 rounded-2xl font-medium placeholder-gray-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-accent/40 focus:bg-white transition-all text-sm"
                  />
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="absolute right-4 text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg hidden sm:block">
                      {allItems.length} Articles
                    </span>
                  )}
                </div>

                {/* Popular Search Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-gray-300">
                  <span className="font-semibold text-gray-400 flex items-center gap-1">
                    <Filter size={12} /> Popular:
                  </span>
                  {popularKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(kw)}
                      className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-accent hover:text-secondary border border-white/20 text-gray-200 transition-all text-[11px]"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Layout ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Main Column: FAQ & Articles */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category Filter Navigation Bar */}
            <div className="bg-white p-2 md:p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenArticleIndex(0);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-white shadow-sm ring-2 ring-secondary/20'
                        : 'text-gray-600 hover:text-secondary hover:bg-gray-100'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-accent text-secondary' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {categoriesWithCounts[cat]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Showing <strong className="text-secondary">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'article' : 'articles'} 
                {selectedCategory !== 'All' && <> in <strong className="text-primary">{selectedCategory}</strong></>}
                {searchQuery && <> matching "<strong className="text-secondary">{searchQuery}</strong>"</>}
              </span>

              {(searchQuery || selectedCategory !== 'All') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  View All Categories
                </button>
              )}
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <FAQArticle
                    key={idx}
                    item={item}
                    coursesMap={coursesMap}
                    onInquireCourse={handleOpenInquire}
                    isOpen={openArticleIndex === idx}
                    onToggle={() => setOpenArticleIndex(openArticleIndex === idx ? null : idx)}
                  />
                ))
              ) : (
                <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-accent flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <HelpCircle size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-secondary mb-1">
                    No articles found
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                    We couldn't find any questions matching "{searchQuery}". Try using different terms or contact our support team directly.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                    >
                      Clear Search
                    </Button>
                    <Button 
                      onClick={() => {
                        setInquireCourse(null);
                        setIsInquireModalOpen(true);
                      }}
                    >
                      Ask Our Team
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Course Discovery Banner */}
            <div className="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-secondary to-[#162a45] text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 mb-3">
                  <Award size={13} /> Certified Training Programs
                </span>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-white mb-2">
                  Ready to start your GWO Safety Certification?
                </h3>
                <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                  Explore all our certified courses with immediate date schedules, comprehensive syllabi, and transparent pricing.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/courses">
                    <Button variant="primary" className="bg-accent text-secondary hover:bg-yellow-400 font-bold text-sm">
                      Explore All Courses <ArrowRight size={15} className="ml-1" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-white/40 text-white hover:bg-white/10 text-sm"
                    onClick={() => {
                      setInquireCourse(null);
                      setIsInquireModalOpen(true);
                    }}
                  >
                    Request Corporate Prospectus
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Support & Quick Navigation Widget */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Direct Inquire & Support Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-secondary">
                    Still have questions?
                  </h4>
                  <p className="text-xs text-gray-500">
                    Our student support team is ready to help.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Whether you need corporate booking quotes, prerequisite verifications, or accommodation assistance, reach out to us directly.
              </p>

              <div className="space-y-3">
                <Button 
                  className="w-full justify-center text-sm font-bold bg-accent text-secondary hover:bg-yellow-400"
                  onClick={() => {
                    setInquireCourse(null);
                    setIsInquireModalOpen(true);
                  }}
                >
                  <Mail size={15} className="mr-2" /> Inquire / Contact Support
                </Button>

                <Link to="/contact" className="block">
                  <Button variant="outline" className="w-full justify-center text-xs font-semibold">
                    View Contact Details & Map
                  </Button>
                </Link>
              </div>

              {/* Quick Contact Specs */}
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span>Angeles City Training Centre, Pampanga</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-primary shrink-0" />
                  <span>Mon – Sat: 8:00 AM – 5:00 PM PHT</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-accent shrink-0" />
                  <span>GWO Certified Training Provider</span>
                </div>
              </div>
            </div>

            {/* Quick WINDA Registration Guide Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                <FileCheck size={16} className="text-primary" /> WINDA Registration
              </div>
              <h4 className="font-heading font-bold text-sm text-secondary mb-2">
                First Time GWO Trainee?
              </h4>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Before your first day of training, you must register a personal profile on the Global Wind Organisation portal to get your unique WINDA ID.
              </p>
              <a 
                href="https://winda.globalwindsafety.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-white px-3 py-2 rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-all"
              >
                Open GWO WINDA Portal <ExternalLink size={13} />
              </a>
            </div>

            {/* Fast Category Directory */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Topic Navigation
              </h4>
              <ul className="space-y-1.5 text-xs">
                {categories.filter(c => c !== 'All').map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenArticleIndex(0);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors text-left"
                    >
                      <span className="font-medium">{cat}</span>
                      <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                        {categoriesWithCounts[cat]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Inquire Modal Component */}
      <InquireModal 
        isOpen={isInquireModalOpen}
        onClose={() => {
          setIsInquireModalOpen(false);
          setInquireCourse(null);
        }}
        initialCourseId={inquireCourse?.id}
        initialCourseTitle={inquireCourse?.title}
      />
    </div>
  );
};
