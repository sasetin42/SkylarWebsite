
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Building, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getPageContent } from '../services/storageService';
import { supabaseClient } from '../services/supabaseClient';
import { SitePage } from '../types';
import { Link } from 'react-router-dom';

// Helper to map icon names to components
const IconMap: Record<string, any> = {
    Phone, Mail, MapPin, Clock, Globe, Building
};

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    const content = getPageContent('contact');
    if (content) setPageContent(content);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const id = await supabaseClient.saveContactSubmission({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile || undefined,
        message: formData.message,
      });
      if (id) {
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const info = pageContent?.sections.find(s => s.id === 'info')?.data;
  const hours = pageContent?.sections.find(s => s.id === 'hours')?.data;
  const formIntro = pageContent?.sections.find(s => s.id === 'form_intro')?.data;

  // Default hero bg if no CMS image
  const heroBg = hero?.image || 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1920';

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Breadcrumbs />

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        {/* BG image — truly behind, fills whatever height content needs */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Contact Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>

        {/* Content — in normal flow so section auto-expands to fit */}
        <div className="relative z-10 pt-[120px] pb-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              {/* Accent badges */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  ✉ 24HR Response
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Friendly Support Team
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Multiple Locations
                </span>
              </div>

              <h1
                className="font-heading font-bold text-white mb-4 drop-shadow-lg"
                style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}
              >
                Contact <span className="text-accent">Skylar Education</span>
              </h1>

              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />

              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                {hero?.description || 'Whether you need to book a group session, verify a certificate, or ask about our courses, our team is ready to assist.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-5 border border-gray-100">
          
          {/* Form Side */}
          <div className="p-8 md:p-12 lg:col-span-3">
            
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-heading font-bold text-secondary mb-4">Message Sent!</h2>
                <p className="text-gray-600 text-lg max-w-md mb-8">
                  Thank you for contacting Skylar Education. Our student support team has received your enquiry and will respond within 24 hours.
                </p>
                <Button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', mobile: '', message: '' }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-heading font-bold text-secondary mb-2">{formIntro?.heading || 'Send us a message'}</h2>
                    <p className="text-gray-500">{formIntro?.description || "Fill out the form below and we'll get back to you shortly."}</p>
                </div>
                
                {status === 'error' && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                    Something went wrong. Please try again or contact us directly via phone.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#041024]/20 focus:border-[#041024] transition-all" 
                      placeholder="Name"
                    />
                  </div>
                  
                  <div>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#041024]/20 focus:border-[#041024] transition-all" 
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <input 
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      type="tel" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#041024]/20 focus:border-[#041024] transition-all" 
                      placeholder="Mobile (optional)"
                    />
                  </div>

                  <div>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5} 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#041024]/20 focus:border-[#041024] transition-all resize-none"
                      placeholder="Message"
                    ></textarea>
                  </div>

                  {/* reCAPTCHA Mock */}
                  <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded shadow-sm w-full max-w-[304px] h-[78px] p-3 pl-4 pr-2 flex items-center justify-between select-none">
                      <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-[#c1c1c1] bg-white rounded-sm cursor-pointer hover:border-gray-400 transition-colors"></div>
                          <span className="text-sm font-medium text-gray-700 font-sans">I'm not a robot</span>
                      </div>
                      <div className="flex flex-col items-center mr-1">
                          <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 h-8 opacity-70 mb-0.5" />
                          <div className="text-[10px] text-gray-500 text-center leading-tight">
                              reCAPTCHA<br/>
                              <span className="text-[8px] text-gray-500"><a href="#" className="hover:underline">Privacy</a> - <a href="#" className="hover:underline">Terms</a></span>
                          </div>
                      </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 text-base font-bold uppercase tracking-wider bg-primary hover:bg-[#041024]/80 text-white rounded-md shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041024] disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Enquiry'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Info Side */}
          <div className="bg-secondary text-white p-8 md:p-12 lg:col-span-2 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8 border-b border-white/10 pb-4">{info?.heading || 'Contact Information'}</h2>
              <div className="space-y-8">
                 {(info?.items || []).map((item, idx) => {
                     const Icon = IconMap[item.icon || 'Phone'] || Phone;
                     const isHeadOffice = item.title.includes('Head Office') || item.title.includes('Location');
                     
                     return (
                        <div key={idx} className="flex items-start gap-4 group">
                            <div className="bg-white/10 p-4 rounded-xl group-hover:bg-accent group-hover:text-secondary transition-colors duration-300">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading font-semibold text-lg text-accent group-hover:text-white transition-colors">{item.title}</h3>
                                <p className="text-gray-300 whitespace-pre-line mb-2">{item.description}</p>
                                {isHeadOffice && (
                                    <Link to="/locations" className="text-xs font-bold text-accent hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors mt-2">
                                        View All Locations <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                     );
                 })}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-accent mt-1" />
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{hours?.heading || 'Office Hours'}</h3>
                  <div className="space-y-1 text-sm text-gray-300 w-full">
                     {(hours?.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-8 w-full min-w-[200px]">
                            <span>{item.title}</span>
                            <span>{item.description}</span>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
