import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock, MapPin, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from '../constants';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-secondary text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
               <div className="flex items-center gap-3">
                  <img 
                    src={LOGO_URL} 
                    alt="Skylar Education" 
                    className="h-10 w-auto brightness-0 invert"
                  />
                  <span className="font-heading font-bold text-2xl text-white tracking-wide">Skylar</span>
               </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Asia's premier provider of GWO, High Risk Work, industrial safety, and renewable energy training.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 tracking-wide text-white">Quick Links</h3>
            <ul className="space-y-3.5 text-sm text-gray-400 font-medium">
              <li><Link to="/locations" className="hover:text-accent transition-colors">Locations</Link></li>
              <li><Link to="/student-info" className="hover:text-accent transition-colors">Student Handbook</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-accent transition-colors">All Courses</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 tracking-wide text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Lot 2 Liwayway St, Cor Habagat, Bagumbayan, Angeles, 2009 Pampanga, Philippines
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+63451234567" className="hover:text-accent transition-colors">+63 45 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Email Us
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <span>Mon-Fri 9:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 tracking-wide text-white">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Subscribe for course updates and industry safety news.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-[#041024] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm font-semibold"
              />
              <button 
                type="submit" 
                className="w-full py-3 bg-accent text-secondary font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-4">
            <button 
              onClick={scrollToTop} 
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Scroll to top"
            >
              <ChevronUp size={16} />
            </button>
            <span>&copy; 2026 Skylar Education Asia Inc. All Rights Reserved. privacy-notice</span>
          </div>
          <div className="flex gap-6">
            <Link to="/student-info/privacy-notice" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/student-info" className="hover:text-white transition-colors">Student Information</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
