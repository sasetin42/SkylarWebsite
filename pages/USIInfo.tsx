
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { FileText, ExternalLink, HelpCircle, CheckCircle, Shield, Play, Plus, Minus } from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const USIInfo: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [pageContent, setPageContent] = useState<SitePage | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    const content = getPageContent('usi');
    if (content) setPageContent(content);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* HEADER SECTION */}
      <div className="relative flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
             src={hero?.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1920"} 
             alt="Student Studying" 
             className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-secondary/85 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white w-full">
          <div className="max-w-3xl">
            <div className="mb-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                 <Shield size={14} /> Student Essentials
               </div>
            </div>

            <h1 className="font-heading font-bold text-2xl md:text-3xl mb-6">
              {hero?.heading || "Unique Student Identifier (USI)"}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              {hero?.description || "Your Key to Unlocking Opportunities in Vocational Education."}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-20 bg-white">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Video Section */}
            <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-6 leading-tight">
                    Get Your Unique Student Identifier (USI) - The Key to Unlock Your Future in Vocational Education and Training
                </h2>
                <div className="relative aspect-video w-full bg-slate-100 rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-gray-100">
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                        alt="USI Video Placeholder"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-secondary/30 group-hover:bg-secondary/40 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-white/10">
                            <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <h2 className="text-3xl font-heading font-bold text-secondary mb-6">
                    Unique Student Identifier
                </h2>
                
                <div className="prose prose-lg text-gray-600 max-w-none space-y-6 leading-relaxed">
                    <p>
                        Every year almost four million Australians build and sharpen their skills by undertaking nationally recognised training. All students doing nationally recognised training need to have a Unique Student Identifier (USI). This includes students doing Vocational Education Training (VET) when they are still at school (VET for secondary students).
                    </p>
                    <p>
                        From 1 January 2015 it is a requirement of the Federal Government that all students undertaking nationally recognised training will need to obtain a Unique Student Identifier (USI). This involves an easy online application. See <a href="https://www.usi.gov.au/students/get-a-usi" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">USI Fact Sheet</a> for information on how to apply for a USI or see <a href="https://www.usi.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">here</a> for additional information.
                    </p>
                </div>
            </div>

            {/* Accordion Section */}
            <div className="space-y-4">
                {[
                    {
                        id: 'what-is',
                        title: 'WHAT IS A USI',
                        content: (
                            <>
                                A Unique Student Identifier (USI) is a reference number that gives each student in Australia a unique identity for their educational achievements. It is a requirement for anyone studying a nationally recognised training course in Australia. The USI creates an online record of a student’s qualifications and achievements, allowing them to access their training records and transcripts from one central location. It also makes it easier for employers and educational institutions to verify a student’s qualifications and track their progress throughout their education and career. Creating a USI is free and can be done via the <a href="https://www.usi.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">usi website</a>
                            </>
                        )
                    },
                    {
                        id: 'already-have',
                        title: 'ALREADY HAVE A USI?',
                        content: (
                            <div>
                                <h3 className="font-bold text-lg text-secondary mb-4">There are 4 ways to find your USI</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                    <h4 className="font-bold text-primary mb-2">Email address</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li>Enter the email address saved on your USI account and click ‘Submit’.</li>
                                        <li>An email will be sent to you containing your USI details.</li>
                                        <li>Be sure to check your spam/junk mail folder if it doesn’t arrive in your inbox.</li>
                                    </ul>
                                    </div>

                                    <div>
                                    <h4 className="font-bold text-primary mb-2">Mobile number</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li>Enter the mobile number saved on your USI account and your date of birth and click ‘Submit’.</li>
                                        <li>You will receive an SMS containing your USI details. If you do not receive an SMS, please contact us.</li>
                                    </ul>
                                    </div>

                                    <div>
                                    <h4 className="font-bold text-primary mb-2">Personal details and check questions</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li>The USI Registry System asks you to fill out your Family Name, Date of Birth and Gender and at least one of the following: First/Given Name, Middle Name, or Town/City of Birth.</li>
                                        <li>Click ‘Submit’. You will then have to answer your two check questions. The answers must have identical spelling to what you first used when setting your check questions.</li>
                                        <li>Once answered correctly, your USI will appear on the screen.</li>
                                    </ul>
                                    </div>

                                    <div>
                                    <h4 className="font-bold text-primary mb-2">Personal details and an ID document</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li>You must enter your First/Given and Family/Last Names, Date of Birth, Gender, Town/City of Birth, and either your Email Address, Mobile Number or Postal Address (Postal address appears after Country of Residence has been entered).</li>
                                        <li>Click ‘Submit’. Select your ‘Document Type’. Click ‘Next’. Fill in your document details and click ‘Next’.</li>
                                        <li>Your USI will appear on the screen.</li>
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ].map((item) => (
                    <div key={item.id} className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
                        <button 
                            onClick={() => toggleAccordion(item.id)}
                            className="w-full flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors text-left focus:outline-none"
                        >
                            {activeAccordion === item.id ? (
                                <Minus className="w-6 h-6 text-black shrink-0" strokeWidth={3} />
                            ) : (
                                <Plus className="w-6 h-6 text-black shrink-0" strokeWidth={3} />
                            )}
                            <span className="font-heading font-bold text-lg text-black tracking-wider uppercase">{item.title}</span>
                        </button>
                        <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${activeAccordion === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
                                {item.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="font-heading font-bold text-secondary text-lg flex items-center gap-2">
                        <FileText size={20} className="text-primary" /> Official Links
                    </h3>
                </div>
                <div className="p-6 space-y-3">
                    <a 
                        href="https://www.usi.gov.au/students" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:text-primary group-hover:bg-white transition-colors">
                                <ExternalLink size={20} />
                            </div>
                            <div>
                                <span className="block font-bold text-gray-800 text-sm">USI Student Portal</span>
                                <span className="block text-xs text-gray-500">Login or Create USI</span>
                            </div>
                        </div>
                    </a>
                    <a 
                        href="https://www.usi.gov.au/help" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:text-primary group-hover:bg-white transition-colors">
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <span className="block font-bold text-gray-800 text-sm">Forgotten USI?</span>
                                <span className="block text-xs text-gray-500">Recover your details</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-secondary px-6 py-5 border-b border-gray-800">
                    <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                        <HelpCircle size={20} className="text-accent" /> Need assistance?
                    </h3>
                </div>
                <div className="p-6 md:p-8">
                    {formState === 'success' ? (
                        <div className="text-center py-8">
                            <CheckCircle size={32} className="mx-auto text-green-600 mb-4"/>
                            <h4 className="font-bold text-gray-800 mb-2">Request Sent</h4>
                            <p className="text-sm text-gray-500 mb-4">We'll help you locate your USI shortly.</p>
                            <button onClick={() => setFormState('idle')} className="text-primary text-sm font-bold hover:underline">Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                                <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="email@address.com" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Message</label>
                                <textarea rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="I'm having trouble with my USI..."></textarea>
                            </div>
                            <Button type="submit" className="w-full shadow-lg" disabled={formState === 'submitting'}>{formState === 'submitting' ? 'Sending...' : 'Get Support'}</Button>
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
