
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Shield, HelpCircle, CheckCircle, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const Complaints: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('complaints');
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
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* HEADER SECTION */}
      <div className="relative flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
             src={hero?.image || "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=1920"} 
             alt="Communication and Feedback" 
             className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-secondary/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white w-full">
          <div className="max-w-3xl">
            <div className="mb-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                 <Shield size={14} /> Student Rights
               </div>
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              {hero?.heading || "Complaints & Appeals"}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              {hero?.description || "We value your feedback and are committed to resolving issues fairly and transparently."}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-20 bg-white">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-accent rounded-full"></div>
                        <h2 className="text-3xl font-heading font-bold text-secondary">{content?.heading || "Complaints Process"}</h2>
                    </div>
                    
                    <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed mb-8 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm whitespace-pre-line">
                        <p>{content?.description || "If you are dissatisfied with a service offered or treatment received by Skylar Education, then you have the right to lodge a complaint. In the event that you are dissatisfied with the outcome with your complaint, then you have the right to lodge an appeal. Please refer to the Complaints and Appeals Policy that is given to you upon enrolment via the student handbook."}</p>
                    </div>
                </section>
            </div>

            {/* SIDEBAR */}
            <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-secondary px-6 py-5 border-b border-gray-800">
                        <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                            <HelpCircle size={20} className="text-accent" /> Need some help?
                        </h3>
                    </div>
                    <div className="p-6 md:p-8">
                        {formState === 'success' ? (
                            <div className="text-center py-8">
                                <CheckCircle size={32} className="mx-auto text-green-600 mb-4"/>
                                <h4 className="font-bold text-gray-800 mb-2">Request Sent</h4>
                                <button onClick={() => setFormState('idle')} className="text-primary text-sm font-bold mt-4 hover:underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <input id="complaint-email" name="email" autocomplete="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="student@email.com" />
                                </div>
                                <div>
                                    <textarea id="complaint-message" name="message" autocomplete="off" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" placeholder="I have a concern about..."></textarea>
                                </div>
                                <Button type="submit" className="w-full" disabled={formState === 'submitting'}>{formState === 'submitting' ? 'Submitting...' : 'Submit Request'}</Button>
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
