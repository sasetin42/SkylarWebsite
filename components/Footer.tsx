import React, { useState } from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock, MapPin, 
  ChevronUp, CheckCircle, ShieldCheck, Award, CreditCard 
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

  const footerLogo = settings.lightLogoUrl || settings.darkLogoUrl || LOGO_URL;
  const isDefaultLogo = footerLogo === LOGO_URL;

  return (
    <footer className="bg-[#041024] text-white pt-24 md:pt-28 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary-400 to-accent/80" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 mb-12 pb-8 border-b border-white/5">
          
          {/* Brand & Socials Column */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <img 
                    src={footerLogo} 
                    alt="Skylar Education Logo" 
                    className={`h-[28px] w-auto ${isDefaultLogo ? 'brightness-0 invert' : ''}`}
                  />
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Asia's premier safety academy. Delivering world-class GWO, High Risk Work, and industrial safety certifications across the Philippines and broader Asia-Pacific region.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Connect With Us</div>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Facebook"><Facebook size={16} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Twitter"><Twitter size={16} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="Instagram"><Instagram size={16} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary/50 text-gray-400 hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1" aria-label="LinkedIn"><Linkedin size={16} /></a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-l-2 border-accent pl-3">Quick Navigation</h3>
            <ul className="space-y-3.5 text-sm text-gray-400 font-medium">
              <li><Link to="/courses" className="hover:text-accent transition-colors flex items-center gap-1.5 group"><span>All Courses</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span></Link></li>
              <li><Link to="/locations" className="hover:text-accent transition-colors flex items-center gap-1.5 group"><span>Training Locations</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span></Link></li>
              <li><Link to="/student-info" className="hover:text-accent transition-colors flex items-center gap-1.5 group"><span>Student Info Hub</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span></Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors flex items-center gap-1.5 group"><span>About Our Academy</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span></Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors flex items-center gap-1.5 group"><span>Contact Support</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&rarr;</span></Link></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-l-2 border-accent pl-3">Contact Details</h3>
            <ul className="space-y-3.5 text-sm text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Lot 2 Liwayway St, Cor Habagat, Bagumbayan, Angeles, 2009 Pampanga, Philippines
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+63451234567" className="hover:text-accent transition-colors font-mono">+63 45 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:support@skylaredused.com" className="hover:text-accent transition-colors">
                  support@skylaredused.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <span>Mon - Fri (9:00 AM - 5:00 PM)</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-l-2 border-accent pl-3">Stay Updated</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Subscribe to receive updates on upcoming intakes, safety trends, and course announcements.
            </p>
            {subscribed ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form className="space-y-2.5" onSubmit={handleSubscribe}>
                <input 
                  id="subscribe-email"
                  name="subscribeEmail"
                  autocomplete="email"
                  type="email" 
                  required
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#020b18] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm font-semibold shadow-inner"
                />
                <button 
                  type="submit" 
                  className="w-full py-3 bg-accent text-secondary font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom Meta Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Skylar Education Asia Inc. All Rights Reserved.</span>
          </div>

          {/* Accreditation Logos / Trust Badges */}
          <div className="flex items-center gap-4 opacity-50 hover:opacity-85 transition-opacity">
            <div className="flex items-center gap-1" title="GWO Certified Training Provider">
              <Award size={14} className="text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-wider">GWO Provider</span>
            </div>
            <div className="h-3 w-[1px] bg-gray-700" />
            <div className="flex items-center gap-1" title="Registered Training Organization Standards">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Accredited Standards</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/student-info/privacy-notice" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link to="/student-info/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/student-info" className="hover:text-white transition-colors">Student Portal</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
