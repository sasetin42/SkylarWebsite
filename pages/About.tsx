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
    // Load content
    const content = getPageContent('about');
    if (content) setPageContent(content);
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
      <section className="relative overflow-hidden mx-4 rounded-3xl bg-gradient-to-r from-accent via-yellow-400 to-amber-400 p-8 md:p-12 shadow-2xl border border-white/20" aria-label="Enrollment Call to Action">
        {/* Abstract vector texture patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full filter blur-3xl -translate-y-12 translate-x-24 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-left max-w-2xl">
                {/* Live Pulse Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary/10 border border-secondary/10 rounded-full text-[11px] font-bold text-secondary uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Sparkles size={11} className="text-secondary" />
                        Next Intake Starts Soon • 5 Seats Left
                    </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary leading-tight tracking-tight mb-3">
                    Ready to launch your career in Renewable Energy?
                </h2>
                <p className="text-sm md:text-base font-semibold text-secondary/80 leading-relaxed mb-6">
                    Join Asia's leading training safety academy. Gain GWO-approved certs, build hands-on skills with top industry instructors, and step directly into in-demand jobs.
                </p>

                {/* Micro highlights grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-2 px-3.5 rounded-xl border border-white/20">
                        <ShieldCheck size={16} className="text-secondary flex-shrink-0" />
                        <span className="text-xs font-bold text-secondary">GWO Accredited</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-2 px-3.5 rounded-xl border border-white/20">
                        <Flame size={16} className="text-secondary flex-shrink-0" />
                        <span className="text-xs font-bold text-secondary">RTO 21647 Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm py-2 px-3.5 rounded-xl border border-white/20">
                        <Sparkles size={16} className="text-secondary flex-shrink-0" />
                        <span className="text-xs font-bold text-secondary">Global Jobs Ready</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:min-w-[280px]">
                <Link to="/courses" className="w-full">
                    <button className="w-full bg-secondary text-white hover:bg-white hover:text-secondary font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-secondary/15 transform hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-transparent hover:border-secondary">
                        <span>Enroll Instantly</span>
                        <ArrowRight size={16} />
                    </button>
                </Link>
                <Link to="/contact" className="w-full">
                    <button className="w-full bg-white/20 hover:bg-white/35 text-secondary font-bold py-4 px-8 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 text-sm uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-sm">
                        <span>Talk to an Advisor</span>
                    </button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};