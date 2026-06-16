import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SectionRenderer } from '../components/SectionRenderer';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

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
      <section className="py-20 md:py-24 bg-gradient-to-r from-accent to-yellow-400 relative overflow-hidden mx-4 rounded-3xl" aria-label="Enrollment Call to Action">
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
        <div className="absolute top-0 right-0 w-96 h-full bg-white/20 skew-x-12 transform translate-x-32" aria-hidden="true"></div>
      </section>
    </div>
  );
};