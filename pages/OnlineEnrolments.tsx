
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { 
  FileText, HelpCircle, CheckCircle, 
  Laptop, ChevronDown, Plus, Minus, Send
} from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const OnlineEnrolments: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('online-enrolments');
    if (content) setPageContent(content);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const content = pageContent?.sections.find(s => s.id === 'content')?.data;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* HEADER SECTION */}
      <div className="relative flex items-center justify-center overflow-hidden h-[350px] md:h-[450px]">
        <div className="absolute inset-0 animate-fade-in">
          <img 
             src={hero?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920"} 
             alt="Online Learning" 
             className="w-full h-full object-cover transform scale-105" 
          />
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white w-full flex flex-col justify-center h-full animate-fade-in-up">
          <div className="max-w-3xl">
            <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-lg">
                 <Laptop size={14} /> Student Portal
               </div>
            </div>

            <h1 className="font-heading font-bold leading-tight tracking-tight text-4xl md:text-6xl mb-6 drop-shadow-xl">
              {hero?.heading || "Enrol Anytime, Anywhere"}
            </h1>
            
            <p className="text-lg md:text-2xl text-blue-100 leading-relaxed font-light">
              {hero?.description || "Secure, fast, and accessible 24/7 from any device."}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-12">
            
            <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="h-12 w-1.5 bg-gradient-to-b from-accent to-yellow-500 rounded-full shadow-sm"></div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary tracking-tight">{content?.heading || "Online Enrolments"}</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">{content?.subheading || "Digital Registration System"}</p>
                    </div>
                </div>
                
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-6 relative z-10 whitespace-pre-line">
                    <p>
                        {content?.description || `Enrolling in any of our courses has never been easier! With our easy-to-use online enrolment form, you can enrol straight into our system from the comfort of your own home. Our enrolment process is designed to be fast and hassle-free, giving you more time to focus on your studies. Plus, with our secure and reliable online system, you can rest assured that your enrolment details are safe and protected. So why wait? Enrol in one of our courses today and take the first step towards achieving your career goals!`}
                    </p>
                </div>
            </section>

            {/* Interactive Learner Portal Accordion - Static functionality */}
            <section>
                <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${isPortalOpen ? 'shadow-xl ring-1 ring-primary/10 transform -translate-y-1' : 'shadow-sm hover:shadow-md'}`}>
                    <button 
                        onClick={() => setIsPortalOpen(!isPortalOpen)}
                        className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white hover:bg-gray-50 transition-colors group focus:outline-none"
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${isPortalOpen ? 'bg-primary text-white rotate-90' : 'bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                {isPortalOpen ? <Minus size={24} /> : <Plus size={24} />}
                            </div>
                            <div>
                                <span className="block font-heading font-bold text-secondary text-lg group-hover:text-primary transition-colors">Learner Portal</span>
                                <span className="text-sm text-gray-500 font-medium">Access your course materials</span>
                            </div>
                        </div>
                        <div className={`transform transition-transform duration-500 ${isPortalOpen ? 'rotate-180 text-primary' : 'rotate-0 text-gray-300'}`}>
                            <ChevronDown size={24} />
                        </div>
                    </button>
                    
                    <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isPortalOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-8 pt-4 text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed text-base md:text-lg">
                            <p className="mb-4">
                                As a student enrolled in our courses, you will gain instant access to our learner portal. This convenient online platform allows you to easily track your progress, view upcoming workshop details, and access online assessments.
                            </p>
                            <p>
                                You will also have access to personalised support and feedback from our experienced trainers, ensuring you have the resources and guidance you need to succeed. Best of all, our learner portal can be accessed via your iOS device, providing you with flexibility and convenience for your studies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Documents Section */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-8">
                    <h3 className="font-heading font-bold text-secondary text-xl mb-6 flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent"><FileText size={20}/></div>
                        Documents
                    </h3>
                    
                    <a href="#" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-primary/30 hover:bg-blue-50/50 hover:shadow-md transition-all duration-300 group/link">
                        <div className="p-3 bg-white rounded-xl text-primary shadow-sm group-hover/link:scale-110 group-hover/link:text-accent transition-all">
                            <FileText size={24} />
                        </div>
                        <span className="font-bold text-gray-700 group-hover/link:text-primary text-sm transition-colors leading-tight">
                            Download Online Enrolments Guide (PDF)
                        </span>
                    </a>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div className="bg-secondary px-8 py-6 border-b border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <h3 className="font-heading font-bold text-white text-xl flex items-center gap-3 relative z-10">
                        <HelpCircle size={24} className="text-accent" /> Need some help?
                    </h3>
                    <p className="text-blue-200 text-sm mt-2 relative z-10 font-medium">Have questions about the enrolment process?</p>
                </div>
                
                <div className="p-8">
                    {formState === 'success' ? (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pop-in shadow-inner">
                                <CheckCircle size={40} />
                            </div>
                            <h4 className="font-heading font-bold text-gray-800 text-2xl mb-2">Enquiry Sent!</h4>
                            <p className="text-gray-500 mb-8">Our support team has received your message and will contact you shortly.</p>
                            <button onClick={() => setFormState('idle')} className="text-primary font-bold hover:text-secondary hover:underline transition-colors text-sm uppercase tracking-wide">Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="group/field">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-focus-within/field:text-primary transition-colors">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm placeholder-gray-400 focus:bg-white"
                                    placeholder="email@address.com" 
                                />
                            </div>
                            <div className="group/field">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-focus-within/field:text-primary transition-colors">Message</label>
                                <textarea 
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm resize-none placeholder-gray-400 focus:bg-white"
                                    placeholder="How can we help?" 
                                ></textarea>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full justify-center py-4 text-sm font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-r from-primary to-blue-800 hover:to-primary rounded-xl"
                                disabled={formState === 'submitting'}
                            >
                                {formState === 'submitting' ? (
                                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Send Enquiry <Send size={16}/></span>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};
