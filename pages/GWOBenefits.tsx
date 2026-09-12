import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { 
  Shield, Award, Users, CheckCircle, Globe, ArrowRight, 
  Wind, Zap, BookOpen, ChevronDown, ChevronRight, Star,
  TrendingUp, Target, Heart, Clock, MapPin, Phone,
  GraduationCap, HardHat, Eye, Compass
} from 'lucide-react';
import { getTestimonials } from '../services/storageService';
import { Testimonial } from '../types';

const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count}{suffix}</div>;
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button 
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-heading font-bold text-secondary text-sm md:text-base pr-4 group-hover:text-primary transition-colors">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
          <ChevronDown size={16} />
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 md:p-6 pt-0 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const GWOBenefits: React.FC = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const load = () => {
      const all = getTestimonials();
      setDynamicTestimonials(all.filter(t => (t.status || 'Approved') === 'Approved'));
    };
    load();
    window.addEventListener('testimonialsUpdated', load);
    return () => window.removeEventListener('testimonialsUpdated', load);
  }, []);

  const trainingModules = [
    { 
      id: 'basic-safety',
      title: 'Basic Safety Training (BST)',
      icon: Shield,
      color: 'bg-primary',
      courses: [
        { 
          name: 'Working at Heights', 
          isUpcoming: false, 
          description: 'Harness inspection, vertical ladder safety & self-evacuation.' 
        },
        { 
          name: 'Manual Handling', 
          isUpcoming: false, 
          description: 'Ergonomic lifting, spinal safety & heavy component maneuvering.' 
        },
        { 
          name: 'Fire Awareness', 
          isUpcoming: false, 
          description: 'Fire chemistry, extinguisher deployment & turbine egress drills.' 
        },
        { 
          name: 'First Aid', 
          isUpcoming: false, 
          description: 'Life-saving CPR, AED operation & trauma care in remote wind sites.' 
        },
        { 
          name: 'Sea Survival', 
          isUpcoming: true, 
          disabled: true,
          badge: 'Upcoming', 
          description: 'Cold water survival, vessel transfer drills & life raft deployment.' 
        }
      ],
      duration: '3-5 Days',
      description: 'Foundational safety qualifications mandatory for all personnel working on onshore and offshore wind turbines.',
      courseLink: '/courses/gwo-bst-initial'
    },
    {
      id: 'advanced-rescue',
      title: 'Advanced Rescue Training (ART)',
      icon: HardHat,
      color: 'bg-blue-600',
      courses: [
        { 
          name: 'Hub & Spinner Rescue', 
          isUpcoming: false, 
          description: 'High-angle extraction from tight blade roots and rotor hubs.' 
        },
        { 
          name: 'Nacelle & Tower Rescue', 
          isUpcoming: false, 
          description: 'Stretcher lowering down internal ladders and enclosed shafts.' 
        },
        { 
          name: 'Blade & Over-the-Side Rescue', 
          isUpcoming: false, 
          description: 'Controlled descent and external turbine exterior retrieval.' 
        },
        { 
          name: 'Single Rescuer Evacuation', 
          isUpcoming: false, 
          description: 'Solo emergency egress using automated descent controllers.' 
        }
      ],
      duration: '2-4 Days',
      description: 'Specialised high-angle rescue techniques for complex wind turbine emergencies and confined spaces.',
      courseLink: '/courses/gwo-art-initial'
    },
    {
      id: 'technical',
      title: 'Basic Technical Training (BTT)',
      icon: Zap,
      color: 'bg-accent',
      courses: [
        { 
          name: 'Hydraulic Systems', 
          isUpcoming: false, 
          description: 'Pitch system pumps, valves & proportional circuit diagnostics.' 
        },
        { 
          name: 'Electrical Safety & LOTO', 
          isUpcoming: false, 
          description: 'High-voltage isolation, busbar checks & safe multimeters.' 
        },
        { 
          name: 'Mechanical Assembly', 
          isUpcoming: false, 
          description: 'Gearbox alignment, brake servicing & heavy mechanical fittings.' 
        },
        { 
          name: 'Installation & Bolt Torquing', 
          isUpcoming: false, 
          description: 'Flange bolting, hydraulic tensioning & structural assembly.' 
        }
      ],
      duration: '3-7 Days',
      description: 'Technical competencies for turbine erection, commissioning, and scheduled maintenance.',
      courseLink: '/courses/gwo-btt'
    }
  ];

  const testimonials = [
    {
      name: 'Arnel Bautista',
      role: 'Lead Wind Turbine Technician',
      company: 'North Luzon Wind Power Project',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      content: 'GWO Basic Safety Training at SKYLAR EDUCATION ASIA gave me the verified WINDA credentials required for turbine blade and nacelle maintenance in Ilocos Norte. The practical working-at-heights and rescue drills were world-class.',
      rating: 5
    },
    {
      name: 'Engr. Maria Santos-Cruz',
      role: 'HSE & Compliance Manager',
      company: 'Philippine Renewable Energy Dev Corp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      content: 'Having our field engineers GWO-certified ensures full compliance with DOLE OSH standards (RA 11058) and developer safety criteria. The technicians demonstrate superior risk awareness on site.',
      rating: 5
    },
    {
      name: 'Danilo Reyes',
      role: 'Senior Rigger & Heights Specialist',
      company: 'Luzon Energy Infrastructure Services',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      content: 'The hands-on nacelle rescue and manual handling training directly prepared our crew for high-risk onshore and offshore wind assignments across Southeast Asia.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'What is GWO certification and why is it required in the Philippines?',
      a: 'GWO (Global Wind Organisation) certification is the international gold standard for wind energy safety training. In the Philippines, as the Department of Energy accelerates onshore and offshore wind farms, developers and contractors require GWO-certified personnel to ensure compliance with international safety standards and DOLE OSH (RA 11058) requirements.'
    },
    {
      q: 'Are certificates uploaded to the GWO WINDA Database?',
      a: 'Yes, upon successful completion of your training modules at SKYLAR EDUCATION ASIA, your certification is directly uploaded to the Global Wind Organisation WINDA database. This provides an instantly verifiable digital record accessible to wind farm operators worldwide.'
    },
    {
      q: 'How long does GWO Basic Safety Training (BST) take to complete?',
      a: 'The full GWO Basic Safety Training (BST) package typically takes 4 to 5 days, covering Working at Heights, Manual Handling, Fire Awareness, First Aid, and Sea Survival (for offshore deployments). Individual standalone modules can also be completed in 1 to 2 days.'
    },
    {
      q: 'How long is GWO certification valid?',
      a: 'GWO certification is valid globally for 2 years (24 months). To maintain your active status in the WINDA registry, you must complete a GWO BST Refresher (BSTR) course before your current certificate expires.'
    },
    {
      q: 'What career opportunities are available for GWO graduates in the Philippines and abroad?',
      a: 'GWO graduates qualify for high-demand roles including Wind Turbine Technician, HSE Safety Officer, Blade Repair Specialist, Rigging Supervisor, and Offshore Wind Specialist in Philippine wind projects (Ilocos Norte, Rizal, Western Visayas) and international APAC markets (Taiwan, Japan, Australia, Europe).'
    },
    {
      q: 'Does SKYLAR EDUCATION ASIA provide corporate training at client wind farm sites?',
      a: 'Yes. In addition to training at our dedicated Angeles City, Pampanga facility, SKYLAR EDUCATION ASIA provides mobile on-site safety training for corporate clients and wind farm operators across Luzon, Visayas, and Mindanao.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-0">
      <Breadcrumbs />

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=1920" alt="GWO Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>
        {/* Decorative particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-accent/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 left-[25%] w-1.5 h-1.5 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-32 right-[15%] w-2.5 h-2.5 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 right-[30%] w-1.5 h-1.5 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-60 left-[60%] w-1 h-1 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative z-10 pt-[120px] pb-24 text-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <div className="flex flex-wrap gap-2.5 justify-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  <Star size={12} /> Global Standard
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  <Globe size={12} /> Internationally Recognised
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-6 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.15' }}>
                Key Benefits of <span className="text-accent">GWO Certification</span>
              </h1>
              <div className="w-24 h-1.5 bg-accent mx-auto mb-6 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
                Unlocking global career pathways and empowering safety excellence for the Philippines and Asia-Pacific renewable energy sector.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { value: 100, suffix: '%', label: 'WINDA Registry Verified' },
              { value: 35, suffix: '%', label: 'PH 2030 RE Target (DOE)' },
              { value: 60, suffix: '+ GW', label: 'PH Wind Potential Pipeline' }
            ].map((stat, idx) => (
              <div key={idx} className="py-8 md:py-10 text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-500 text-xs md:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Introduction Section ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Philippine Wind Energy Standards</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6 leading-tight">
                Empowering the Philippines' Wind Energy Transition
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Under the Philippine Department of Energy's (DOE) National Renewable Energy Program (NREP) and Executive Order No. 21 for Offshore Wind, the Philippines is rapidly expanding its wind energy capacity across Luzon, Visayas, and Mindanao.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                Operating on active wind farms in Ilocos Norte, Rizal, Aklan, and emerging offshore projects requires rigorous safety protocols. GWO Certification provides technicians with verified WINDA credentials, aligned with international standards and Philippine DOLE OSH (RA 11058) regulations.
              </p>

              {/* Overview Card */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Globe size={20} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-secondary text-lg">GWO & Philippine Industry Alignment</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  GWO is an industry-led non-profit founded by leading wind turbine manufacturers and operators. Standardised training ensures technicians possess verified competencies in working at heights, electrical lockouts, first aid, and complex nacelle rescues—critical for zero-harm operations across Southeast Asia.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                {[
                  'Direct WINDA Registry upload recognized by 500+ global and regional wind operators',
                  'Full alignment with DOLE OSH (RA 11058) high-risk workplace safety mandates',
                  'Hands-on practical rescue, heights, and sea survival simulation at our Angeles City Centre'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-600 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
                  <img src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=600" alt="Wind Turbines" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 mt-8">
                  <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=600" alt="Wind Farm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>

              {/* Build a Stable Future Card */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-[260px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-accent" />
                  </div>
                  <h4 className="font-heading font-bold text-secondary text-sm">Empowering Local Talent</h4>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  SKYLAR EDUCATION ASIA empowers Filipino engineers and technicians with world-class safety skills, opening doors to local and overseas renewable energy careers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Importance of Certification ──────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Industry Standards</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">Importance of Certification</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Why GWO certification is the global benchmark for wind energy safety</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Essential Safety", desc: "Safety certification by recognized bodies like GWO is essential in the industry.", color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Award, title: "Boosts Credibility", desc: "Certification boosts the credibility of technicians across the global market.", color: 'text-accent', bg: 'bg-accent/10' },
              { icon: Users, title: "Employer Assurance", desc: "It assures employers that their workforce has received proper training and competence.", color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: CheckCircle, title: "Operational Excellence", desc: "Sets a high standard for safety and operational excellence.", color: 'text-green-600', bg: 'bg-green-50' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={28} className={item.color} />
                </div>
                <h3 className="font-heading font-bold text-secondary text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Training Modules ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Training Programs</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">GWO Training Modules</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive training programmes designed to meet international safety standards</p>
          </div>

          {/* Module Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {trainingModules.map((mod, idx) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModule(idx)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                  activeModule === idx
                    ? 'bg-[#041024] text-white shadow-xl ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <mod.icon size={18} className={activeModule === idx ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'} />
                {mod.title}
              </button>
            ))}
          </div>

          {/* Module Content */}
          <div className="bg-slate-50 dark:bg-[#071328] rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl transition-colors">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className={`w-14 h-14 ${trainingModules[activeModule].color} rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                  {React.createElement(trainingModules[activeModule].icon, { size: 28, className: 'text-white' })}
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-900 dark:text-white mb-4">
                  {trainingModules[activeModule].title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-sm md:text-base">
                  {trainingModules[activeModule].description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock size={16} className="text-amber-500" />
                    Duration: <span className="font-bold text-slate-900 dark:text-white">{trainingModules[activeModule].duration}</span>
                  </div>
                </div>
                <Link 
                  to={trainingModules[activeModule].courseLink || '/courses?category=GWO'} 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl bg-[#FFC107] text-[#041024] hover:bg-[#e5ac06] shadow-md hover:shadow-lg transition-all group font-sans"
                >
                  CHECK THE COURSE DETAILS <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainingModules[activeModule].courses.map((course, idx) => {
                  const isUpcoming = course.isUpcoming;
                  const isDisabled = course.disabled;

                  const cardContent = (
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isDisabled
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : isUpcoming
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-amber-500/10 dark:bg-amber-500/20 group-hover:bg-amber-500'
                      }`}>
                        <CheckCircle size={15} className={
                          isDisabled
                            ? 'text-amber-600 dark:text-amber-400'
                            : isUpcoming
                            ? 'text-slate-950'
                            : 'text-amber-500 group-hover:text-slate-950 transition-colors'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs sm:text-sm font-bold transition-colors ${
                            isDisabled
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                          }`}>
                            {course.name}
                          </span>
                          {isUpcoming && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                              Upcoming
                            </span>
                          )}
                        </div>
                        {course.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                            {course.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  if (isDisabled) {
                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl border border-dashed border-amber-400/50 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] cursor-not-allowed select-none opacity-85 block relative overflow-hidden"
                        title="This module is currently unavailable"
                      >
                        {cardContent}
                      </div>
                    );
                  }

                  return (
                    <Link 
                      key={idx} 
                      to={trainingModules[activeModule].courseLink || '/courses?category=GWO'}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 group block relative overflow-hidden ${
                        isUpcoming
                          ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08] border-amber-400/50 hover:border-amber-400 hover:shadow-md'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-400/80'
                      }`}
                    >
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Technical & Safety Cards ─────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical Proficiency Card */}
            <div className="bg-secondary rounded-3xl p-8 md:p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap size={28} className="text-accent" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4">Technical Proficiency</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  The GWO standards establish a foundation for technical proficiency. By adhering to these standards, technicians are well-prepared to meet the demands of their roles. This rigorous training methodology ensures that workers are not only competent but also confident in their skills.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Hands-on practical training', 'Industry-standard equipment', 'Real-world scenario practice'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle size={14} className="text-accent shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/courses?category=GWO" className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider hover:text-white transition-colors group/link">
                  Master Your Craft <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Ensuring Technician Safety Card */}
            <div className="bg-blue-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield size={28} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4">Ensuring Technician Safety</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Safety is a top priority in the wind industry. Through GWO certification, technicians learn essential safety practices that minimise risks and maximise operational efficiency. This focus on safety protects workers and helps to sustain the integrity of wind energy projects.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Risk assessment protocols', 'Emergency response procedures', 'Personal protective equipment'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-blue-100 text-sm">
                      <CheckCircle size={14} className="text-white shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/courses?category=GWO" className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider hover:text-blue-200 transition-colors group/link">
                  Prioritise Safety <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits to Employers ────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Heading */}
            <div className="lg:col-span-4">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">For Organizations</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6 leading-tight">
                Benefits to Employers
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Employers benefit significantly from having GWO-certified personnel on their teams. It promotes a culture of safety and professionalism.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Discuss Corporate Training <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right Features */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
              {[
                { icon: Users, title: "Professional Environment", desc: "The structured training environment fostered by GWO promotes a culture of safety and professionalism, ensuring that all team members contribute positively." },
                { icon: CheckCircle, title: "Operational Efficiency", desc: "Certified technicians possess the skills to perform tasks effectively, reducing downtime and ensuring projects are completed on schedule." },
                { icon: TrendingUp, title: "Reduced Insurance Costs", desc: "Companies with GWO-certified workforce often benefit from lower insurance premiums due to demonstrated safety commitment." },
                { icon: Globe, title: "Global Mobility", desc: "GWO certification is recognised worldwide, allowing your workforce to operate across international wind energy markets." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-colors duration-300 group">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon size={24} className="text-primary group-hover:text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-secondary text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">What Our Graduates Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Hear from professionals who have transformed their careers with GWO certification</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(dynamicTestimonials.length > 0 ? dynamicTestimonials.slice(0, 6) : testimonials).map((t: any, idx: number) => (
              <div key={t.id || idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-accent">
                      {Array.from({ length: t.rating || 5 }).map((_, star) => (
                        <Star key={star} size={16} fill="currentColor" className="text-amber-500" />
                      ))}
                    </div>
                    {t.source === 'Google' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Google Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                  <img src={t.avatar || 'https://i.pravatar.cc/150?img=12'} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-secondary text-sm">{t.name}</h4>
                    <p className="text-gray-400 text-xs">{t.role} {t.company ? `at ${t.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Aligning with Renewable Energy Goals ─────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">National Energy Roadmap</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6 leading-tight">
              Aligning with Philippine Clean Energy Goals
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10">
              The Philippine Department of Energy (DOE) is driving an ambitious energy transition under the National Renewable Energy Program (NREP). GWO Certification equips the technical workforce needed to safely construct, commission, and maintain onshore and offshore wind energy infrastructure.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Wind, title: '2030 RE Target', value: '35%', desc: 'Philippine national grid clean energy goal' },
                { icon: Target, title: '2040 RE Goal', value: '50%', desc: 'DOE long-term renewable generation share' },
                { icon: Heart, title: 'Wind Pipeline', value: '60+ GW', desc: 'Offshore & onshore wind contracts awarded' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-2xl font-heading font-bold text-primary mb-1">{item.value}</div>
                  <h4 className="font-bold text-secondary text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ──────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50/50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">Support</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Everything you need to know about GWO certification and training at SKYLAR EDUCATION ASIA.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors">
                Still have questions? Contact us <ArrowRight size={16} />
              </Link>
            </div>
            <div className="lg:col-span-8 space-y-4">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-full bg-white/10 skew-x-12 transform translate-x-32 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4">
              Take the Next Step Towards a Brighter Future!
            </h2>
            <p className="text-secondary/80 text-base md:text-lg leading-relaxed mb-10">
              Discover how GWO Certification can unlock new career opportunities, boost your technical proficiency, and make you an asset in the growing wind energy industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openInquireModal'))}
                className="bg-secondary text-white hover:bg-white hover:text-secondary font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm uppercase tracking-wider hover:-translate-y-0.5"
              >
                Inquire Now
              </button>
              <Link to="/courses?category=GWO">
                <button className="bg-transparent text-secondary border-2 border-secondary hover:bg-secondary hover:text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm uppercase tracking-wider hover:-translate-y-0.5">
                  Browse GWO Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
