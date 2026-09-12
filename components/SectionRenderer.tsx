
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Users, Award, Briefcase, Fan, Zap, BookOpen,
  ChevronRight, ChevronLeft, HardHat, ShieldCheck, Building2, Hammer,
  Target, Eye, Heart, Search, Calendar, FileText, Mail, Shield,
  Globe, UserCheck, Phone, ArrowRight, MapPin, Star, X, Clock, Sparkles, Send, CheckCircle2, User
} from 'lucide-react';
import { Button } from './Button';
import { PageSection, Location } from '../types';
import { getLocations, saveInquiry } from '../services/storageService';

// Helper to map icon names to components
const IconMap: Record<string, any> = {
  Users, Award, CheckCircle, Briefcase, Zap, BookOpen, Fan, Target, Eye, Heart,
  Search, Calendar, FileText, Mail, HardHat, ShieldCheck, Building2, Hammer, Shield,
  Globe, UserCheck, Phone, User
};

// --- Custom Chart Component for GWO Overview ---
const GWOBenefitsChart: React.FC = () => {
  const chartData = [
    {
      label: "Established as contractual expectation",
      gradient: "conic-gradient(#E67E22 0% 45%, #1C3D72 45% 75%, #3498DB 75% 90%, #AED6F1 90% 95%, #95A5A6 95% 100%)",
      highlight: "45%" // Rank 1
    },
    {
      label: "Improved safety/fewer incidents/injury",
      gradient: "conic-gradient(#E67E22 0% 40%, #1C3D72 40% 70%, #3498DB 70% 85%, #AED6F1 85% 95%, #95A5A6 95% 100%)",
      highlight: "40%" // Rank 1
    },
    {
      label: "More efficient sourcing of labour",
      gradient: "conic-gradient(#1C3D72 0% 35%, #3498DB 35% 65%, #AED6F1 65% 90%, #95A5A6 90% 100%)",
      highlight: "35%" // Rank 2
    },
    {
      label: "Option to outsource non-core training",
      gradient: "conic-gradient(#E67E22 0% 25%, #3498DB 25% 60%, #AED6F1 60% 80%, #95A5A6 80% 100%)",
      highlight: "25%"
    },
    {
      label: "Utilise training budget for proprietary needs",
      gradient: "conic-gradient(#1C3D72 0% 20%, #3498DB 20% 45%, #AED6F1 45% 70%, #95A5A6 70% 100%)",
      highlight: "20%"
    }
  ];

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center animate-fade-in-up">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="font-heading font-bold text-secondary text-lg leading-tight mb-2">
          Benefits of GWO Standards
        </h3>
        <p className="text-sm text-gray-500">Ranking by GWO Members Survey</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8 text-xs font-bold text-gray-600">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#E67E22]"></div> 1 (Most)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#1C3D72]"></div> 2</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3498DB]"></div> 3</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#AED6F1]"></div> 4</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#95A5A6]"></div> 5 (Least)</div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-inner mb-3 transition-transform duration-500 group-hover:scale-110"
              style={{ background: item.gradient }}>
              {/* Center hole for donut effect */}
              <div className="absolute inset-0 m-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx + 1}
                </span>
              </div>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-gray-600 leading-tight max-w-[120px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-right">
        <span className="text-[10px] text-gray-400 italic">Source: GWO members' survey</span>
      </div>
    </div>
  );
};

// --- Custom Component for Emissions Reduction (Linear) ---
const EmissionsReductionChart: React.FC = () => {
  const data = [
    { x: '0%', y: '100%', value: '0' },
    { x: '26%', y: '57%', value: '43' },
    { x: '100%', y: '0%', value: '100' }
  ];

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center animate-fade-in-up">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="font-heading font-bold text-secondary text-lg leading-tight mb-2">
          Scope 1, 2 & 3 Emissions Reduction
        </h3>
        <p className="text-sm text-gray-500">Path to Net Zero by 2050</p>
      </div>

      <div className="relative h-64 w-full pt-4 pb-8 px-4">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 pb-8">
          <div className="border-b border-gray-300 w-full"></div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="border-b border-gray-300 w-full"></div>
          <div className="border-b border-gray-300 w-full"></div>
        </div>

        {/* Chart Line Graphic (Simulated with SVG) */}
        <div className="relative h-full w-full">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Gradient Area */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C3D72" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1C3D72" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 100 L 26 57 L 100 0 L 100 100 L 0 100 Z"
              fill="url(#chartGradient)"
            />
            {/* The Line */}
            <path
              d="M 0 100 L 26 57 L 100 0"
              fill="none"
              stroke="#1C3D72"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Data Points & Labels */}
          {data.map((d, i) => (
            <div key={i} className="absolute flex flex-col items-center" style={{ left: d.x, top: d.y, transform: 'translate(-50%, -50%)' }}>
              <div className="mb-2 text-xs font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">{d.value}%</div>
              <div className="w-3 h-3 bg-[#FFC107] rounded-full border-2 border-white shadow-md z-10 hover:scale-125 transition-transform"></div>
            </div>
          ))}
        </div>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 w-full flex justify-between text-xs font-bold text-gray-600 px-0">
          <span className="transform -translate-x-1/2">2023</span>
          <span className="transform -translate-x-1/2 absolute" style={{ left: '26%' }}>2030</span>
          <span className="transform translate-x-1/2 right-0 absolute">2050</span>
        </div>
        <div className="absolute bottom-[-24px] w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">Year</div>
      </div>
    </div>
  );
};

