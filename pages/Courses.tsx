
import React, { useState, useEffect } from 'react';
import { Search, Filter, Wind, HardHat, LifeBuoy, Flame, HeartPulse, ShieldCheck, Zap, LayoutGrid, ChevronLeft, ChevronRight, X, Layers, Clock, DollarSign } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { CourseCategory, Course } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCourses, getPageContent } from '../services/storageService';
import { Button } from '../components/Button';
import { Link, useSearchParams } from 'react-router-dom';

// Default slides in case CMS data is missing
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "Our Courses",
    subtitle: "Browse our extensive range of accredited qualifications and short courses designed for industry.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920", // Wind Turbines
  },
  {
    id: 2,
    title: "GWO Certified Training",
    subtitle: "World-class safety training for the global wind energy sector.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1920", // Wind Turbines Sunset
  },
  {
    id: 3,
    title: "High Risk Work Licensing",
    subtitle: "Get licensed for Dogging, Rigging, and Forklift operations with expert trainers.",
    image: "https://images.unsplash.com/photo-1581094794329-cd282ad7ff52?auto=format&fit=crop&q=80&w=1920", // Construction
  }
];

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [introContent, setIntroContent] = useState<any>(null);
  const [ctaContent, setCtaContent] = useState<any>(null);
  const [searchParams] = useSearchParams();
  
  // Filters
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [filterDuration, setFilterDuration] = useState<string>('All');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
    
    // Check URL params for category filter
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
        setSelectedCategory(categoryParam);
    }

    // Load dynamic content from CMS
    const pageContent = getPageContent('courses');
    if (pageContent) {
        const heroSection = pageContent.sections.find(s => s.id === 'hero');
        if (heroSection?.data?.items && heroSection.data.items.length > 0) {
            // Map CMS items to Slide format
            const slides = heroSection.data.items.map((item, idx) => ({
                id: idx,
                title: item.title,
                subtitle: item.description,
                image: item.image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920"
            }));
            setHeroSlides(slides);
        }

        const introSection = pageContent.sections.find(s => s.id === 'intro');
        if (introSection) setIntroContent(introSection.data);

        const ctaSection = pageContent.sections.find(s => s.id === 'cta');
        if (ctaSection) setCtaContent(ctaSection.data);
    }
  }, [searchParams]);

  const categories = ['All', ...Object.values(CourseCategory)];
  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level)))];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    // Price Range Logic
    let matchesPrice = true;
    if (filterPriceRange === 'Low') matchesPrice = course.price < 500;
    if (filterPriceRange === 'Medium') matchesPrice = course.price >= 500 && course.price <= 1500;
    if (filterPriceRange === 'High') matchesPrice = course.price > 1500;

    // Duration Logic (Heuristic based on string content)
    let matchesDuration = true;
    const d = course.duration.toLowerCase();
    if (filterDuration === 'Short') {
        matchesDuration = d.includes('1 day') || d.includes('2 days') || d.includes('hour');
    } else if (filterDuration === 'Medium') {
        matchesDuration = d.includes('3 days') || d.includes('4 days') || d.includes('5 days') || d.includes('week');
    } else if (filterDuration === 'Long') {
        matchesDuration = d.includes('month') || (d.includes('days') && parseInt(d) > 5);
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesDuration;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case CourseCategory.GWO: return <Wind size={16} />;
      case CourseCategory.CONSTRUCTION: return <HardHat size={16} />;
      case CourseCategory.RESCUE: return <LifeBuoy size={16} />;
      case CourseCategory.SAFETY: return <Flame size={16} />;
      case CourseCategory.FIRST_AID: return <HeartPulse size={16} />;
      case CourseCategory.WORKSAFE: return <ShieldCheck size={16} />;
      case CourseCategory.ELECTRICAL: return <Zap size={16} />;
      default: return <LayoutGrid size={16} />;
    }
  };

  return (
    <div className="bg-surface min-h-screen pb-24">
      <Breadcrumbs />
      
      {/* Hero Header with Static Background Image */}
      <div className="relative h-[380px] overflow-hidden bg-secondary border-b-4 border-accent pt-[80px]">
        {/* Background Image Layer */}
        {heroSlides[0] && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroSlides[0].image} 
              alt={heroSlides[0].title} 
              className="w-full h-full object-cover" 
            />
            {/* Double Overlay for supreme text readability */}
            <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95"></div>
          </div>
        )}

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col justify-center z-10 pt-[110px]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl">
              <div className="animate-fade-in-up">
                {/* Accent Badges */}
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                    ★ 4.9/5 Rating
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                    GWO Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                    WorkSafe Approved
                  </span>
                </div>
                
                <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: '50px' }}>
                  Training <span className="text-accent">Courses</span>
                </h1>
                <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm"></div>
                <p className="text-gray-200 drop-shadow-md font-medium max-w-2xl leading-relaxed" style={{ fontSize: '18px' }}>
                  Explore our comprehensive range of safety training programs designed to elevate your skills in the wind energy and industrial sectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Overlapping Container */}
      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20">
        

        {/* Redesigned Floating Controls Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-12 border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
           {/* Search Input */}
           <div className="relative w-full lg:w-96 flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
              />
           </div>

           {/* Filter controls and layout toggle */}
           <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto lg:justify-end">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-bold border-r border-gray-100 pr-4">
                 <Filter size={16} className="text-gray-400" />
                 <span>Filters:</span>
              </div>

              {/* Category Dropdown */}
              <select 
                 className="bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 outline-none cursor-pointer px-4 py-3 rounded-xl min-w-[160px]"
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
              >
                 {categories.map(cat => (
                   <option key={cat} value={cat}>
                     {cat === 'All' ? 'All Category' : cat}
                   </option>
                 ))}
              </select>

              {/* Level Dropdown */}
              <select 
                 className="bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 outline-none cursor-pointer px-4 py-3 rounded-xl min-w-[140px]"
                 value={selectedLevel}
                 onChange={(e) => setSelectedLevel(e.target.value)}
              >
                 {levels.map(level => (
                   <option key={level} value={level}>
                     {level === 'All' ? 'All Level' : level}
                   </option>
                 ))}
              </select>

              {/* Layout Mode Toggles */}
              <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50 ml-auto lg:ml-0">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-650'}`}
                   aria-label="Grid view"
                 >
                   <LayoutGrid size={18} />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-gray-655'}`}
                   aria-label="List view"
                 >
                   <Layers size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Results Section */}
        {filteredCourses.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
                  <img src={course.image} alt={course.title} className="w-full md:w-64 h-48 md:h-36 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-[4px] inline-block mb-2">{course.category}</span>
                      <h3 className="text-xl font-bold text-secondary mb-2 hover:text-primary transition-colors">
                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.shortDescription}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                      <div className="flex gap-6 text-sm font-semibold text-gray-650">
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" />{course.duration}</span>
                        <span className="flex items-center gap-1.5 text-primary text-base font-bold"><DollarSign size={16} className="text-gray-400" />{course.price}</span>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm" className="px-6 rounded-lg text-xs font-bold">View Details</Button>
                        </Link>
                        <Button size="sm" className="px-6 rounded-lg text-xs font-bold bg-secondary text-white hover:bg-primary" onClick={() => addToCart(course.id)}>Add to Cart</Button>
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
            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLevel('All'); setFilterDuration('All'); setFilterPriceRange('All'); }}
              className="px-8 py-3"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* CTA Section from CMS */}
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