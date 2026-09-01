import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionRenderer } from '../components/SectionRenderer';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export const About: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const loadContent = () => {
      const content = getPageContent('about');
      if (content) setPageContent(content);
    };
    loadContent();
    window.addEventListener('sitePagesUpdated', loadContent);
    return () => window.removeEventListener('sitePagesUpdated', loadContent);
  }, []);

  // Filter out GWO specific sections for the main About page
  const aboutSections = pageContent?.sections.filter(s => 
    !s.id.startsWith('gwo_')
  ) || [];

  return (
    <div className="bg-white min-h-screen pb-24">
      <Breadcrumbs />
      
      <div className="animate-fade-in-up">
        {aboutSections.map((section, idx) => (
            <SectionRenderer key={idx} section={section} />
        ))}
      </div>

      {/* Call to Action - Hardcoded fallback if not in CMS or just to ensure it's there */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent via-yellow-400 to-amber-400 py-8 md:py-10 px-5 sm:px-8 md:px-10 shadow-2xl border border-white/20" aria-label="Enrollment Call to Action">
          {/* Abstract vector texture patterns */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full filter blur-3xl -translate-y-12 translate-x-24 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full filter blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="text-left flex-1 min-w-0">
              {/* Live Pulse Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary/10 border border-secondary/10 rounded-full text-[11px] font-bold text-secondary uppercase tracking-wider mb-3.5 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-secondary" />
                  Next Intake Starts Soon • 5 Seats Left
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-secondary leading-tight tracking-tight mb-2.5">
                Ready to launch your career in Renewable Energy?
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-secondary/80 leading-relaxed mb-5 max-w-3xl">
                Develop the skills, confidence, and competency required to work safely in the global wind industry. Our internationally aligned training combines realistic practical scenarios with industry-specific instruction to prepare individuals for real-world operations.
              </p>

              {/* Micro highlights grid */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-1.5 px-3 rounded-xl border border-white/20">
                  <ShieldCheck size={15} className="text-secondary flex-shrink-0" />
                  <span className="text-xs font-bold text-secondary">Internationally Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-1.5 px-3 rounded-xl border border-white/20">
                  <Flame size={15} className="text-secondary flex-shrink-0" />
                  <span className="text-xs font-bold text-secondary">GWO Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-1.5 px-3 rounded-xl border border-white/20">
                  <Sparkles size={15} className="text-secondary flex-shrink-0" />
                  <span className="text-xs font-bold text-secondary">Global Jobs Ready</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto lg:min-w-[240px] shrink-0">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openInquireModal'))}
                className="w-full bg-secondary text-white hover:bg-white hover:text-secondary font-bold py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-secondary/15 transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-transparent hover:border-secondary cursor-pointer"
              >
                <span>Inquire Now</span>
                <ArrowRight size={15} />
              </button>
              <Link to="/contact" className="w-full">
                <button className="w-full bg-white/20 hover:bg-white/35 text-secondary font-bold py-3.5 px-6 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer">
                  <span>Talk to an Advisor</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};