// --- Custom Component for Workforce Productivity ---
const WorkforceProductivityGraphic: React.FC = () => {
  const bubbles = [
    { pct: "10%", label: "+1 day on site each year", size: "w-16 h-16", color: "bg-[#E67E22]", textCol: "text-white" },
    { pct: "10%", label: "+3 days on site each year", size: "w-16 h-16", color: "bg-[#1C3D72]", textCol: "text-white" },
    { pct: "30%", label: "+4 days on site each year", size: "w-24 h-24", color: "bg-[#3498DB]", textCol: "text-white" },
    { pct: "40%", label: "+5 days on site each year", size: "w-32 h-32", color: "bg-[#AED6F1]", textCol: "text-secondary" },
    { pct: "10%", label: "+6 days on site each year", size: "w-16 h-16", color: "bg-[#95A5A6]", textCol: "text-white" },
  ];

  const renderBubble = (item: typeof bubbles[0], idx: number) => (
    <div key={idx} className="flex flex-col items-center text-center gap-2 group shrink-0">
      <div className={`${item.size} rounded-full flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${item.color} ${item.textCol}`}>
        <span className="font-black text-sm md:text-base leading-none">{item.pct}</span>
      </div>
      <p className={`text-[10px] font-bold text-[#E67E22] uppercase tracking-tighter leading-tight max-w-[80px]`}>
        {item.label.split('site').map((part, i) => (
          <span key={i} className={i === 0 ? "block mb-0.5 text-xs text-gray-700 font-extrabold" : "block text-gray-400"}>
            {part}{i === 0 ? "site" : ""}
          </span>
        ))}
      </p>
    </div>
  );

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center animate-fade-in-up">
      <p className="text-sm font-bold text-gray-800 mb-8 leading-relaxed">
        For every GWO certified technician we employ/contract we can expect them to be available for
      </p>

      <div className="flex flex-col gap-8 mb-8">
        {/* Row 1: First 2 items (10%, 10%) */}
        <div className="flex items-end justify-center gap-12">
          {bubbles.slice(0, 2).map((item, idx) => renderBubble(item, idx))}
        </div>

        {/* Row 2: Next 3 items (30%, 40%, 10%) */}
        <div className="flex items-end justify-center gap-4">
          {bubbles.slice(2).map((item, idx) => renderBubble(item, idx + 2))}
        </div>
      </div>
    </div>
  );
};

