
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-10 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block mb-6">
               <div className="flex items-center gap-2">
                  <img 
                    src={LOGO_URL} 
                    alt="Skylar Education" 
                    className="h-10 w-auto"
                  />
                  <span className="font-heading font-bold text-2xl text-white">Skylar</span>
               </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Australia's premier provider of GWO, High Risk Work, industrial safety, and renewable energy training.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/locations" className="hover:text-accent transition-colors">Locations</Link></li>
              <li><Link to="/student-info" className="hover:text-accent transition-colors">Student Handbook</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-accent transition-colors">All Courses</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <a href="tel:1300333883" className="hover:text-accent transition-colors">1300 333 883</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Email Us
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span>Mon-Fri 9:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for course updates and industry safety news.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
              />
              <button className="w-full py-3 bg-accent text-secondary font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; 2025 Skylar Education. RTO ID: 45000 | ABN: 12 345 678 901. Privacy Policy</p>
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
