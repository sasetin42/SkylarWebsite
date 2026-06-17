
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Search } from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';
import { Button } from '../components/Button';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      return (
        <p key={i} className="mb-3 last:mb-0">
          {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-4">
      <button 
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-3xl font-black leading-none select-none transition-colors ${isOpen ? 'text-primary' : 'text-black'}`}>
          {isOpen ? '−' : '+'}
        </span>
        <span className={`font-bold uppercase tracking-wider text-sm transition-colors ${isOpen ? 'text-primary' : 'text-black'}`}>
          {question}
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-2 text-gray-600 text-sm border-t border-gray-100 bg-gray-50 leading-relaxed">
          {renderContent(answer)}
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [pageContent, setPageContent] = useState<SitePage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const content = getPageContent('faq');
    if (content) setPageContent(content);
  }, []);

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const faqList = pageContent?.sections.find(s => s.id === 'faq_list')?.data;

  const allItems = faqList?.items || [];
  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const heroBg = hero?.image || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920';

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="FAQ Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>

        {/* Content — in normal flow so section auto-expands to fit */}
        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              {/* Accent badges */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  ❓ Help Centre
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Skylar Education Support
                </span>
              </div>
              <h1
                className="font-heading font-bold text-white mb-4 drop-shadow-lg"
                style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}
              >
                Frequently <span className="text-accent">Asked Questions</span>
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed mb-6 text-base md:text-lg">
                Find answers to the most common questions about our courses, enrolment, and training standards.
              </p>

              {/* Search Bar embedded in hero */}
              <div className="flex gap-3 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/40 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-accent focus:bg-white/20 transition-all text-sm backdrop-blur-sm"
                  />
                </div>
                <button className="px-5 py-3 bg-accent text-secondary font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm">
                  Search
                </button>
              </div>
              {searchQuery && (
                <div className="text-left mt-2 text-xs text-gray-300">
                  Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-20">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <section>
              {!searchQuery && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-accent rounded-full"></div>
                  <h2 className="text-3xl font-heading font-bold text-secondary">{faqList?.heading || "General Questions"}</h2>
                </div>
              )}
              
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <FAQItem 
                      key={idx}
                      question={item.title} 
                      answer={item.description} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
