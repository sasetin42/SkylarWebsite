
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
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920", // Industrial
  },
  {
    id: 2,
    title: "GWO Certified Training",
    subtitle: "World-class safety training for the global wind energy sector.",
    image: "https://images.unsplash.com/photo-1515658323427-8554106ec904?auto=format&fit=crop&q=80&w=1920", // Wind
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
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Slider Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

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
      
      {/* Hero Slider with Slide Transition */}
      <div className="relative h-[450px] overflow-hidden bg-secondary border-b-4 border-accent group">
        
        {/* Sliding Background Layer */}
        <div 
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover" 
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
            </div>
          ))}
        </div>

        {/* Sticky/Stationary Content Layer with Fade Transition */}
        <div className="absolute inset-0 flex flex-col justify-center z-10 pointer-events-none">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl">
              <div key={currentSlide} className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg">
                  {heroSlides[currentSlide].title}
                </h1>
                <div className="w-24 h-1.5 bg-accent mb-6 rounded-full shadow-sm"></div>
                <p className="text-xl text-gray-200 drop-shadow-md font-medium">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-accent hover:text-secondary transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300 z-20 border border-white/20 hover:border-transparent"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-accent hover:text-secondary transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300 z-20 border border-white/20 hover:border-transparent"
          aria-label="Next Slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 shadow-md ${
                idx === currentSlide ? 'bg-accent w-10' : 'bg-white/40 w-2.5 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content - Overlapping Container */}
      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Intro Section from CMS */}
        {introContent && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-8 border-accent animate-fade-in-up">
                <h2 className="text-3xl font-heading font-bold text-secondary mb-3">{introContent.heading}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{introContent.description}</p>
            </div>
        )}

        {/* Floating Controls Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
          
          {/* Top Row: Categories */}
          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter size={14}/> Filter By Category
            </h3>
            <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border ${
                    selectedCategory === cat 
                        ? 'bg-primary text-white shadow-lg border-primary transform -translate-y-0.5' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                >
                    {selectedCategory === cat && getCategoryIcon(cat)}
                    {cat === 'All' && selectedCategory !== 'All' ? 'All Categories' : cat}
                </button>
                ))}
            </div>
          </div>

          {/* Second Row: Search & Extended Filters */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center pt-6">
             
             {/* Search */}
             <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
             </div>

             {/* Filter Controls Group */}
             <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                
                {/* Level Filter */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-2 px-4">
                    <Layers size={16} className="text-gray-400"/>
                    <select 
                        className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer w-full md:w-auto"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        {levels.map(level => <option key={level} value={level}>{level === 'All' ? 'All Levels' : level}</option>)}
                    </select>
                </div>

                {/* Duration Filter */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-2 px-4">
                    <Clock size={16} className="text-gray-400"/>
                    <select 
                        className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer w-full md:w-auto"
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value)}
                    >
                        <option value="All">Any Duration</option>
                        <option value="Short">Short (1-2 Days)</option>
                        <option value="Medium">Medium (3-5 Days)</option>
                        <option value="Long">Long (Weeks+)</option>
                    </select>
                </div>

                {/* Price Filter */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-2 px-4">
                    <DollarSign size={16} className="text-gray-400"/>
                    <select 
                        className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer w-full md:w-auto"
                        value={filterPriceRange}
                        onChange={(e) => setFilterPriceRange(e.target.value)}
                    >
                        <option value="All">Any Price</option>
                        <option value="Low">Low (&lt; $500)</option>
                        <option value="Medium">Medium ($500 - $1.5k)</option>
                        <option value="High">High (&gt; $1.5k)</option>
                    </select>
                </div>

                <Button 
                    variant={showFilters ? 'primary' : 'outline'}
                    className="px-4 py-2.5 whitespace-nowrap hidden" // Hidden but kept for future expansion
                    onClick={() => setShowFilters(!showFilters)}
                >
                    More Filters
                </Button>
             </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
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