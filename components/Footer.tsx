import React, { useState } from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock, MapPin, 
  ChevronUp, CheckCircle, ShieldCheck, Award, CreditCard,
  BookOpen, Compass, GraduationCap, Info, Headphones, ArrowRight, Sparkles, HelpCircle, Check,
  FileText, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/storageService';
import { LOGO_URL } from '../constants';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState(getSettings());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  React.useEffect(() => {
    const handleThemeUpdate = () => {
      setSettings(getSettings());
    };
    window.addEventListener('themeUpdated', handleThemeUpdate);
    return () => window.removeEventListener('themeUpdated', handleThemeUpdate);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLogo = settings.darkLogoUrl || settings.lightLogoUrl || LOGO_URL;
  const isDefaultLogo = footerLogo === LOGO_URL;

  return (
    <footer className="bg-[#041024] text-white pt-10 md:pt-12 pb-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary-400 to-accent/80" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 mb-6 pb-6 border-b border-white/5">
          
          {/* Brand & Socials Column (Span 3.5 / 12) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <img 
                    src={footerLogo} 
                    alt="SKYLAR EDUCATION ASIA Logo" 
                    className="h-[52px] md:h-[64px] w-auto brightness-0 invert logo-color-white object-contain"
                  />
                </div>
              </Link>
              <p className="text-gray-400 text-xs leading-relaxed pr-2">
                {settings.footerDescription || "Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). Training is delivered by Skylar Education Asia, while certifications are issued through Skylar Education Pty Ltd Australia in accordance with applicable international training standards."}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Connect With Us</div>
              <div className="flex gap-2.5">
                <a href="https://www.facebook.com/skylarasiapac/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Facebook (Skylar Asia Pac)"><Facebook size={15} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Twitter"><Twitter size={15} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Instagram"><Instagram size={15} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="LinkedIn"><Linkedin size={15} /></a>
              </div>
            </div>
          </div>

          {/* Quick Links Column - 14px font with Icons */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white border-l-2 border-accent pl-2.5">Quick Navigation</h3>
            <ul className="space-y-2.5 font-medium" style={{ fontSize: '14px' }}>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-accent transition-colors flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-accent/90 group-hover:scale-110 transition-transform shrink-0" />
                    <span>All Courses</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-gray-300 hover:text-accent transition-colors flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <Compass size={16} className="text-accent/90 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Training Locations</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/student-info" className="text-gray-300 hover:text-accent transition-colors flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap size={16} className="text-accent/90 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Student Info Hub</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <Info size={16} className="text-accent/90 group-hover:scale-110 transition-transform shrink-0" />
                    <span>About Our Academy</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2.5">
                    <Headphones size={16} className="text-accent/90 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Contact Support</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white border-l-2 border-accent pl-2.5">Contact Details</h3>
            <ul className="space-y-2.5 text-gray-300 font-medium" style={{ fontSize: '13px' }}>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Lot 2 Liwayway St, Cor Habagat, Bagumbayan, Angeles, 2009 Pampanga, Philippines
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+639683824294" className="hover:text-accent transition-colors font-mono">+63 968 382 4294</a>
                  <a href="tel:+639159029406" className="hover:text-accent transition-colors font-mono">+63 915 902 9406</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:bon@skylarasia.com" className="hover:text-accent transition-colors">
                    bon@skylarasia.com
                  </a>
                  <a href="mailto:junrey@skylarasia.com" className="hover:text-accent transition-colors">
                    junrey@skylarasia.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Mon - Fri (8:00 AM - 5:00 PM)</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (Expanded to 3 Columns / Widescreen Field) */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-white border-l-2 border-accent pl-2.5">Stay Updated</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Subscribe to receive updates on upcoming intakes, safety trends, and course announcements.
            </p>
            {subscribed ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form className="space-y-2.5 w-full" onSubmit={handleSubscribe}>
                <div className="relative w-full">
                  <input 
                    id="subscribe-email"
                    name="subscribeEmail"
                    autoComplete="email"
                    type="email" 
                    required
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#020b18] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-semibold shadow-inner"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-accent text-secondary font-bold rounded-xl hover:bg-yellow-400 transition-all text-xs uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>


        </div>

        {/* Footer Bottom Meta Section */}
        <div className="pt-2 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} SKYLAR EDUCATION ASIA All Rights Reserved.</span>
          </div>

          {/* Accreditation Logos / Trust Badges */}
          <div className="flex items-center gap-4 opacity-50 hover:opacity-85 transition-opacity">
            <div className="flex items-center gap-1" title="GWO Certified Training Provider">
              <Award size={14} className="text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-wider">GWO Provider</span>
            </div>
            <div className="h-3 w-[1px] bg-gray-700" />
            <div className="flex items-center gap-1" title="Certified International Safety Standards">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Certified Standards</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center items-center">
            <Link 
              to="/student-info/privacy-notice" 
              className="hover:text-white text-gray-400 flex items-center gap-1.5 transition-all hover:text-accent group"
            >
              <ShieldCheck size={13} className="text-accent/80 group-hover:scale-110 transition-transform" />
              <span>Privacy Notice</span>
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link 
              to="/terms-of-service" 
              className="hover:text-white text-gray-400 flex items-center gap-1.5 transition-all hover:text-accent group"
            >
              <FileText size={13} className="text-accent/80 group-hover:scale-110 transition-transform" />
              <span>Terms &amp; Conditions</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
