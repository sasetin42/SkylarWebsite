
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../constants';
import { Calendar, ArrowRight } from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';
import { Button } from '../components/Button';

export const Blog: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('news');
    if (content) setPageContent(content);
  }, []);

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const featured = pageContent?.sections.find(s => s.id === 'featured')?.data;
  const cta = pageContent?.sections.find(s => s.id === 'cta')?.data;

  const heroBg = hero?.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1920';

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative h-[380px] overflow-hidden bg-secondary border-b-4 border-accent pt-[80px]">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Blog Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center z-10 pt-[80px]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl animate-fade-in-up">
              {/* Accent badges */}
              <div className="flex flex-wrap gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  ✍ Industry Insights
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Safety Updates
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Skylar News
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: '50px' }}>
                {hero?.heading || 'News'} <span className="text-accent">&amp; Articles</span>
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed" style={{ fontSize: '18px' }}>
                {hero?.description || 'Stay updated with the latest industry trends, safety standards, and institute announcements.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-10">
        
        {/* Featured Content Header if configured */}
        {featured?.heading && (
            <div className="mb-6 animate-fade-in text-center md:text-left">
                {featured.subheading && <span className="text-accent font-bold uppercase tracking-widest text-xs">{featured.subheading}</span>}
                <h2 className="text-2xl font-bold text-gray-800">{featured.heading}</h2>
            </div>
        )}

        {/* Featured / Latest Post (First item) */}
        {BLOG_POSTS.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100 group">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden">
                <img 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {BLOG_POSTS[0].date}</span>
                  <span className="px-2 py-1 bg-accent/20 text-secondary rounded font-bold text-xs uppercase">{BLOG_POSTS[0].category}</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-secondary mb-4 hover:text-primary transition-colors cursor-pointer">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {BLOG_POSTS[0].excerpt}
                </p>
                <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  Read Full Article <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-lg group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full text-secondary shadow-sm">
                    {post.category}
                   </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Calendar size={12} />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="mt-auto flex items-center gap-1 text-sm font-bold text-primary hover:text-secondary transition-colors">
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {BLOG_POSTS.length < 2 && (
             <div className="col-span-full text-center py-12 text-gray-500">
                More articles coming soon.
             </div>
          )}
        </div>

      </div>

      {/* Newsletter CTA Section */}
      {cta && (
        <div className="container mx-auto px-4 md:px-8 mt-20 animate-fade-in-up">
            <div className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-heading font-bold mb-4">{cta.heading}</h2>
                    <p className="text-blue-100 mb-8 text-lg">{cta.subheading}</p>
                    {cta.buttonText && (
                        <Button variant="secondary" onClick={() => window.location.href = cta.buttonLink || '#subscribe'} className="px-8 py-3 text-lg font-bold shadow-lg">
                            {cta.buttonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
