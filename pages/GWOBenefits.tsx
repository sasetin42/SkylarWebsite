import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionRenderer } from '../components/SectionRenderer';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const GWOBenefits: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('about');
    if (content) setPageContent(content);
  }, []);

  // Filter GWO sections
  const gwoSections = pageContent?.sections.filter(s => s.id.startsWith('gwo_')) || [];

  return (
    <div className="bg-white min-h-screen pb-24">
      <Breadcrumbs />
      
      <div className="animate-fade-in-up">
        {gwoSections.map((section, idx) => (
            <SectionRenderer key={idx} section={section} />
        ))}
      </div>

      {/* Manual CTA if gwo_cta missing */}
      {!gwoSections.find(s => s.id === 'gwo_cta') && (
        <section className="py-20 md:py-24 bg-gradient-to-r from-primary to-blue-900 relative overflow-hidden mx-4 rounded-3xl mt-12">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="container mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                <div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-white">Get Certified Today</h2>
                    <p className="text-lg md:text-xl font-medium text-blue-100">Start your career in wind energy with globally recognised training.</p>
                </div>
                <Link to="/courses">
                    <button className="bg-accent text-secondary hover:bg-white hover:text-primary font-bold py-4 md:py-5 px-10 md:px-12 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg uppercase tracking-wide focus:outline-none focus:ring-4 focus:ring-white/50 border-4 border-transparent hover:border-accent">
                        View GWO Courses
                    </button>
                </Link>
            </div>
        </section>
      )}
    </div>
  );
};