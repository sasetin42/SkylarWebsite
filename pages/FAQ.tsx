
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
  
  // Format answer for bold text **text** and newlines
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Skip empty lines to avoid empty paragraphs if multiple newlines exist
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
    // Load CMS content
    const content = getPageContent('faq');
    if (content) setPageContent(content);
  }, []);

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const faqList = pageContent?.sections.find(s => s.id === 'faq_list')?.data;

  // Search Logic
  const allItems = faqList?.items || [];
  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* HEADER SECTION - Static Hero */}
      <div className="relative flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
             src={hero?.image || "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920"} 
             alt="FAQ Background" 
             className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white w-full">
          <div className="max-w-3xl">
            {/* Title */}
            <h1 className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Frequently Asked Questions
            </h1>
            
            {/* Subtitle Badge */}
            <div className="mb-6">
               <div className="bg-[#0072CE] text-white font-bold text-xs md:text-sm px-4 py-1 uppercase tracking-[0.15em] shadow-lg transform -skew-x-12 inline-block">
                  <div className="transform skew-x-12">Skylar Education Help</div>
               </div>
            </div>

            {/* Search Bar */}
            <div className="w-full">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <input 
                        type="text"
                        placeholder="Search FAQs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-white/60 rounded-sm text-white placeholder-gray-300 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm shadow-sm"
                    />
                </div>
                <button className="px-4 py-3 bg-transparent border border-white/60 text-white hover:bg-white hover:text-secondary transition-colors rounded-sm shadow-sm">
                    <Search size={20} />
                </button>
            </div>
            {/* Optional: Show active search term below */}
            {searchQuery && (
                <div className="text-left mt-2 text-xs text-gray-300">
                    Showing results for "{searchQuery}" ({filteredItems.length})
                </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-20 bg-white">
        {/* Centered layout - max-w-3xl for optimal reading width, no sidebar */}
        <div className="max-w-3xl mx-auto">
          
          <div className="space-y-8">
            <section>
                {/* Only show heading if not searching, or if searching but keep context */}
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
