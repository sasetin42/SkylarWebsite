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
import { TESTIMONIALS, BLOG_POSTS } from '../constants';
import { getCourses, getPageContent } from '../services/storageService';
import { Course, SitePage } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface NewsletterForm {
  email: string;
}

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [pageContent, setPageContent] = useState<SitePage | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
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
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[\d\s\-+()]{7,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setContactStatus('success');
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

  const accreditation = pageContent?.sections.find(s => s.id === 'accreditation')?.data;
  const coursesIntro = pageContent?.sections.find(s => s.id === 'courses_intro')?.data;

  return (
    <div className="animate-fade-in bg-surface">
      <div className="relative">
        {/* ===== HERO SECTION ===== */}
        <section className="relative h-screen min-h-[750px] max-h-[1080px] flex items-center overflow-hidden group" aria-label="Hero Slider">
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#051124]/95 via-[#051124]/70 to-[#051124]/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#051124]/90 via-transparent to-[#051124]/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#051124]/10 via-transparent to-[#051124]/60"></div>
              </div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 md:px-8 relative z-20 text-white w-full">
            <div className="max-w-5xl">
              {slides.length > 0 && (
                <div key={currentSlide} className="space-y-6 md:space-y-8 animate-fade-in-up">
                  {/* Accreditation Badge */}
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-lg text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.9)]"></span>
                    Premium Safety Training
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl md:text-[70px] font-heading font-black leading-[1.1] tracking-tight drop-shadow-2xl">
                    {slides[currentSlide].heading}
                  </h1>

                  {/* Yellow Accent Divider */}
                  <div className="w-20 h-1.5 bg-accent rounded-full shadow-lg shadow-accent/50"></div>

                  {/* Description */}
                  <p className="text-[18px] text-gray-200 leading-relaxed max-w-2xl font-light border-l-4 border-accent/80 pl-5 md:pl-7">
                    {slides[currentSlide].description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-2 pointer-events-auto">
                    <Link to={slides[currentSlide].buttonLink} className="w-full sm:w-auto">
                      <Button
                        className="w-full font-bold bg-accent text-secondary hover:bg-white hover:text-secondary border-2 border-transparent shadow-xl shadow-accent/20 px-8 py-3.5 text-sm md:text-base rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-accent/30"
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
          <div className="absolute bottom-40 md:bottom-44 left-1/2 -translate-x-1/2 flex gap-3 z-30">
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
          <div className="container mx-auto max-w-5xl pointer-events-auto">
            <form onSubmit={handleHeroSearch} className="bg-white rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] border border-gray-100 p-2 md:p-3 flex flex-col md:flex-row gap-3 ring-1 ring-black/5">
              <div className="flex-1 relative group">
                <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 bg-gray-100 p-2.5 rounded-xl text-gray-500 group-focus-within:text-primary group-focus-within:bg-blue-50 transition-all duration-300">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="What training do you need?"
                  className="w-full pl-16 md:pl-20 pr-5 py-4 md:py-5 bg-transparent rounded-xl focus:outline-none text-base md:text-lg text-gray-900 placeholder-gray-400 font-semibold"
                />
              </div>
              <Button
                type="submit"
                className="bg-secondary text-white px-10 md:px-14 py-4 md:py-5 rounded-xl h-auto shadow-lg hover:bg-primary text-base md:text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl w-full md:w-auto"
              >
                Search Courses
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer for Search Bar offset */}
      <div className="h-28 md:h-24 bg-surface"></div>

      {/* Accreditation Strip */}
      <div className="bg-white border-y border-gray-200 py-10 overflow-hidden relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
            {accreditation?.heading || "Nationally Recognised & Trusted By Industry Leaders"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><Award size={28} /> NRT</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><ShieldCheck size={28} /> WorkSafe</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><Fan size={28} /> GWO</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><Globe size={28} /> ASQA</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><HardHat size={28} /> HSEQ</div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <section className="py-20 md:py-28 bg-surface relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">{coursesIntro?.subheading || "Popular Programs"}</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary">{coursesIntro?.heading || "Start Your Career"}</h2>
            </div>
            <Link to="/courses" className="group flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors text-sm md:text-base whitespace-nowrap">
              View All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Industry-Leading Skills & Support */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Excellence in Safety Training</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Industry-Leading Skills & Support</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Industry-Relevant Accreditation", desc: "Skylar Education meets rigorous international safety standards for industrial operations.", link: "/about" },
              { icon: Award, title: "Nationally Recognised (RTO)", desc: "Our courses align with Australian RTO #45000 standards and quality frameworks.", link: "/about" },
              { icon: GraduationCap, title: "Experienced Instructors", desc: "Learn from industry veterans with years of real-world operational experience.", link: "/about/team" },
              { icon: Zap, title: "Flexibility in Training Delivery", desc: "We offer tailored training schedules to minimize downtime for your workforce.", link: "/courses" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-lg mb-4 leading-tight min-h-[3rem]">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[4rem]">{item.desc}</p>
                <Link to={item.link} className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider hover:text-white transition-colors">
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up / Enrollment Form */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto border border-gray-100">
            <div className="lg:w-1/2 relative min-h-[300px] bg-gray-200">
              {!imageLoads['contact-image'] && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              )}
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000"
                alt="Construction Site"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoads['contact-image'] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoad('contact-image')}
              />
              <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply"></div>
            </div>
            <div className="lg:w-1/2 p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="font-heading font-bold text-xl tracking-widest text-secondary uppercase mb-2">Skylar</h3>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Join With Us</h2>
              </div>

              {contactStatus === 'success' ? (
                <div className="text-center py-12 animate-pop-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent</h3>
                  <p className="text-gray-500">We'll get back to you shortly.</p>
                  <button
                    onClick={() => { setContactStatus('idle'); setFormData({ name: '', email: '', phone: '', message: '' }); }}
                    className="mt-6 text-primary font-bold text-sm hover:underline"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                        formErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'
                      }`}
                      required
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                        formErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'
                      }`}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                        formErrors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.phone}</p>}
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Message"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm resize-none focus:outline-none focus:ring-1 transition-colors ${
                        formErrors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'
                      }`}
                      required
                    />
                    {formErrors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.message}</p>}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-2 flex items-center justify-between w-full max-w-[250px]">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-6 h-6 border-2 border-gray-300 rounded cursor-pointer" />
                      <span className="text-xs text-gray-600 font-medium">I'm not a robot</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-8 h-8 opacity-50" alt="captcha" />
                      <span className="text-[8px] text-gray-400">reCAPTCHA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="w-full bg-secondary text-white font-bold py-3.5 rounded-lg hover:bg-primary transition-colors text-sm uppercase tracking-wider shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {contactStatus === 'sending' ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Enquiry</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About / Sustainable Future */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {!imageLoads['about-image'] && <div className="w-full h-96 bg-gray-800 animate-pulse" />}
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
                  alt="Team Collaboration"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoads['about-image'] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad('about-image')}
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>
            <div>
              <span className="inline-block py-1 px-3 rounded bg-blue-900/50 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-800">
                Tailored Safety Training For Your Unique Needs
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Leading Safety Training and Services for a <span className="text-blue-400">Sustainable Future</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Discover how Skylar Education provides customised, high-quality training and safety services that prioritise injury-free work environments and meet your unique needs. Visit our About page to learn more about our commitment to empowering your industry.
              </p>
              <div className="bg-white text-secondary p-6 rounded-2xl shadow-lg mb-8 border-l-4 border-accent relative">
                <p className="font-medium italic leading-relaxed">
                  "Skylar Education leads in off-the-job safety training across Australia. By tailoring programs to each industry, we help clients meet and exceed standards while creating cultures where every worker goes home safe."
                </p>
              </div>
              <Link to="/about">
                <Button className="bg-[#0072CE] hover:bg-white hover:text-[#0072CE] text-white px-8 py-4 uppercase tracking-widest text-xs font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all">
                  More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Easy 4-Step Enrolment */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded bg-blue-100 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
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
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 transform group-hover:-translate-y-2 transition-transform duration-300">
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
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    <HardHat size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">Industry Experienced Trainers</h3>
                    <p className="text-gray-500">Learn from professionals who have spent years in the field.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">State-of-the-Art Facilities</h3>
                    <p className="text-gray-500">Train on modern equipment that meets current industry standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary">
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
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">What Our Students Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <div className="flex gap-1 text-accent mb-4">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  {!imageLoads[`avatar-${t.id}`] && <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className={`w-12 h-12 rounded-full object-cover border-2 border-accent transition-opacity duration-300 ${imageLoads[`avatar-${t.id}`] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(`avatar-${t.id}`)}
                  />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">Latest Industry News</h2>
            <Link to="/news">
              <Button variant="outline">View All Blog</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {BLOG_POSTS.slice(0, 2).map((post) => (
              <Link key={post.id} to="/news" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="h-48 md:h-full overflow-hidden relative bg-gray-200">
                    {!imageLoads[`blog-${post.id}`] && <div className="w-full h-full bg-gray-300 animate-pulse" />}
                    <img
                      src={post.image}
                      alt={post.title}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoads[`blog-${post.id}`] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => handleImageLoad(`blog-${post.id}`)}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{post.category}</div>
                    <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <span className="text-sm font-bold text-gray-400 flex items-center gap-2 group-hover:text-primary transition-colors">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-accent to-yellow-400 relative overflow-hidden mx-4 rounded-3xl mb-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-secondary">Ready to upskill?</h2>
            <p className="text-lg md:text-xl font-medium text-secondary/80">Book your spot today. Classes fill up fast.</p>
          </div>
          <Link to="/courses" className="w-full md:w-auto">
            <button className="bg-secondary text-white hover:bg-white hover:text-secondary font-bold py-4 md:py-5 px-10 md:px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg uppercase tracking-wide focus:outline-none focus:ring-4 focus:ring-white/50 border-4 border-transparent hover:border-secondary w-full md:w-auto">
              ENROLL NOW
            </button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-96 h-full bg-white/20 skew-x-12 transform translate-x-32 pointer-events-none" aria-hidden="true"></div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-8">Subscribe to our newsletter for the latest course updates and industry safety news.</p>
            {newsletterStatus === 'success' ? (
              <div className="bg-green-500/20 text-green-300 rounded-xl p-4 animate-pop-in">
                <CheckCircle size={20} className="inline mr-2" />
                Successfully subscribed!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors text-sm"
                  required
                />
                <button type="submit" className="px-8 py-3.5 bg-accent text-secondary font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
