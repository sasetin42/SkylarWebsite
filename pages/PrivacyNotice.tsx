
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { 
  Lock, FileText, Shield, Mail, Phone, Globe, HelpCircle, CheckCircle,
  Plus, Minus, ChevronDown
} from 'lucide-react';
import { getPageContent } from '../services/storageService';
import { SitePage } from '../types';

export const PrivacyNotice: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('privacy-notice');
    if (content) setPageContent(content);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const toggleNewSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const policies = pageContent?.sections.find(s => s.id === 'policies')?.data;
  const privacyAccordions = pageContent?.sections.find(s => s.id === 'privacy_accordions')?.data;

  const complianceSections = privacyAccordions?.items && privacyAccordions.items.length > 0
    ? privacyAccordions.items.map((item, idx) => ({
        id: `cms-acc-${idx}`,
        title: item.title,
        content: item.description
      }))
    : [
    {
        id: 'use',
        title: 'HOW WE USE YOUR PERSONAL INFORMATION',
        content: "We use your personal information to enable us to deliver VET courses to you, and otherwise, as needed, to comply with our obligations as an RTO."
    },
    {
        id: 'disclose',
        title: 'HOW WE DISCLOSE YOUR PERSONAL INFORMATION',
        content: "We are required by law (under the National Vocational Education and Training Regulator Act 2011 (Cth) (NVETR Act)) to disclose the personal information we collect about you to the National VET Data Collection kept by the National Centre for Vocational Education Research Ltd (NCVER). The NCVER is responsible for collecting, managing, analysing and communicating research and statistics about the Australian VET sector.\n\nWe are also authorised by law (under the NVETR Act) to disclose your personal information to the relevant state or territory training authority."
    },
    {
        id: 'ncver',
        title: 'HOW THE NCVER AND OTHER BODIES HANDLE YOUR PERSONAL INFORMATION',
        content: `The NCVER will collect, hold, use and disclose your personal information in accordance with the law, including the Privacy Act 1988 (Cth) (Privacy Act) and the NVETR Act. Your personal information may be used and disclosed by NCVER for purposes that include populating authenticated VET transcripts; administration of VET; facilitation of statistics and research relating to education, including surveys and data linkage; and understanding the VET market.

The NCVER is authorised to disclose information to the Australian Government Department of Education, Skills and Employment (DESE), Commonwealth authorities, State and Territory authorities (other than registered training organisations) that deal with matters relating to VET and VET regulators for the purposes of those bodies, including to enable:

-administration of VET, including program administration, regulation, monitoring and evaluation
-facilitation of statistics and research relating to education, including surveys and data linkage
-understanding how the VET market operates, for policy, workforce planning and consumer information.

The NCVER may also disclose personal information to persons engaged by NCVER to conduct research on NCVER’s behalf.

The NCVER does not intend to disclose your personal information to any overseas recipients.

For more information about how the NCVER will handle your personal information please refer to the NCVER’s Privacy Policy at www.ncver.edu.au/privacy.

If you would like to seek access to or correct your information, in the first instance, please contact Skylar Education using the contact details listed below.

DESE is authorised by law, including the Privacy Act and the NVETR Act, to collect, use and disclose your personal information to fulfil specified functions and activities. For more information about how the DESE will handle your personal information, please refer to the DESE VET Privacy Notice at https://www.dese.gov.au/national-vet-data/vet-privacy-notice

Please refer to the additional State or Territory Authority Privacy Notice included in this application process should this be relevant to your application.`
    },
    {
        id: 'surveys',
        title: 'SURVEYS',
        content: "You may receive a student survey which may be run by a government department or an NCVER employee, agent, third-party contractor or another authorised agency. Please note you may opt out of the survey at the time of being contacted."
    },
    {
        id: 'contact',
        title: 'CONTACT INFORMATION',
        content: `At any time, you may contact us to:

o request access to your personal information
o correct your personal information
o make a complaint about how your personal information has been handled
o ask a question about this Privacy Notice`
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img src={hero?.image || "https://images.unsplash.com/photo-1535083252457-6080fe29be45?auto=format&fit=crop&q=80&w=1920"} alt="Privacy and Security" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>
        <div className="relative z-10 py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  <Shield size={12} /> Privacy & Security
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Enrolments
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {hero?.heading || "Privacy Notice"}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                {hero?.description || "How we handle and protect your personal information."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-20 bg-white">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-12">
            <section>
                <h2 className="text-3xl font-heading font-bold text-black mb-4">{policies?.heading || "Why we collect your personal information"}</h2>
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed mb-8">
                    <p>
                        As a registered training organisation (RTO), we collect your personal information so we can process and manage your enrolment in a vocational education and training (VET) course with us.
                    </p>
                </div>
            </section>

            {/* NEW ACCORDIONS (Learner Portal Style) */}
            <section className="space-y-6">
                {complianceSections.map((section) => (
                    <div key={section.id} className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${openSections[section.id] ? 'shadow-xl ring-1 ring-primary/10 transform -translate-y-1' : 'shadow-sm hover:shadow-md'}`}>
                        <button 
                            onClick={() => toggleNewSection(section.id)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white hover:bg-gray-50 transition-colors group focus:outline-none"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm shrink-0 ${openSections[section.id] ? 'bg-primary text-white rotate-90' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                    {openSections[section.id] ? <Minus size={24} /> : <Plus size={24} />}
                                </div>
                                <div>
                                    <span className="block font-heading font-bold text-secondary text-base md:text-lg uppercase tracking-wide group-hover:text-primary transition-colors">{section.title}</span>
                                </div>
                            </div>
                            <div className={`transform transition-transform duration-500 ${openSections[section.id] ? 'rotate-180 text-primary' : 'rotate-0 text-gray-300'}`}>
                                <ChevronDown size={24} />
                            </div>
                        </button>
                        
                        <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${openSections[section.id] ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 pt-4 text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Existing Accordions (if any exist from CMS that are not duplicates) */}
            {(policies?.items || []).length > 0 && (
                <section className="space-y-4 pt-8 border-t border-gray-100">
                    <h3 className="font-heading font-bold text-gray-400 uppercase tracking-widest text-sm mb-4">Additional Policies</h3>
                    {(policies?.items || []).map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <button
                                onClick={() => toggleAccordion(`pol-${idx}`)}
                                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <span className="text-3xl font-black leading-none text-black select-none">+</span>
                                <span className="font-bold text-black uppercase tracking-wider text-sm">{item.title}</span>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeAccordion === `pol-${idx}` ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 pt-2 border-t border-gray-100 bg-gray-50 text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}
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
                                <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="student@email.com" />
                            </div>
                            <div>
                                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" placeholder="Privacy question..."></textarea>
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
