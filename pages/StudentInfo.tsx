
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Globe, 
  GraduationCap, Calendar, LifeBuoy, Wifi, BookOpen, 
  UserCheck, HeartHandshake, Briefcase, Search, ArrowRight,
  Clock, Mail, Sparkles, Send, Bot, BrainCircuit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchIndustryNews, chatWithGemini } from '../services/geminiService';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ChatMessage, SitePage } from '../types';
import { getPageContent } from '../services/storageService';

// Helper to map icon names to components
const IconMap: Record<string, any> = {
    BookOpen, Wifi, Calendar, LifeBuoy, GraduationCap, Briefcase, UserCheck, Globe, HeartHandshake, FileText
};

interface QuickLinkCardProps {
  icon: any;
  title: string;
  desc: string;
  color: string;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="text-white w-6 h-6" />
    </div>
    <h3 className="font-bold text-secondary text-lg mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

interface ServiceCardProps {
  icon: any;
  title: string;
  desc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-primary">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-secondary mb-1">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// Embedded Chat Component
const StudentAIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I can help with student policies, dates, USI, or LMS questions. What do you need to know?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useReasoning, setUseReasoning] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await chatWithGemini(history, userMsg.text, useReasoning);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      <div className="bg-primary p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <Bot className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Student Services AI</h3>
            <p className="text-blue-200 text-sm">24/7 Instant Support</p>
          </div>
        </div>
        <button 
            onClick={() => setUseReasoning(!useReasoning)}
            className={`flex items-center gap-1 text-xs px-3 py-2 rounded-lg border transition-all ${useReasoning ? 'bg-accent text-secondary border-accent font-bold shadow-lg transform scale-105' : 'bg-white/10 text-blue-100 border-white/20 hover:bg-white/20'}`}
            title="Enable Deep Thinking for complex policy queries"
        >
            <BrainCircuit className={`w-4 h-4 ${useReasoning ? 'animate-pulse' : ''}`} />
            <span>Thinking Mode {useReasoning ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-4" ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <input
            id="student-chat-input"
            name="chatInput"
            autocomplete="off"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={useReasoning ? "Ask a complex question..." : "Ask about USI, fees, or dates..."}
            className="flex-1 pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors flex items-center justify-center shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          AI can make mistakes. Please check important info with student admin.
        </p>
      </div>
    </div>
  );
};

