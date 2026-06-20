import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, Users, Award, Briefcase, Fan, Zap, BookOpen,
  ChevronRight, ChevronLeft, HardHat, ShieldCheck, Target, Eye,
  Heart, Search, Calendar, ArrowRight, Star, Globe, TrendingUp,
  GraduationCap, FileText, Mail, Phone, Clock, MapPin, LifeBuoy,
  AlertCircle, X, Send
} from 'lucide-react';
import { Button } from '../components/Button';
import { CourseCard } from '../components/CourseCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { TESTIMONIALS, BLOG_POSTS, LOCATIONS } from '../constants';
import { getCourses, getPageContent, saveTicket } from '../services/storageService';
import { Course, SitePage } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  robot?: string;
}

interface NewsletterForm {
  email: string;
}

const SITE_PAGES = [
  { id: 'about', title: 'About Skylar Education', path: '/about', description: 'Learn about our mission, values, and wind energy training expertise.', tags: 'about us team history safety company' },
  { id: 'gwo-benefits', title: 'GWO Certification Benefits', path: '/about/gwo-benefits', description: 'Why GWO certifications are critical for global wind energy careers.', tags: 'gwo benefit advantage industry wind safety' },
  { id: 'team', title: 'Our Training Instructors & Team', path: '/about/team', description: 'Meet the expert GWO and safety instructors at Skylar.', tags: 'team members staff trainers instructors experts' },
  { id: 'locations', title: 'Skylar Campus Locations', path: '/locations', description: 'Find our state-of-the-art training facilities and campus contacts.', tags: 'campus locations map melbourne sydney brisbane perth adelaide addresses' },
  { id: 'news', title: 'Industry Insights & News', path: '/news', description: 'Stay updated with renewable energy trends, training tips, and news.', tags: 'blog news insights articles updates safety standards' },
  { id: 'usi', title: 'USI Information', path: '/student-info/usi', description: 'How to register or find your Unique Student Identifier (USI).', tags: 'usi student identifier unique number registration identity' },
  { id: 'refund-policy', title: 'Fees and Refund Policy', path: '/student-info/refund-policy', description: 'Review our course fees, cooling-off periods, and refund procedures.', tags: 'refund policy fees payment cancellation terms condition' },
  { id: 'privacy-notice', title: 'Student Privacy Notice', path: '/student-info/privacy-notice', description: 'How Skylar Education protects your personal information and student records.', tags: 'privacy notice data protection policy student files security' },
  { id: 'online-enrolments', title: 'Online Enrolments Guide', path: '/student-info/online-enrolments', description: 'Step-by-step guide to enrolling online and submitting required identity documents.', tags: 'enrollment online process register application identity upload' },
  { id: 'complaints', title: 'Complaints & Appeals Policy', path: '/student-info/complaints', description: 'Our commitment to a fair and transparent complaints resolution process.', tags: 'complaints appeals dispute resolution feedback issue support' },
  { id: 'faq', title: 'Frequently Asked Questions (FAQ)', path: '/student-info/faq', description: 'Answers to common questions about GWO training, course bookings, and prerequisites.', tags: 'faq questions answers help support wind certification requirement' },
  { id: 'contact', title: 'Contact Us', path: '/contact', description: 'Get in touch with our training coordinators, support team, or request a quote.', tags: 'contact email phone support map message quote inquiry office' }
];

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [pageContent, setPageContent] = useState<SitePage | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState<'all' | 'courses' | 'insights' | 'locations' | 'pages'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle');
  const [imageLoads, setImageLoads] = useState<Record<string, boolean>>({});

  const fanRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const courses = getCourses();
    setFeaturedCourses(courses.slice(0, 8));
    const content = getPageContent('home');
    if (content) setPageContent(content);
  }, []);

  useEffect(() => {
    const cmsHero = pageContent?.sections.find(s => s.id === 'hero')?.data;
    if (cmsHero?.items && cmsHero.items.length > 0) {
      setSlides(cmsHero.items.map((item: any, idx: number) => ({
        id: idx + 1,
        image: item.image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
        heading: item.title || "Safety Training Specialists",
        description: item.description || "",
        buttonText: item.buttonText || "View All Courses",
        buttonLink: item.buttonLink || "/courses"
      })));
    } else {
      const defaultSlides = [
        {
          id: 1,
          image: cmsHero?.image || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
          heading: cmsHero?.heading || "Safety Training Specialists",
          description: cmsHero?.description || "Australia's premier provider of GWO, High Risk Work, and Industrial Safety training.",
          buttonText: cmsHero?.buttonText || "View All Courses",
          buttonLink: cmsHero?.buttonLink || "/courses"
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920",
          heading: "GWO Global Standards",
          description: "Internationally recognised safety training for the wind energy sector.",
          buttonText: "View GWO Courses",
          buttonLink: "/courses?category=GWO"
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920",
          heading: "High Risk Work Licensing",
          description: "Get licensed for Dogging, Rigging, and Forklift operations with expert trainers.",
          buttonText: "View Construction",
          buttonLink: "/courses?category=Construction"
        }
      ];
      setSlides(defaultSlides);
    }
  }, [pageContent]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % slides.length), [slides.length]);
  const prevSlide = useCallback(() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        if (fanRef.current) {
          fanRef.current.style.transform = `rotate(${window.scrollY * 0.4}deg)`;
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(heroSearch)}`);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!isRobotChecked) errors.robot = 'Please verify that you are not a robot';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setContactStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 1200));
    try {
      const ticketId = 'ticket-' + Date.now();
      const dateStr = new Date().toISOString().split('T')[0];
      saveTicket({
        id: ticketId,
        studentId: `guest|${formData.name.trim()}|${formData.email.trim()}`,
        subject: `Home Contact Form Inquiry`,
        message: formData.message.trim(),
        status: 'Open',
        priority: 'Medium',
        dateCreated: dateStr,
        lastUpdated: dateStr
      });
      setContactStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsRobotChecked(false);
    } catch (err) {
      setContactStatus('error');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const handleImageLoad = (key: string) => {
    setImageLoads(prev => ({ ...prev, [key]: true }));
  };

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results in real-time
  const searchResults = React.useMemo(() => {
    const query = heroSearch.trim().toLowerCase();
    if (!query) return null;

    const allCourses = getCourses();
    const matchedCourses = allCourses.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.shortDescription.toLowerCase().includes(query) || 
      c.fullDescription.toLowerCase().includes(query) || 
      c.category.toLowerCase().includes(query)
    );

    // Extract categories
    const categories = Array.from(new Set(allCourses.map(c => c.category)));
    const matchedCategories = categories.filter(cat => 
      cat.toLowerCase().includes(query)
    );

    // Filter BLOG_POSTS (Insights)
    const matchedInsights = BLOG_POSTS.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );

    // Filter LOCATIONS
    const matchedLocations = LOCATIONS.filter(loc =>
      loc.name.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query) ||
      loc.state.toLowerCase().includes(query)
    );

    // Filter SITE_PAGES
    const matchedPages = SITE_PAGES.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.toLowerCase().includes(query)
    );

    return {
      courses: matchedCourses,
      categories: matchedCategories,
      insights: matchedInsights,
      locations: matchedLocations,
      pages: matchedPages,
      hasResults: matchedCourses.length > 0 || matchedCategories.length > 0 || matchedInsights.length > 0 || matchedLocations.length > 0 || matchedPages.length > 0
    };
  }, [heroSearch]);

  const accreditation = pageContent?.sections.find(s => s.id === 'accreditation')?.data;
  const coursesIntro = pageContent?.sections.find(s => s.id === 'courses_intro')?.data;

  return (
    <div className="animate-fade-in bg-surface">
      <div className="relative">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-[80vh] min-h-[600px] max-h-[850px] flex items-center overflow-hidden group border-b-4 border-accent bg-secondary" aria-label="Hero Slider">
          {/* Sliding Background Layer */}
          <div
            className="absolute inset-0 flex transition-transform duration-1100 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div key={idx} className="min-w-full h-full relative">
                {/* Loading Skeleton */}
                {!imageLoads[`slide-${idx}`] && (
                  <div className="absolute inset-0 bg-gray-900 animate-pulse z-10" />
                )}
                <img
                  src={slide.image}
                  alt={slide.heading}
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoads[`slide-${idx}`] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                  onLoad={() => handleImageLoad(`slide-${idx}`)}
                />
                {/* Multi-layer overlay for depth and readability */}
                <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95"></div>
              </div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 md:px-8 relative z-20 text-white w-full">
            <div className="max-w-5xl">
              {slides.length > 0 && (
                <div key={currentSlide} className="space-y-6 md:space-y-8 animate-fade-in-up">
                  {/* Main Heading */}
                  <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                    {slides[currentSlide].heading}
                  </h1>

                  {/* Yellow Accent Divider */}
                  <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm"></div>

                  {/* Description */}
                  <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                    {slides[currentSlide].description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2 pointer-events-auto">
                    <Link to={slides[currentSlide].buttonLink} className="w-full sm:w-auto">
                      <Button
                        variant="secondary"
                        className="w-full px-8 py-3.5 rounded-xl shadow-xl shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-accent/30 text-sm md:text-base"
                      >
                        {slides[currentSlide].buttonText}
                      </Button>
                    </Link>
                    <Link to="/contact" className="w-full sm:w-auto">
                      <Button
                        variant="glass"
                        className="w-full px-8 py-3.5 font-bold rounded-xl transition-all duration-300 text-sm md:text-base border-2 border-white/30 hover:bg-white hover:text-secondary hover:border-white"
                      >
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slide Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white backdrop-blur-lg hover:bg-accent hover:text-secondary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0 z-30 border border-white/20 hover:border-accent shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white backdrop-blur-lg hover:bg-accent hover:text-secondary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0 z-30 border border-white/20 hover:border-accent shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight size={28} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-500 shadow-lg ${
                  idx === currentSlide
                    ? 'bg-accent w-10 h-2.5 shadow-accent/40'
                    : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Floating Search Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-50 translate-y-1/2 px-4 md:px-8 pointer-events-none">
          <div ref={searchContainerRef} className="container mx-auto max-w-5xl pointer-events-auto relative">
            <form onSubmit={handleHeroSearch} className="bg-white rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] border border-gray-100 p-2 md:p-3 flex flex-col md:flex-row gap-3 ring-1 ring-black/5">
              <div className="flex-grow relative group flex items-center">
                <div className="absolute left-4 md:left-5 bg-gray-100 p-2.5 rounded-xl text-gray-500 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all duration-300">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => {
                    setHeroSearch(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="What training do you need?"
                  className="w-full pl-16 md:pl-20 pr-10 py-4 md:py-5 bg-transparent focus:outline-none text-base md:text-lg text-gray-900 placeholder-gray-400 font-semibold"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearch('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="bg-secondary text-white px-10 md:px-14 py-4 md:py-5 rounded-xl h-auto shadow-lg hover:bg-primary text-base md:text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl w-full md:w-auto"
              >
                Search Courses
              </Button>
            </form>

            {/* Live Search Popup */}
            {showSearchResults && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 p-5 md:p-6 z-50 text-left max-h-[520px] overflow-y-auto flex flex-col gap-5">
                {!searchResults.hasResults ? (
                  <div className="py-10 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-bounce" />
                    <p className="text-gray-600 font-semibold text-lg">No results found for "{heroSearch}"</p>
                    <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">Try searching for generic terms like GWO, Safety, Working at Heights, Melbourne, or USI.</p>
                  </div>
                ) : (
                  <>
                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-3 -mx-1 px-1">
                      <button
                        type="button"
                        onClick={() => setActiveSearchTab('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeSearchTab === 'all'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-secondary'
                        }`}
                      >
                        All
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeSearchTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {searchResults.courses.length + searchResults.insights.length + searchResults.locations.length + searchResults.pages.length}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSearchTab('courses')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeSearchTab === 'courses'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-secondary'
                        }`}
                      >
                        Courses
                        {searchResults.courses.length > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeSearchTab === 'courses' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {searchResults.courses.length}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSearchTab('insights')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeSearchTab === 'insights'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-secondary'
                        }`}
                      >
                        Insights
                        {searchResults.insights.length > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeSearchTab === 'insights' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {searchResults.insights.length}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSearchTab('locations')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeSearchTab === 'locations'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-secondary'
                        }`}
                      >
                        Locations
                        {searchResults.locations.length > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeSearchTab === 'locations' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {searchResults.locations.length}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSearchTab('pages')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeSearchTab === 'pages'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-secondary'
                        }`}
                      >
                        Info Pages
                        {searchResults.pages.length > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeSearchTab === 'pages' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {searchResults.pages.length}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-6 pt-1">
                      {/* Course Categories (only shown in 'all' or 'courses') */}
                      {(activeSearchTab === 'all' || activeSearchTab === 'courses') && searchResults.categories.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 pb-1 border-b border-gray-100 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" /> Course Categories
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {searchResults.categories.map((cat, index) => (
                              <Link
                                key={index}
                                to={`/courses?category=${cat}`}
                                onClick={() => setShowSearchResults(false)}
                                className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-gray-700 hover:text-primary transition-all text-xs font-bold"
                              >
                                {cat} Training
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Courses Section */}
                      {(activeSearchTab === 'all' || activeSearchTab === 'courses') && searchResults.courses.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 pb-1 border-b border-gray-100 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> Courses ({searchResults.courses.length})
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {searchResults.courses.slice(0, activeSearchTab === 'all' ? 4 : 10).map((course) => (
                              <Link
                                key={course.id}
                                to={`/courses/${course.id}`}
                                onClick={() => setShowSearchResults(false)}
                                className="group p-2 -mx-2 rounded-xl hover:bg-gray-50 flex items-center gap-4 transition-all duration-200 border border-transparent hover:border-gray-100/70"
                              >
                                <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                                  <img
                                    src={course.image}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="text-left flex-grow min-w-0 pr-2">
                                  <div className="font-bold text-secondary text-sm group-hover:text-primary transition-colors line-clamp-1">
                                    {course.title}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-500 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded tracking-wide">
                                      {course.category.split(' ')[0]}
                                    </span>
                                    {course.duration && (
                                      <span className="flex items-center gap-0.5">
                                        <Clock className="w-3 h-3 shrink-0" /> {course.duration}
                                      </span>
                                    )}
                                    {course.level && <span>• {course.level}</span>}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right pr-2">
                                  <div className="text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full uppercase">
                                    View
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {activeSearchTab === 'all' && searchResults.courses.length > 4 && (
                              <button
                                type="button"
                                onClick={() => setActiveSearchTab('courses')}
                                className="text-xs font-bold text-primary hover:text-secondary transition-colors self-start pl-1 flex items-center gap-0.5 mt-1"
                              >
                                See all {searchResults.courses.length} courses <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Insights Section */}
                      {(activeSearchTab === 'all' || activeSearchTab === 'insights') && searchResults.insights.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 pb-1 border-b border-gray-100 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Industry Insights & Blog ({searchResults.insights.length})
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {searchResults.insights.slice(0, activeSearchTab === 'all' ? 3 : 8).map((post) => (
                              <Link
                                key={post.id}
                                to="/news"
                                onClick={() => setShowSearchResults(false)}
                                className="group p-2 -mx-2 rounded-xl hover:bg-gray-50 flex items-center gap-4 transition-all duration-200 border border-transparent hover:border-gray-100/70"
                              >
                                <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                                  <img
                                    src={post.image}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    alt=""
                                  />
                                </div>
                                <div className="text-left flex-grow min-w-0 pr-2">
                                  <div className="font-bold text-secondary text-sm group-hover:text-primary transition-colors line-clamp-1">
                                    {post.title}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    <span className="bg-accent/10 text-accent font-bold uppercase text-[9px] px-1.5 py-0.5 rounded tracking-wide">
                                      {post.category}
                                    </span>
                                    {post.date && (
                                      <span className="flex items-center gap-0.5">
                                        <Calendar className="w-3 h-3 shrink-0" /> {post.date}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right pr-2">
                                  <div className="text-xs font-bold text-accent bg-accent/5 border border-accent/10 px-2.5 py-1 rounded-full uppercase">
                                    Read
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {activeSearchTab === 'all' && searchResults.insights.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setActiveSearchTab('insights')}
                                className="text-xs font-bold text-primary hover:text-secondary transition-colors self-start pl-1 flex items-center gap-0.5 mt-1"
                              >
                                See all {searchResults.insights.length} articles <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Locations Section */}
                      {(activeSearchTab === 'all' || activeSearchTab === 'locations') && searchResults.locations.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 pb-1 border-b border-gray-100 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Training Campus Locations ({searchResults.locations.length})
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {searchResults.locations.slice(0, activeSearchTab === 'all' ? 2 : 6).map((loc) => (
                              <Link
                                key={loc.id}
                                to={`/locations/${loc.id}`}
                                onClick={() => setShowSearchResults(false)}
                                className="group p-2 -mx-2 rounded-xl hover:bg-gray-50 flex items-center gap-4 transition-all duration-200 border border-transparent hover:border-gray-100/70"
                              >
                                <div className="w-16 h-10 md:w-20 md:h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border border-gray-100">
                                  <img
                                    src={loc.image}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    alt=""
                                  />
                                </div>
                                <div className="text-left flex-grow min-w-0 pr-2">
                                  <div className="font-bold text-secondary text-sm group-hover:text-primary transition-colors line-clamp-1">
                                    {loc.name}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2 truncate">
                                    <span className="bg-secondary/10 text-secondary font-bold uppercase text-[9px] px-1.5 py-0.5 rounded tracking-wide shrink-0">
                                      {loc.state}
                                    </span>
                                    <span className="truncate">{loc.address}</span>
                                  </div>
                                </div>
                                <div className="shrink-0 text-right pr-2">
                                  <div className="text-xs font-bold text-secondary bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full uppercase">
                                    Map
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {activeSearchTab === 'all' && searchResults.locations.length > 2 && (
                              <button
                                type="button"
                                onClick={() => setActiveSearchTab('locations')}
                                className="text-xs font-bold text-primary hover:text-secondary transition-colors self-start pl-1 flex items-center gap-0.5 mt-1"
                              >
                                See all {searchResults.locations.length} campus locations <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Info Pages Section */}
                      {(activeSearchTab === 'all' || activeSearchTab === 'pages') && searchResults.pages.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 pb-1 border-b border-gray-100 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" /> Information Pages ({searchResults.pages.length})
                          </div>
                          <div className="flex flex-col gap-2">
                            {searchResults.pages.slice(0, activeSearchTab === 'all' ? 3 : 12).map((p) => (
                              <Link
                                key={p.id}
                                to={p.path}
                                onClick={() => setShowSearchResults(false)}
                                className="group p-2.5 -mx-2.5 rounded-xl hover:bg-gray-50 flex items-start gap-3 transition-colors border border-transparent hover:border-gray-100/70"
                              >
                                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors shrink-0 border border-gray-100">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="text-left flex-grow min-w-0 pr-2">
                                  <div className="font-bold text-secondary text-sm group-hover:text-primary transition-colors line-clamp-1">
                                    {p.title}
                                  </div>
                                  <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                    {p.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {activeSearchTab === 'all' && searchResults.pages.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setActiveSearchTab('pages')}
                                className="text-xs font-bold text-primary hover:text-secondary transition-colors self-start pl-1 flex items-center gap-0.5 mt-1"
                              >
                                See all {searchResults.pages.length} pages <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fallback if current active tab has zero results */}
                      {activeSearchTab !== 'all' && searchResults[activeSearchTab].length === 0 && (
                        <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 font-medium text-xs">No matching {activeSearchTab} for "{heroSearch}"</p>
                          <button
                            type="button"
                            onClick={() => setActiveSearchTab('all')}
                            className="text-xs text-primary font-bold mt-2 hover:underline"
                          >
                            View other results
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for Search Bar offset */}
      <div className="h-28 md:h-24 bg-white"></div>

      {/* Explore Our Training Programs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">Specialized Pathways</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-12">Explore Our Training Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Global Wind Organization Training */}
            <Link to="/courses?category=GWO" className="relative group overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/10] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img 
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800" 
                alt="Global Wind Organization Training" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <h3 className="text-white font-heading font-bold text-xl md:text-2xl leading-tight mb-2">
                  Global Wind Organization Training
                </h3>
              </div>
            </Link>

            {/* Other */}
            <Link to="/courses?category=Other" className="relative group overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/10] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                alt="Other Training Programs" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <h3 className="text-white font-heading font-bold text-xl md:text-2xl leading-tight mb-2">
                  Other
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Industry-Leading Skills and Support */}
      <section className="py-16 bg-[#F8FAFC] border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary text-center mb-12">
            Industry-Leading Skills and Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              {
                icon: Globe,
                title: "Global Network Excellence",
                desc: "Connecting you with world-class training standards globally."
              },
              {
                icon: Award,
                title: "Industry-Recognised GWO Standards",
                desc: "Training aligned with global safety requirements."
              },
              {
                icon: Users,
                title: "Experienced Instructors",
                desc: "Learn from industry veterans with years of field experience."
              },
              {
                icon: Zap,
                title: "Flexibility in Training Solutions",
                desc: "Tailored programs to meet your specific operational needs."
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-6 text-secondary">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Skylar Asia? Banner Section */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] border border-gray-100">
            {/* Left side: Image */}
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Leading Safety Training"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
            </div>
            
            {/* Right side: Content with grid background pattern */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#1C64B4] to-[#2E8CD6] p-8 md:p-14 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Subtle blueprint grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
              
              <div className="relative z-10">
                <span className="text-[#FBBF24] font-bold tracking-widest text-xs md:text-sm uppercase mb-3 block">
                  WHY SKYLAR ASIA?
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-5 leading-tight">
                  Leading Safety Training and Services for a Sustainable Future
                </h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed mb-8 font-light max-w-xl">
                  Our diverse digital capabilities define our approach. High-quality training is at the core of what we do, ensuring your workforce is safe, compliant, and ready for the future. We combine cutting-edge facilities with expert instruction to deliver the best learning outcomes.
                </p>
              </div>

              <div className="relative z-10 border-t border-white/20 pt-6 mt-6 md:mt-8">
                <span className="text-white/60 font-semibold tracking-wider text-[11px] uppercase mb-1 block">
                  TRUSTED PARTNERS
                </span>
                <span className="text-lg font-bold text-white">
                  GWO Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Easy 4-Step Enrolment */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              Learning Hassle-Free
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-4">Easy 4-Step Enrolment</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Begin your learning adventure with Skylar Education through our streamlined 4-step enrolment process. Designed for ease and simplicity, our portal guides you smoothly from sign up to start.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
            {[
              { step: "01", icon: Search, title: "Browse Online", desc: "Explore our extensive catalogue and select the ideal course." },
              { step: "02", icon: Calendar, title: "Choose a Date", desc: "Pick a convenient session that fits your schedule." },
              { step: "03", icon: FileText, title: "Complete Form", desc: "Fill out your details to secure your spot instantly." },
              { step: "04", icon: Mail, title: "Get Confirmed", desc: "Receive immediate booking confirmation in your inbox." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 transform group-hover:-translate-y-2 transition-transform duration-300">
                    <item.icon className="text-white w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-3 -left-3 bg-secondary text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl border-2 border-white shadow-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-secondary mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Train With Skylar */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {!imageLoads['why-image'] && <div className="w-full h-96 bg-gray-200 animate-pulse" />}
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
                  alt="Training Facility"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoads['why-image'] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad('why-image')}
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Success Rate</p>
                    <p className="text-3xl font-heading font-bold text-secondary">98%</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Why Train With Skylar?</h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                We don't just tick boxes. We provide immersive, scenario-based training that prepares you for the real world. Our facilities replicate actual site conditions.
              </p>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    <HardHat size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">Industry Experienced Trainers</h3>
                    <p className="text-gray-500">Learn from professionals who have spent years in the field.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">State-of-the-Art Facilities</h3>
                    <p className="text-gray-500">Train on modern equipment that meets current industry standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">Nationally Recognised</h3>
                    <p className="text-gray-500">Qualifications that are respected and accepted Australia-wide.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">WHAT PEOPLE SAY</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#162238]/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/5 hover:bg-[#1A2B48]/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg">
                <div>
                  <div className="flex gap-1 text-accent mb-5">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={15} fill="currentColor" className="text-accent" />)}
                  </div>
                  <p className="text-[14px] md:text-[15px] text-gray-200 italic mb-6 leading-relaxed">
                    “{t.content}”
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                  {!imageLoads[`avatar-${t.id}`] && <div className="w-11 h-11 rounded-full bg-gray-700 animate-pulse" />}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className={`w-11 h-11 rounded-full object-cover border-2 border-accent transition-opacity duration-300 ${imageLoads[`avatar-${t.id}`] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(`avatar-${t.id}`)}
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[14px] leading-tight mb-0.5">{t.name}</h4>
                    <p className="text-[11px] text-gray-400 leading-tight">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News / Industry Insights */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">Industry Insights</h2>
            <Link to="/news">
              <Button variant="outline" className="rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-secondary font-semibold text-sm px-6 py-2.5">
                View Blog
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.id} to="/news" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100/60">
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  {!imageLoads[`blog-${post.id}`] && <div className="w-full h-full bg-gray-200 animate-pulse" />}
                  <img
                    src={post.image}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoads[`blog-${post.id}`] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(`blog-${post.id}`)}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-left min-h-[220px]">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2.5">{post.category}</div>
                  <h3 className="text-base font-bold text-secondary mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm line-clamp-3 mb-5 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mt-auto group-hover:text-primary transition-colors">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Elevate Your Safety Skills CTA */}
      <section className="py-20 md:py-24 bg-secondary text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-[42px] font-heading font-bold mb-4 tracking-tight">
            Elevate Your Safety Skills
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            Join thousands of professionals who trust Skylar Education for their safety training.
          </p>
          <Link to="/courses">
            <button className="bg-accent text-secondary hover:bg-white hover:text-secondary font-bold py-4 px-8 md:px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base tracking-wide">
              View Course Calendar
            </button>
          </Link>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 md:py-24 bg-gray-50 text-secondary">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row min-h-[580px]">
            {/* Left Side: Image */}
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
                alt="Contact Us"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Right Side: Form */}
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight text-secondary">
                Contact Us
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-8">
                Ready to get started? Fill out the form below.
              </p>
              
              {contactStatus === 'success' ? (
                <div className="bg-green-50/80 border border-green-200 text-green-800 rounded-2xl p-6 text-center animate-fade-in">
                  <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />
                  <h3 className="text-lg font-bold mb-1">Message Sent!</h3>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className={`w-full px-5 py-4 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border ${formErrors.name ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-primary focus:ring-blue-100'} rounded-2xl text-secondary placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm md:text-base`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className={`w-full px-5 py-4 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border ${formErrors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-primary focus:ring-blue-100'} rounded-2xl text-secondary placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm md:text-base`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" /> {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      className={`w-full px-5 py-4 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border ${formErrors.message ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-primary focus:ring-blue-100'} rounded-2xl text-secondary placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm md:text-base resize-none`}
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" /> {formErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Robot Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-2xl transition-colors">
                    <input
                      type="checkbox"
                      id="robot"
                      checked={isRobotChecked}
                      onChange={(e) => {
                        setIsRobotChecked(e.target.checked);
                        if (formErrors.robot) {
                          setFormErrors(prev => ({ ...prev, robot: undefined }));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary/50 cursor-pointer"
                    />
                    <label htmlFor="robot" className="text-sm text-gray-500 cursor-pointer select-none font-medium">
                      I am not a robot
                    </label>
                  </div>
                  {formErrors.robot && (
                    <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> {formErrors.robot}
                    </p>
                  )}

                  {contactStatus === 'error' && (
                    <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm md:text-base tracking-wider disabled:opacity-75"
                  >
                    {contactStatus === 'sending' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      'SEND MESSAGE'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-12">
            <span className="text-accent font-bold text-xs uppercase tracking-widest block mb-3">
              SKYLAR EDUCATION LOCATIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary tracking-tight">
              World-Class Training Facilities
            </h2>
          </div>
          
          <div className="h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-8 relative">
            <InteractiveMap />
          </div>

          <div className="flex justify-center">
            <Link to="/locations">
              <button className="bg-secondary hover:bg-secondary/95 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base tracking-wide uppercase">
                View All Locations
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
