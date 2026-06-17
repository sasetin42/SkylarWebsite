import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const Team: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    // Load content from 'about' page where team data lives in CMS structure
    const content = getPageContent('about');
    if (content) setPageContent(content);
  }, []);

  const teamSection = pageContent?.sections.find(s => s.id === 'team')?.data;

  const teamMembers = teamSection?.items?.map(item => ({
    name: item.title,
    role: item.description.split('|')[0]?.trim() || item.description,
    dept: item.description.split('|')[1]?.trim() || '',
    image: item.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    qualifications: ''
  })) || [];

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920" alt="Team Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>
        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  Our People
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Skylar Education
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {teamSection?.heading || "Our Team"}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                {teamSection?.description || "Meet the dedicated professionals leading Skylar Education."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-2">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={member.image}
                    alt={member.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm font-medium">{member.qualifications}</p>
                  </div>
                </div>
                <div className="p-6 text-center border-t border-gray-50 relative bg-white z-10">
                  <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{member.name}</h3>
                  <p className="text-gray-800 font-bold text-sm mb-1">{member.role}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};