export const StudentInfo: React.FC = () => {
  const [newsQuery, setNewsQuery] = useState('');
  const [newsResult, setNewsResult] = useState<{text: string, links: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    // Load CMS content
    const content = getPageContent('student-info');
    if (content) setPageContent(content);
  }, []);

  const handleNewsSearch = async () => {
    if(!newsQuery) return;
    setIsSearching(true);
    const result = await searchIndustryNews(newsQuery);
    setNewsResult(result);
    setIsSearching(false);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const quickLinks = pageContent?.sections.find(s => s.id === 'quick_links')?.data;
  const support = pageContent?.sections.find(s => s.id === 'support')?.data;
  const policies = pageContent?.sections.find(s => s.id === 'policies')?.data;
  const dates = pageContent?.sections.find(s => s.id === 'dates')?.data;
  const downloads = pageContent?.sections.find(s => s.id === 'downloads')?.data;
  const aiChat = pageContent?.sections.find(s => s.id === 'ai_chat')?.data;
  const industryPulse = pageContent?.sections.find(s => s.id === 'industry_pulse')?.data;

  // Colors for quick links cycling
  const quickLinkColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-500'];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Breadcrumbs />
      
      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img src={hero?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920"} alt="Student Hub" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>
        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  <GraduationCap size={12} /> Student Central
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Skylar Education
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {hero?.heading || 'Your hub for success.'}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                {hero?.description || 'Access your learning portal, download key resources, and find support for your academic journey at Skylar Education.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid - Floating Overlap */}
      <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {(quickLinks?.items || []).map((item, idx) => {
               const Icon = IconMap[item.icon || 'BookOpen'] || BookOpen;
               const color = quickLinkColors[idx % quickLinkColors.length];
               return (
                   <QuickLinkCard key={idx} icon={Icon} title={item.title} desc={item.description} color={color} />
               );
           })}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 grid lg:grid-cols-3 gap-12">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Support Services */}
          <section>
            <h2 className="text-2xl font-heading font-bold text-secondary mb-6 flex items-center gap-2">
              <HeartHandshake className="text-accent" /> {support?.heading || 'Student Support'}
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-4">
               {(support?.items || []).map((item, idx) => {
                   const Icon = IconMap[item.icon || 'GraduationCap'] || GraduationCap;
                   return (
                       <ServiceCard 
                         key={idx}
                         icon={Icon} 
                         title={item.title} 
                         desc={item.description} 
                       />
                   );
               })}
            </div>
          </section>

          {/* Key Policies */}
          <section>
            <h2 className="text-2xl font-heading font-bold text-secondary mb-6 flex items-center gap-2">
              <FileText className="text-accent" /> {policies?.heading || 'Key Policies'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(policies?.items || []).map((item, idx) => {
                  const isRefund = item.title === "Refund Policy";
                  const isPrivacy = item.title === "Privacy Notice" || item.title.includes("Privacy"); 
                  const isComplaints = item.title === "Complaints" || item.title.includes("Complaints");
                  
                  return (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-2 text-secondary">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">
                        {item.description}
                        </p>
                        {isRefund ? (
                            <Link to="/student-info/refund-policy" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                Read full policy <ArrowRight size={14}/>
                            </Link>
                        ) : isPrivacy ? (
                            <Link to="/student-info/privacy-notice" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                Read full policy <ArrowRight size={14}/>
                            </Link>
                        ) : isComplaints ? (
                            <Link to="/student-info/complaints" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                Read full policy <ArrowRight size={14}/>
                            </Link>
                        ) : (
                            <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                Read full policy <ArrowRight size={14}/>
                            </a>
                        )}
                    </div>
                  );
              })}
            </div>
          </section>

          {/* Embedded Student AI Assistant */}
          <section className="scroll-mt-24" id="ai-chat">
             <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-secondary flex items-center gap-2">
                  <Bot className="text-accent" /> {aiChat?.heading || 'Still have questions?'}
                </h2>
                <p className="text-gray-600">{aiChat?.description || 'Our virtual assistant can help you find answers about policies, dates, and enrollment instantly.'}</p>
             </div>
             <StudentAIChat />
          </section>

          {/* AI Search Grounding Integration */}
          <section className="bg-gradient-to-br from-blue-900 to-secondary rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Search className="text-accent w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">{industryPulse?.heading || 'Industry Pulse'}</h2>
              </div>
              <p className="text-blue-100 mb-8 max-w-lg">
                {industryPulse?.description || 'Stay ahead of the curve. Use our AI-powered tool to scan real-time web sources for the latest trends and news in your field of study.'}
              </p>
              
              <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex gap-2 border border-white/20 mb-8">
                <input 
                  id="news-search"
                  name="newsSearch"
                  autocomplete="off"
                  type="text" 
                  value={newsQuery}
                  onChange={(e) => setNewsQuery(e.target.value)}
                  placeholder="e.g., 'Wind turbine safety trends 2025' or 'Hospitality wages Australia'"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-blue-200 focus:outline-none"
                />
                <Button onClick={handleNewsSearch} disabled={isSearching} className="shrink-0 bg-accent text-secondary hover:bg-white hover:text-primary border-none w-32">
                  {isSearching ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div> Scanning...</span> : 'Search News'}
                </Button>
              </div>
              
              {newsResult && (
                <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg animate-fade-in-up">
                  <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <Globe size={16} /> Search Results
                  </h4>
                  <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{newsResult.text}</p>
                  
                  {newsResult.links.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Sources</p>
                      <ul className="text-xs space-y-2">
                        {newsResult.links.map((link, i) => (
                          <li key={i} className="flex items-start gap-2 text-blue-600 truncate">
                            <ArrowRight size={12} className="mt-0.5 shrink-0 text-gray-400" />
                            {link.web?.uri ? (
                              <a href={link.web.uri} target="_blank" rel="noreferrer" className="hover:underline">
                                {link.web.title || link.web.uri}
                              </a>
                            ) : 'Source unavailable'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Important Dates Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-secondary mb-4 flex items-center gap-2">
              <Calendar className="text-primary w-5 h-5" /> {dates?.heading || 'Important Dates'}
            </h3>
            <div className="space-y-4">
              {(dates?.items || [
                { title: 'Feb 24', description: 'Semester 1 Begins', icon: 'start' },
                { title: 'Mar 10', description: 'Census Date', icon: 'critical' },
                { title: 'Apr 14', description: 'Mid-Semester Break', icon: 'break' },
                { title: 'Jun 02', description: 'Final Assessment Week', icon: 'exam' },
              ]).map((item, idx) => {
                const type = item.icon || 'default';
                return (
                <div key={idx} className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
                    type === 'critical' ? 'bg-red-50 border-red-100 text-red-600' : 
                    type === 'break' ? 'bg-green-50 border-green-100 text-green-600' :
                    'bg-gray-50 border-gray-100 text-secondary'
                  }`}>
                    <span className="text-xs font-bold uppercase">{item.title.split(' ')[0]}</span>
                    <span className="text-sm font-bold">{item.title.split(' ')[1]}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.description}</span>
                </div>
              )})}
            </div>
          </div>

          {/* Forms & Downloads Widget */}
          <div className="bg-primary text-white rounded-2xl p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Download className="text-accent" /> {downloads?.heading || 'Downloads'}
            </h3>
            <ul className="space-y-3">
              {(downloads?.items || [
                { title: 'Student Handbook 2025' },
                { title: 'Enrollment Form (PDF)' },
                { title: 'Credit Transfer Application' },
                { title: 'Complaint & Appeal Form' },
                { title: 'USI Consent Form' }
              ]).map((item, idx) => (
                <li key={idx}>
                   <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group text-left">
                    <span className="text-sm font-medium">{item.title}</span>
                    <Download className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="font-bold text-sm mb-2 text-accent">Need something else?</h4>
              <p className="text-xs text-gray-300 mb-4">Contact student administration for specific document requests.</p>
              <a href="mailto:admin@skylareducation.edu.au" className="flex items-center gap-2 text-sm font-bold hover:text-accent transition-colors">
                <Mail size={16} /> admin@skylareducation.edu.au
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