// --- Interactive Contact Form Showcase Slider Component ---
export const InteractiveContactFormRenderer: React.FC<{ section: PageSection }> = ({ section }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = (section.data.slides && section.data.slides.length > 0)
    ? section.data.slides
    : (section.data.items && section.data.items.length > 0)
    ? section.data.items
    : [
        {
          image: '/contact-climbing-training.jpg',
          badge: 'PRACTICAL TRAINING',
          tag: 'REAL-WORLD PRACTICE',
          title: 'Hands-On Wind & Height Safety Simulation',
          location: 'Certified Training Towers & Height Systems',
          fallback: '/contact-climbing-training.jpg'
        },
        {
          image: '/contact-facility-gear.jpg',
          badge: 'GWO CERTIFIED EQUIPMENT',
          tag: 'STANDARDS COMPLIANT',
          title: 'Modern Safety Equipment & Gear Training Facility',
          location: 'Skylar Education Asia Accredited Campus',
          fallback: '/contact-facility-gear.jpg'
        }
      ];

  const safeSlide = slides.length > 0 ? ((activeSlide % slides.length) + slides.length) % slides.length : 0;
  const currentSlide = slides[safeSlide] || slides[0];

  React.useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  return (
    <section className="py-20 md:py-24 bg-gray-50 text-secondary">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row min-h-[580px]">
          {/* Left Side: Image Slider */}
          <div
            className="md:w-1/2 relative min-h-[380px] md:min-h-full bg-[#041024] overflow-hidden group select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {slides.map((slide: any, idx: number) => {
              const isActive = idx === safeSlide;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image || slide.fallback}
                    alt={slide.title || "Facility"}
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                    onError={(e) => {
                      if (slide.fallback) (e.target as HTMLImageElement).src = slide.fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-[#041024]/30 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041024]/95 via-[#041024]/40 to-transparent pointer-events-none" />
                </div>
              );
            })}

            {/* Top Badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FDC70E] text-secondary text-[11px] font-extrabold uppercase tracking-wider shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-500">
                {currentSlide?.badge || "PRACTICAL TRAINING"}
              </span>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-[#FDC70E] hover:text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide(prev => (prev + 1) % slides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-[#FDC70E] hover:text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/10"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Bottom Content & Dots */}
            <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
              <div key={`slide-content-${safeSlide}`} className="animate-fade-in space-y-2">
                <span className="inline-block py-1 px-3 rounded bg-accent/25 text-accent text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-accent/40 shadow-sm">
                  {currentSlide?.tag || "REAL-WORLD PRACTICE"}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold font-heading text-white drop-shadow-lg leading-snug">
                  {currentSlide?.title || "Hands-On Wind & Height Safety Simulation"}
                </h3>
                <p className="text-xs text-gray-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                  {currentSlide?.location || currentSlide?.description || "Certified Training Towers & Height Systems"}
                </p>
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-2 pt-4">
                  {slides.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === safeSlide
                          ? 'w-8 bg-[#FDC70E] shadow-md shadow-[#FDC70E]/30'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight text-secondary">
              {section.data.heading || "Contact Us"}
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-8">
              {section.data.subheading || "Ready to get started? Fill out the form below."}
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="preview-contact-name" className="sr-only">Full Name</label>
                <input
                  id="preview-contact-name"
                  name="previewContactName"
                  autoComplete="name"
                  aria-label="Full Name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-secondary text-sm md:text-base"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="preview-contact-email" className="sr-only">Email Address</label>
                <input
                  id="preview-contact-email"
                  name="previewContactEmail"
                  autoComplete="email"
                  aria-label="Email Address"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-secondary text-sm md:text-base"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="preview-contact-message" className="sr-only">Your Message</label>
                <textarea
                  id="preview-contact-message"
                  name="previewContactMessage"
                  autoComplete="off"
                  aria-label="Your Message"
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-secondary text-sm md:text-base resize-none"
                  disabled
                />
              </div>
              <Link to="/contact">
                <Button className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-4 rounded-2xl text-sm md:text-base tracking-wider">
                  {section.data.buttonText || "SEND MESSAGE"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface SectionRendererProps {
  section: PageSection;
  locationsOverride?: Location[];
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, locationsOverride }) => {
  const [activeGwoTab, setActiveGwoTab] = useState('technical');

  // Custom Render for Technical Proficiency (Updated to Interactive Tabs)
  if (section.id === 'gwo_technical_safety') {
    const tabs = [
      { id: 'technical', label: 'Technical Proficiency and Safety' },
      { id: 'employers', label: 'Benefits to Employers' },
      { id: 'certification', label: 'GWO Certification' }
    ];

    const content: Record<string, { title: string, desc: string }[]> = {
      technical: section.data.items?.map(i => ({ title: i.title, desc: i.description })) || [],
      employers: [
        {
          title: "Building a Professional Training Environment",
          desc: "Employers benefit significantly from having GWO-certified personnel on their teams. The structured training environment fostered by GWO promotes a culture of safety and professionalism, ensuring that all team members are equipped to contribute positively to projects."
        },
        {
          title: "Increasing Operational Efficiency",
          desc: "With a GWO-certified workforce, companies can expect increased operational efficiency. Certified technicians possess the skills necessary to perform their tasks effectively, reducing downtime and ensuring projects are completed on schedule."
        }
      ],
      // Note: certification content is handled by custom render below
      certification: []
    };

    return (
      <section className="py-16 md:py-24 bg-white" id="gwo-tabs">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white p-6 md:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-6xl mx-auto">

            {/* Tabs Navigation */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-10 pb-4 border-b border-gray-100">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGwoTab(tab.id)}
                  className={`py-4 px-6 rounded-xl font-heading font-bold text-sm md:text-base uppercase tracking-wider transition-all duration-300 flex-1 text-center border-b-4 md:border-b-0 md:border-2 shadow-sm ${activeGwoTab === tab.id
                      ? 'bg-primary text-white border-primary/80 shadow-lg transform md:-translate-y-1'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:text-primary'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="animate-fade-in" key={activeGwoTab}>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-secondary mb-8 pb-4 border-b border-gray-100 inline-block">
                {tabs.find(t => t.id === activeGwoTab)?.label}
              </h2>

              {activeGwoTab === 'certification' ? (
                <div className="space-y-12">
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">
                        Aligning with Renewable Energy Goals
                      </h3>
                      <div className="prose prose-lg text-gray-600">
                        <p className="leading-relaxed">
                          As energy sectors worldwide strive towards greater sustainability goals, GWO Certification aligns perfectly with these objectives. By supporting the development of a skilled safety workforce, the wind energy sector can advance rapidly, contributing directly to international renewable energy targets.
                        </p>
                      </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                      <EmissionsReductionChart />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-10">
                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">
                      The Role of GWO in Industry Growth
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                      The role of GWO in the growth of the renewable energy industry cannot be overstated. By ensuring that technicians are adequately trained and certified, GWO helps to create a stable and qualified workforce that can support the industry as it expands.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 md:space-y-12">
                  {content[activeGwoTab]?.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <CheckCircle size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle custom GWO sections specifically
  if (section.id === 'gwo_overview') {
    return (
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{section.data.subheading}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">{section.data.heading}</h2>
              <div className="prose prose-lg text-gray-600 mb-8 whitespace-pre-line">
                {section.data.description}
              </div>
            </div>
            {/* Custom Chart Component */}
            <GWOBenefitsChart />
          </div>
        </div>
      </section>
    );
  }

  if (section.id === 'gwo_productivity') {
    return (
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{section.data.subheading}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">{section.data.heading}</h2>
              <ul className="space-y-4">
                {section.data.description?.split('\n').map((line, i) => (
                  line.trim() && (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-1" />
                      <span>{line.replace('✓', '').trim()}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
            {/* Custom Bubble Graphic */}
            <WorkforceProductivityGraphic />
          </div>
        </div>
      </section>
    );
  }

  if (section.id === 'gwo_coo_message') {
    return (
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl shrink-0">
              <img
                src={section.data.image}
                alt="COO"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading mb-4 text-accent">{section.data.heading}</h3>
              <p className="text-lg md:text-xl text-gray-200 italic leading-relaxed">
                "{section.data.description}"
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Safety Excellence Section with Blue Gradient
  if (section.id === 'safety_excellence') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#041024]/20 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Brand Background */}
            <div className="lg:w-1/2 bg-[#041024] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-white/80 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>

                {section.data.partners && (
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Trusted Partners</p>
                    <div className="flex gap-6 opacity-90">
                      {section.data.partners.map(p => (
                        <span key={p} className="font-heading font-bold text-xl text-white">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Partner Excellence Section (Matches Safety Excellence Style)
  if (section.id === 'partner_excellence') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/angeles-training-centre.jpg';
                }}
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#041024]/20 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Brand Background */}
            <div className="lg:w-1/2 bg-[#041024] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-white/80 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Next Step CTA Section (Matches Safety Excellence Style)
  if (section.id === 'gwo_next_step') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/angeles-training-centre.jpg';
                }}
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#041024]/30 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Brand Background */}
            <div className="lg:w-1/2 bg-[#041024] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-white/80 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>

                {section.data.buttonText && (
                  <Link to={section.data.buttonLink || '#'}>
                    <Button
                      className="bg-accent text-secondary hover:bg-white hover:text-primary border-none shadow-xl"
                    >
                      {section.data.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  switch (section.type) {
    case 'locations-list': {
      const locationsList = (locationsOverride && locationsOverride.length > 0) ? locationsOverride : getLocations();
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            {(section.data.subheading || section.data.heading) && (
              <div className="text-center mb-12">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
                    {section.data.subheading}
                  </span>
                )}
                {section.data.heading && (
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">
                    {section.data.heading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-12">
              {locationsList.map(location => (
                <div key={location.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  <div className="block h-64 overflow-hidden relative shrink-0">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/angeles-training-centre.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041024]/90 via-[#041024]/40 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-6 text-xl md:text-2xl font-bold font-heading text-white pr-4 leading-tight drop-shadow-md">
                      {location.name}
                    </h3>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><MapPin size={20} /></div>
                        <div>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Address</p>
                          <p className="text-gray-800 font-medium leading-relaxed">{location.address}</p>
                          <a
                            href={location.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-yellow-600 text-sm font-bold mt-1 inline-flex items-center gap-1 transition-colors"
                          >
                            View on Google Maps <ArrowRight size={14}/>
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><Phone size={20} /></div>
                        <div>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-gray-800 font-medium">{location.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><Mail size={20} /></div>
                        <div>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Email</p>
                          <p className="text-gray-800 font-medium break-all">{location.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 mt-auto">
                      <Link to={`/locations/${location.id}`}>
                        <button className="w-full py-3.5 px-6 bg-gray-50 hover:bg-gray-100 text-secondary font-bold rounded-xl transition-all flex items-center justify-between group/btn">
                          <span className="text-sm">View Campus Details</span>
                          <div className="bg-white p-1 rounded-full shadow-sm text-gray-400 group-hover/btn:text-primary transition-colors">
                            <ArrowRight size={16} />
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case 'training-programs': {
      const hasShowcaseLayout = Boolean(section.data.programTitle || section.data.programTag || section.data.modules || section.data.badge1);
      const modulesList = section.data.modules || (section.data.items && section.data.items.length > 1 ? section.data.items : [
        { title: 'Basic Safety Training (BST)', description: 'Working at Heights, First Aid, Manual Handling, Fire Awareness', icon: 'ShieldCheck', color: 'accent' },
        { title: 'Advanced Rescue (ART)', description: 'Hub, Spinner, Nacelle, and Inside Blade Rescue Operations', icon: 'HardHat', color: 'blue' },
        { title: 'Basic Technical Training (BTT)', description: 'Mechanical, Electrical, Hydraulic, and Bolt Torquing', icon: 'Zap', color: 'emerald' },
        { title: 'WINDA Global Verification', description: 'Instant digital record verification for onshore & offshore sites', icon: 'Award', color: 'purple' }
      ]);

      if (hasShowcaseLayout) {
        return (
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
                  {section.data.subheading || "SPECIALIZED PATHWAY"}
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-4">
                  {section.data.heading || "Global Wind Organisation Training"}
                </h2>
                <div className="w-16 h-1 bg-[#FDC70E] mx-auto rounded-full"></div>
              </div>

              <div className="bg-[#041125] rounded-3xl overflow-hidden shadow-[0_12px_40px_-5px_rgba(4,16,36,0.18)] border border-slate-800/80 flex flex-col lg:flex-row transition-all duration-500 hover:shadow-2xl">
                {/* Left Column: Image */}
                <div className="lg:w-1/2 relative min-h-[360px] lg:min-h-[480px] overflow-hidden group">
                  <img
                    src={section.data.image || (section.data.items && section.data.items[0]?.image) || "https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1200"}
                    alt={section.data.programTitle || "Training Program"}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041024]/90 via-[#041024]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#041024]/30 lg:to-[#041125]"></div>

                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/90 text-secondary text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg">
                      {section.data.badge1 || "★ Certified Standard"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#041024]/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
                      {section.data.badge2 || "Global Wind Organisation"}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:w-1/2 bg-[#041125] p-8 md:p-12 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                  <div className="relative z-10 space-y-5">
                    <div>
                      <span className="text-[#FBBF24] font-bold tracking-widest text-xs md:text-sm uppercase mb-2 block">
                        {section.data.programTag || "INTERNATIONALLY ACCREDITED PROGRAM"}
                      </span>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight">
                        {section.data.programTitle || "Global Wind Organisation (GWO)"}
                      </h3>
                      <div className="w-12 h-1 bg-accent mt-3 rounded-full"></div>
                    </div>

                    <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">
                      {section.data.description || "SKYLAR EDUCATION ASIA delivers comprehensive, internationally certified GWO safety and technical training programs designed for wind energy technicians, engineers, and site personnel."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {modulesList.map((mod: any, mIdx: number) => {
                        const IconComponent = (mod.icon && IconMap[mod.icon]) ? IconMap[mod.icon] : ShieldCheck;
                        const colorStyles: Record<string, { bg: string, text: string }> = {
                          accent: { bg: 'bg-accent/20', text: 'text-accent' },
                          blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
                          emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
                          purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
                          amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
                          red: { bg: 'bg-red-500/20', text: 'text-red-400' },
                          cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' }
                        };
                        const colorKey = mod.color || (mIdx === 0 ? 'accent' : mIdx === 1 ? 'blue' : mIdx === 2 ? 'emerald' : 'purple');
                        const chosenColor = colorStyles[colorKey] || colorStyles.accent;

                        return (
                          <div key={mIdx} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className={`p-2 rounded-lg ${chosenColor.bg} ${chosenColor.text} shrink-0`}>
                              <IconComponent size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{mod.title}</h4>
                              <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{mod.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-white/15 pt-6 mt-8 flex flex-wrap gap-4 justify-between items-center">
                    <div>
                      <span className="text-white/70 font-bold tracking-wider text-[11px] uppercase mb-1 block">
                        {section.data.validityLabel || "CERTIFICATION VALIDITY"}
                      </span>
                      <span className="text-sm md:text-base font-bold text-accent tracking-wide flex items-center gap-1.5">
                        <CheckCircle size={16} className="text-accent" /> {section.data.validityText || "24-Month International Accreditation"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <Link to={section.data.secondaryButtonLink || "/about/gwo-benefits"}>
                        <button className="px-5 py-3 rounded-xl text-xs md:text-sm font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 cursor-pointer">
                          {section.data.secondaryButtonText || "GWO Benefits"}
                        </button>
                      </Link>
                      <Link to={section.data.buttonLink || "/courses?category=Global%20Wind%20Organisation"}>
                        <button className="px-7 py-3 rounded-xl text-xs md:text-sm font-bold bg-[#FBBF24] text-[#041024] hover:bg-white hover:text-[#041024] shadow-lg transform hover:scale-105 transition-all duration-300 border-none uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                          <span>{section.data.buttonText || "View GWO Courses"}</span>
                          <ArrowRight size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            {section.data.subheading && (
              <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
                {section.data.subheading}
              </span>
            )}
            {section.data.heading && (
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-12">
                {section.data.heading}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {(section.data.items || []).map((item, index) => (
                <Link
                  key={index}
                  to={item.buttonLink || '/courses'}
                  className="relative group block w-full text-left overflow-hidden rounded-3xl aspect-[4/3] md:aspect-[16/10] shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-primary/30"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041024]/90 via-[#041024]/40 to-transparent group-hover:from-[#041024]/80 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-8 h-1 bg-[#FDC70E] mb-4 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500"></div>
                    <h3 className="text-white font-heading font-bold text-2xl md:text-3xl leading-tight mb-2 drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                      {item.description || 'Explore Pathway'} <ChevronRight size={16} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'contact-form': {
      return <InteractiveContactFormRenderer section={section} />;
    }

    case 'hero': {
      const heroBgSR = section.data.image || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920';
      return (
        <section className="relative overflow-hidden bg-secondary border-b-4 border-accent">
          {/* BG image with double overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBgSR}
              alt="Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920';
              }}
            />
            <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
          </div>

          {/* Content — in normal flow so section auto-expands to fit */}
          <div className="relative z-10 pt-[120px] pb-14">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-3xl animate-fade-in-up">
                {/* Accent badges */}
                {section.data.subheading && (
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                      {section.data.subheading}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                      SKYLAR EDUCATION ASIA
                    </span>
                  </div>
                )}
                <h1
                  className="font-heading font-bold text-white mb-4 drop-shadow-lg"
                  style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}
                >
                  {section.data.heading}
                </h1>
                <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
                <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                  {section.data.description}
                </p>
                {section.data.buttonText && (
                  <div className="mt-8">
                    <Link to={section.data.buttonLink || '#'}>
                      <Button size="lg" className="shadow-xl">{section.data.buttonText}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'features':
      if (section.id === 'why_choose_us' || (section.data.image && section.data.items)) {
        return (
          <section className="py-20 md:py-28 bg-[#F8FAFC]/60 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Side: Featured Image */}
                <div className="relative h-full flex items-center">
                  <div className="w-full relative rounded-[2.5rem] overflow-hidden shadow-[0_16px_50px_-8px_rgba(4,16,36,0.14)] border-[8px] border-white">
                    <img
                      src={section.data.image || "/why-train-skylar.png"}
                      alt={section.data.heading || "Why Choose Us"}
                      className="w-full h-[540px] md:h-[620px] lg:h-[680px] object-cover object-center transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = '/angeles-training-centre.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-[#041024]/10 pointer-events-none" />
                  </div>
                </div>

                {/* Right Side: Details & Feature List */}
                <div className="text-left">
                  {section.data.subheading && (
                    <span className="inline-block py-1 px-3 rounded bg-[#FDC70E]/15 text-[#D97706] text-xs font-extrabold uppercase tracking-widest mb-4">
                      {section.data.subheading}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#041024] mb-6 leading-tight">
                    {section.data.heading || "Why Train With SKYLAR EDUCATION ASIA?"}
                  </h2>
                  {section.data.description && (
                    <p className="text-gray-600 text-base md:text-lg mb-10 leading-relaxed font-normal">
                      {section.data.description}
                    </p>
                  )}
                  <div className="space-y-8">
                    {section.data.items?.map((item, idx) => {
                      const Icon = IconMap[item.icon || 'HardHat'] || HardHat;
                      return (
                        <div key={idx} className="flex gap-5 group items-start">
                          <div className="bg-[#EFF6FF] w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 text-[#1C64B4] group-hover:bg-[#041024] group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:shadow-lg group-hover:scale-105">
                            <Icon size={26} className="stroke-[2]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base md:text-lg text-[#041024] mb-1.5 group-hover:text-[#1C64B4] transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      return (
        <section className="py-20 md:py-24 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            {section.data.heading && (
              <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
                {section.data.subheading && (
                  <span className="text-[#FFC107] font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-secondary dark:text-white tracking-tight leading-tight mb-3">
                  {section.data.heading}
                </h2>
                <div className="w-16 h-1.5 bg-[#FFC107] mx-auto mt-3 rounded-full"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {section.data.items?.map((item, idx) => {
                const Icon = IconMap[item.icon || 'Award'] || Award;
                const isList = item.description?.includes('•') || item.description?.includes('\n');
                
                // Card accent pill
                const accentBadge = 
                  idx === 0 ? { label: "CORE PURPOSE", bg: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60" } :
                  idx === 1 ? { label: "GLOBAL VISION", bg: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60" } :
                  { label: "ACCREDITATION", bg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60" };

                const actionLink = 
                  idx === 0 ? { label: "Explore Courses", path: "/courses" } :
                  idx === 1 ? { label: "View Campuses", path: "/locations" } :
                  { label: "GWO Accreditations", path: "/about/gwo" };

                return (
                  <div 
                    key={idx} 
                    className="group relative bg-white dark:bg-slate-900 p-7 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-amber-400/50 dark:hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top gradient highlight on hover */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div>
                      {/* Header Row: Icon & Tag */}
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 dark:bg-slate-800 text-secondary dark:text-amber-400 group-hover:bg-secondary group-hover:text-amber-400 transition-all duration-500 flex items-center justify-center shadow-xs border border-blue-100/60 dark:border-slate-700 group-hover:scale-105 group-hover:shadow-lg shrink-0">
                          <Icon size={26} className="stroke-[2.2]" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${accentBadge.bg}`}>
                          {accentBadge.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>

                      {/* Description / Bullet Points */}
                      {isList ? (
                        <div className="space-y-2.5 text-left pt-1 mb-6">
                          {item.description.split(/•|\n/).map((line: string, lIdx: number) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{trimmed}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer interactive link / action */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link 
                        to={item.buttonLink || actionLink.path} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors group/link"
                      >
                        <span>{item.buttonText || actionLink.label}</span>
                        <ArrowRight size={13} className="transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case 'content':
      return (
        <section className="py-16 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_12px_40px_-5px_rgba(4,16,36,0.12)] border border-gray-100">
              {section.data.image && (
                <div className="md:w-1/2 relative min-h-[320px] md:min-h-[440px]">
                  <img
                    src={section.data.image}
                    alt={section.data.heading}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#041024]/10 mix-blend-multiply"></div>
                </div>
              )}
              <div className={`${section.data.image ? 'md:w-1/2' : 'w-full'} bg-[#041125] p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="relative z-10">
                  {section.data.subheading && (
                    <span className="text-[#FBBF24] font-bold tracking-widest text-xs md:text-sm uppercase mb-3 block">
                      {section.data.subheading}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold mb-5 leading-tight text-white drop-shadow-sm">
                    {section.data.heading}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-8 font-normal">
                    {section.data.description}
                  </p>
                </div>
                <div className="relative z-10 border-t border-white/20 pt-6 mt-6 md:mt-8 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <span className="text-white/70 font-bold tracking-wider text-[11px] uppercase mb-1 block">
                      TRUSTED PARTNERS
                    </span>
                    <span className="text-lg font-bold text-white tracking-wide">
                      {(section.data.partners && section.data.partners.length > 0) ? (Array.isArray(section.data.partners) ? section.data.partners.join(", ") : section.data.partners) : "GWO Certified"}
                    </span>
                  </div>
                  {section.data.buttonText && (
                    <Link to={section.data.buttonLink || '#'}>
                      <button className="px-7 py-3 rounded-xl text-sm font-bold bg-[#FBBF24] text-[#041024] hover:bg-white hover:text-[#041024] shadow-lg transform hover:scale-105 transition-all duration-300 border-none">
                        {section.data.buttonText}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-20 md:py-28 bg-[#041024] text-white relative overflow-hidden my-8 rounded-3xl" aria-label="Call to Action">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-accent/10 blur-[120px] rounded-full"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
            <div className="md:w-1/2 text-center md:text-left">
              <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 text-accent text-xs md:text-sm font-bold uppercase tracking-widest mb-6 border border-accent/20">
                Start Your Journey
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 leading-tight text-white drop-shadow-md">
                {section.data.heading || "Ready to Advance Your Career?"}
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0 font-normal">
                {section.data.subheading || section.data.description || "Upskill with SKYLAR EDUCATION ASIA today. Book your spot now - classes fill up quickly."}
              </p>
            </div>

            <div className="md:w-1/2 flex flex-col gap-6 w-full max-w-md mx-auto md:mx-0">
              <div className="bg-white/5 backdrop-blur-md border border-white/15 p-6 md:p-7 rounded-3xl flex items-start gap-5 hover:bg-white/10 transition-all duration-300 group shadow-xl">
                <div className="bg-amber-500/20 p-4 rounded-2xl text-accent shrink-0 group-hover:bg-accent group-hover:text-secondary transition-colors duration-300 shadow-inner">
                  <Award size={30} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-xl md:text-2xl mb-2 text-white font-heading tracking-tight">
                    {section.data.badgeTitle || "Internationally Recognised"}
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {section.data.badgeDescription || "All GWO and safety training qualifications are aligned with internationally recognised standards."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 pt-2">
                {section.data.buttonText && (
                  <Link to={section.data.buttonLink || '#'} className="w-full">
                    <button className="w-full bg-accent text-secondary hover:bg-white hover:text-secondary font-extrabold py-4 px-8 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 transform hover:-translate-y-1 text-base md:text-lg flex items-center justify-center gap-3">
                      {section.data.buttonText}
                      <ArrowRight size={22} strokeWidth={2.5} />
                    </button>
                  </Link>
                )}
                <Link to="/contact" className="w-full">
                  <button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-base md:text-lg flex items-center justify-center gap-3">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      );

    case 'accordion': {
      const AccordionSection: React.FC = () => {
        const [openIndex, setOpenIndex] = useState<number | null>(null);
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              {section.data.heading && (
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10 text-secondary">{section.data.heading}</h2>
              )}
              <div className="space-y-4">
                {section.data.items?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-250 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors group"
                    >
                      <span className="font-heading font-bold text-secondary text-sm md:text-base pr-4 group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xl font-black leading-none select-none text-gray-500">
                        {openIndex === idx ? '−' : '+'}
                      </span>
                    </button>
                    {openIndex === idx && (
                      <div className="p-5 md:p-6 pt-0 text-gray-500 text-sm leading-relaxed border-t border-gray-100 whitespace-pre-line bg-gray-50/50">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      };
      return <AccordionSection />;
    }

    case 'team': {
      const TeamSectionRenderer: React.FC = () => {
        const rawItems = section.data.items || [];
        // Only use default seed if the items array is completely empty
        const trainersList = rawItems.length > 0 ? rawItems : [
          {
            title: "Sarah Jenkins",
            description: "Senior Trainer | GWO Specialist",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
            specialties: "GWO BST, Work at Height, First Aid",
            experience: "8 Years",
            bio: "Sarah has over 8 years of specialized experience in wind energy health & safety, certified in full GWO Basic Safety Training modules and tactical high-altitude rescue operations.",
            certifications: "GWO BST Certified Instructor • WINDA Registered • Level 3 First Aid"
          },
          {
            title: "Mike Ross",
            description: "Lead Instructor | High Risk Work",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
            specialties: "Confined Spaces, Rigging/Slinging, Rescue",
            experience: "10 Years",
            bio: "Mike brings a decade of heavy industry and high-risk safety leadership, leading rescue drills and rigging instruction across global wind sites and industrial facilities.",
            certifications: "GWO Lead Instructor • Rigging & Lifting Specialist • Confined Space Master"
          },
          {
            title: "David Vance",
            description: "Wind Energy & Safety Expert",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            specialties: "Blade Repair, GWO ART, Electrical Safety",
            experience: "7 Years",
            bio: "David is an accredited renewable energy technician specializing in composite blade maintenance, electrical safety protocols, and advanced GWO rescue scenarios.",
            certifications: "GWO ART & BTT Instructor • Composite Blade Inspector • Electrical Safety Certified"
          }
        ];

        const [selectedTrainer, setSelectedTrainer] = useState<any | null>(null);
        const [showInquireModal, setShowInquireModal] = useState(false);
        const [modalTab, setModalTab] = useState<'profile' | 'inquire'>('profile');
        const [inquirySent, setInquirySent] = useState(false);
        const [refCode, setRefCode] = useState('');
        const [formData, setFormData] = useState({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          preferredCourse: '',
          message: ''
        });

        const handleOpenModal = (trainer: any, tab: 'profile' | 'inquire' = 'profile') => {
          setSelectedTrainer(trainer);
          setModalTab(tab);
          setShowInquireModal(true);
          setInquirySent(false);
          setFormData(prev => ({
            ...prev,
            preferredCourse: trainer.specialties ? trainer.specialties.split(',')[0].trim() : 'GWO Safety Training'
          }));
        };

        const handleCloseModal = () => {
          setShowInquireModal(false);
          setSelectedTrainer(null);
          setInquirySent(false);
        };

        const handleSubmitInquiry = (e: React.FormEvent) => {
          e.preventDefault();
          if (!formData.fullName || !formData.email || !formData.phone) return;

          const newRef = 'TRN-' + Math.floor(100000 + Math.random() * 900000);
          const nowIso = new Date().toISOString();

          saveInquiry({
            id: 'inq_' + Date.now(),
            referenceCode: newRef,
            studentName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || 'Individual Booking',
            courseTitle: `Instructor Session Request: ${selectedTrainer?.title || 'Skylar Instructor'} (${formData.preferredCourse || 'General'})`,
            location: 'Angeles City, Pampanga Campus / Client Site',
            participantsCount: '1-5',
            message: formData.message || `Inquiry for instructor training session with ${selectedTrainer?.title}.`,
            status: 'New',
            createdAt: nowIso,
            updatedAt: nowIso
          });

          setRefCode(newRef);
          setInquirySent(true);
        };

        return (
          <div className="py-20 md:py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors">
            {/* Subtle design grid lines background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 max-w-[1400px] text-center relative z-10">
              <div className="max-w-2xl mx-auto mb-12">
                <span className="text-xs font-black text-primary dark:text-accent bg-primary/10 dark:bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Certified Instructors
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-3 text-secondary dark:text-white tracking-tight">
                  {section.data.heading || 'Our Team'}
                </h2>
                <div className="w-20 h-1.5 bg-accent mx-auto mb-4 rounded-full" />
                <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base font-medium">
                  {section.data.description || 'Meet the certified safety professionals who will guide you through your training.'}
                </p>
              </div>
              
              {/* Dynamic Grid: 1 to 4 columns depending on item count */}
              <div className={`grid grid-cols-1 ${trainersList.length === 1 ? 'max-w-md mx-auto' : trainersList.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : trainersList.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-4.5 xl:gap-5`}>
                {trainersList.map((item, idx) => {
                  const hasImage = Boolean(item.image && item.image.trim().length > 0);
                  const hasExperience = Boolean(item.experience && item.experience.trim().length > 0);
                  const hasSpecialties = Boolean(item.specialties && item.specialties.trim().length > 0);
                  const hasPosition = Boolean((item.position || item.description) && (item.position || item.description).trim().length > 0);
                  const hasBadge = Boolean(item.badge && item.badge.trim().length > 0);
                  const hasRating = Boolean(item.tag && item.tag.trim().length > 0);

                  return (
                    <div 
                      key={idx} 
                      className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-400 hover:-translate-y-1.5 relative group flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container with Experience & Badge */}
                        <div className="h-64 sm:h-68 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                          {hasImage ? (
                            <img
                              src={item.image}
                              alt={item.title || 'Team Member'}
                              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400 p-4">
                              <UserCheck size={44} className="text-amber-400/70 mb-2" />
                              <span className="text-sm font-bold uppercase tracking-wider text-slate-200">
                                {item.title || 'Team Member'}
                              </span>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none" />

                          {/* Experience Badge - ONLY rendered if user provided experience */}
                          {hasExperience && (
                            <span className="absolute top-3.5 right-3.5 bg-slate-950/90 text-amber-400 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md border border-white/10 z-10 backdrop-blur-md">
                              {item.experience?.includes('Experience') || item.experience?.includes('experience') ? item.experience : `${item.experience} Experience`}
                            </span>
                          )}

                          {/* Optional Badge / Rating Overlay - ONLY rendered if provided */}
                          {(hasBadge || hasRating) && (
                            <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white text-[11px]">
                              {hasBadge && (
                                <span className="inline-flex items-center gap-1 font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15">
                                  <ShieldCheck size={11} className="text-emerald-400" /> {item.badge}
                                </span>
                              )}
                              {hasRating && (
                                <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15">
                                  <Star size={10} className="fill-amber-400 text-amber-400" /> {item.tag}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content Body */}
                        <div className="p-5 sm:p-6 text-left">
                          {item.title && (
                            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-1 tracking-tight leading-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">
                              {item.title}
                            </h3>
                          )}
                          
                          {hasPosition && (
                            <p className="text-primary dark:text-blue-400 font-bold text-xs mb-3 truncate">
                              {item.position || item.description}
                            </p>
                          )}
                          
                          {/* Specialties micro pills - ONLY rendered if user provided specialties */}
                          {hasSpecialties && item.specialties && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">
                                Areas of Expertise
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {item.specialties.split(',').map((spec: string, sIdx: number) => {
                                  const cleanSpec = spec.trim();
                                  if (!cleanSpec) return null;
                                  return (
                                    <span 
                                      key={sIdx} 
                                      className="bg-slate-50 dark:bg-slate-800 text-[10px] font-semibold text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-colors hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400"
                                    >
                                      {cleanSpec}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Modern Trainer Profile & Inquiry Modal ─── */}
            {selectedTrainer && (
              <div 
                className="fixed inset-0 z-[100] overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md flex items-center justify-center animate-fade-in"
                onClick={handleCloseModal}
              >
                <div 
                  className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-gray-200 dark:border-slate-800 shadow-2xl relative text-left overflow-hidden my-auto"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 z-30 w-9 h-9 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>

                  {/* Header Banner (Sticky Top) */}
                  <div className="relative bg-gradient-to-r from-secondary to-[#072147] p-6 sm:p-7 text-white shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10 pr-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl shrink-0 bg-slate-800 flex items-center justify-center">
                        {selectedTrainer.image ? (
                          <img 
                            src={selectedTrainer.image} 
                            alt={selectedTrainer.title || 'Member'} 
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <UserCheck size={36} className="text-amber-400" />
                        )}
                      </div>
                      <div className="text-center sm:text-left flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                          {selectedTrainer.experience && selectedTrainer.experience.trim().length > 0 && (
                            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-sm">
                              {selectedTrainer.experience.includes('Experience') ? selectedTrainer.experience : `${selectedTrainer.experience} Experience`}
                            </span>
                          )}
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                            <ShieldCheck size={11} /> Verified Instructor
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white mb-1">
                          {selectedTrainer.title}
                        </h3>
                        {(selectedTrainer.position || selectedTrainer.description) && (
                          <p className="text-amber-300 font-semibold text-sm mb-1.5">
                            {selectedTrainer.position || selectedTrainer.description}
                          </p>
                        )}
                        <p className="text-xs text-blue-100/80 flex items-center justify-center sm:justify-start gap-1">
                          <MapPin size={12} className="text-amber-400" /> Skylar Education Asia • Angeles City Campus
                        </p>
                      </div>
                    </div>

                    {/* Mode Navigation Tabs */}
                    <div className="flex gap-2 mt-5 pt-4 border-t border-white/10 relative z-10">
                      <button
                        type="button"
                        onClick={() => setModalTab('profile')}
                        className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          modalTab === 'profile'
                            ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <User size={14} /> Full Profile Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalTab('inquire')}
                        className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          modalTab === 'inquire'
                            ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Mail size={14} /> Send Direct Inquiry
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 overscroll-contain bg-slate-50/50 dark:bg-slate-900">
                    {modalTab === 'profile' ? (
                      <div className="space-y-6 animate-fade-in">
                        {/* Profile Biography Card */}
                        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                              Professional Bio & Background
                            </h4>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                            {selectedTrainer.bio || selectedTrainer.description || `${selectedTrainer.title} is an accredited safety and technical instructor at SKYLAR EDUCATION ASIA with comprehensive field expertise in GWO modules, industrial safety operations, and high-altitude safety training.`}
                          </p>
                        </div>

                        {/* Areas of Expertise Grid */}
                        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                          <div className="flex items-center gap-2 mb-3.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                              <Award size={16} />
                            </div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                              Specialties & Instruction Modules
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(selectedTrainer.specialties ? selectedTrainer.specialties.split(',') : ['GWO Basic Safety Training', 'Work at Height Safety', 'Emergency Response', 'Industrial Safety & Rescue']).map((spec: string, i: number) => {
                              const clean = spec.trim();
                              if (!clean) return null;
                              return (
                                <div 
                                  key={i} 
                                  className="flex items-center gap-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                                >
                                  <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                                  <span>{clean}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Credentials & Accreditation Badges */}
                        <div className="bg-gradient-to-br from-slate-900 to-secondary text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">Accredited Instructor</span>
                              <h5 className="font-bold text-sm text-white">SKYLAR EDUCATION ASIA Standard</h5>
                              <p className="text-xs text-slate-300 mt-0.5">Certified trainer for internationally recognized GWO standard safety modules.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setModalTab('inquire')}
                              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Inquire with {selectedTrainer.title}</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Inquiry Form View */
                      <div className="animate-fade-in">
                        {inquirySent ? (
                          <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                              <CheckCircle size={24} />
                            </div>
                            <h5 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                              Inquiry Successfully Submitted!
                            </h5>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                              Thank you! Your reference code is <span className="font-mono font-black">{refCode}</span>. A SKYLAR training coordinator will contact you shortly.
                            </p>
                            <div className="pt-2">
                              <Button 
                                onClick={handleCloseModal}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold cursor-pointer"
                              >
                                Done
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitInquiry} className="space-y-4 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                            <div className="mb-2">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                Direct Instructor Training Request
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Inquire regarding session availability or customized corporate training with {selectedTrainer.title}.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="modal-fullname" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                  Full Name *
                                </label>
                                <input 
                                  id="modal-fullname"
                                  name="fullName"
                                  autoComplete="name"
                                  type="text"
                                  required
                                  value={formData.fullName}
                                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                  placeholder="e.g. Juan Dela Cruz"
                                  className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
                                />
                              </div>
                              <div>
                                <label htmlFor="modal-email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                  Email Address *
                                </label>
                                <input 
                                  id="modal-email"
                                  name="email"
                                  autoComplete="email"
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="e.g. juan@company.com"
                                  className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
                                />
                              </div>
                              <div>
                                <label htmlFor="modal-phone" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                  Phone / WhatsApp *
                                </label>
                                <input 
                                  id="modal-phone"
                                  name="phone"
                                  autoComplete="tel"
                                  type="tel"
                                  required
                                  value={formData.phone}
                                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                  placeholder="e.g. +63 917 123 4567"
                                  className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
                                />
                              </div>
                              <div>
                                <label htmlFor="modal-company" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                  Company / Organization
                                </label>
                                <input 
                                  id="modal-company"
                                  name="company"
                                  autoComplete="organization"
                                  type="text"
                                  value={formData.company}
                                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                                  placeholder="e.g. Wind Energy Corp (Optional)"
                                  className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="modal-course" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Requested Training Course / Modules
                              </label>
                              <input 
                                id="modal-course"
                                name="preferredCourse"
                                autoComplete="off"
                                type="text"
                                value={formData.preferredCourse}
                                onChange={e => setFormData({ ...formData, preferredCourse: e.target.value })}
                                placeholder="e.g. GWO Basic Safety Training or High Risk Work Module"
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none"
                              />
                            </div>

                            <div>
                              <label htmlFor="modal-message" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Message / Details
                              </label>
                              <textarea 
                                id="modal-message"
                                name="message"
                                autoComplete="off"
                                rows={3}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Specify number of participants or target training schedule..."
                                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none resize-none"
                              />
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-3.5 bg-accent hover:bg-amber-400 text-secondary font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                            >
                              Submit Request
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      };
      return <TeamSectionRenderer />;
    }

    default:
      return null;
  }
};
