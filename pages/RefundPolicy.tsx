
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { 
  CheckCircle, 
  HelpCircle, Shield, Send, Plus, Minus
} from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const RefundPolicy: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('refund-policy');
    if (content) setPageContent(content);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const details = pageContent?.sections.find(s => s.id === 'details')?.data;
  const policyAccordions = pageContent?.sections.find(s => s.id === 'policy_accordions')?.data;

  // Read items from CMS or fallback to defaults
  const policyItems = policyAccordions?.items && policyAccordions.items.length > 0
    ? policyAccordions.items
    : [
        {
          title: "TUITION FEES",
          description: `If you choose to withdraw from a face-to-face course, we will provide you with a full refund of any tuition fees paid if you notify us in writing at least 10 business days before the course commencement date.

          If you withdraw 5 business days or less prior to the commencement of a program you will be entitled to a refund of up to 50% of the course fees paid.

          If you withdraw within 24 hours of the course commencing, you will not be entitled to a refund.

          No refund will be provided if you withdraw after the course commencement date.`
        },
        {
          title: "REFUND PROCESSING",
          description: `Approved refund will be implemented within 10 business days. Refunds will be made to the bank account or credit card used for the initial payment. Please note that any non-refundable fees or charges associated with your payment method will not be refunded.

          We reserve the right to amend this refund policy from time to time. If we do, we will notify you by email and update the policy on our website.`
        }
      ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* HEADER SECTION */}
      <div className="relative flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <img 
             src={hero?.image || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1920"} 
             alt="Financial Documents" 
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
              {hero?.heading || "Refund Policy & Procedure"}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              {hero?.description || "Our commitment to fair trading and transparent financial processes for all students."}
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
                    <h2 className="text-3xl font-heading font-bold text-secondary">{details?.heading || "Overview"}</h2>
                </div>
                
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed mb-8">
                    <p>
                        We strive to provide high-quality training and education to our students. We understand that sometimes circumstances change, and you may need to cancel or withdraw from your course. Our refund policy aims to provide a fair and transparent process for students who choose to withdraw from their course.
                    </p>
                </div>
            </section>

            {/* Accordions */}
            <section className="space-y-4">
                {policyItems.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <button
                            onClick={() => toggleAccordion(`acc-${idx}`)}
                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none group"
                        >
                            <span className={`text-2xl font-black leading-none select-none transition-transform duration-300 ${activeAccordion === `acc-${idx}` ? 'text-primary rotate-45' : 'text-black'}`}>+</span>
                            <span className="font-heading font-bold text-black uppercase tracking-wider text-base group-hover:text-primary transition-colors">{item.title}</span>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeAccordion === `acc-${idx}` ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 pt-2 border-t border-gray-100 bg-gray-50 text-gray-600 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-line">
                                {item.description}
                            </div>
                        </div>
                    </div>
                ))}
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
                            <p className="text-gray-500 text-sm">Our finance team will assist you shortly.</p>
                            <button onClick={() => setFormState('idle')} className="text-primary text-sm font-bold mt-4 hover:underline">Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <input id="refund-email" name="email" autocomplete="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="student@email.com" />
                            </div>
                            <div>
                                <textarea id="refund-message" name="message" autocomplete="off" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" placeholder="I have a question about..."></textarea>
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
