
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, ChevronDown,
  Info, Users, Award, Shield,
  FileText, HelpCircle, Laptop, CreditCard, Lock, AlertCircle,
  Sun, Moon
} from 'lucide-react';
import { getCart } from '../services/storageService';
import { LOGO_URL } from '../constants';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCart().length);
    };
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  // Theme Initialization
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Determine styles based on page and scroll state
  const isSolid = !isHome || isScrolled;

  const navBackgroundClass = isSolid
    ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-2'
    : 'bg-transparent py-4';

  const linkColorClass = isSolid
    ? 'text-secondary hover:text-primary'
    : 'text-white/90 hover:text-white';

  const mobileToggleClass = isSolid ? 'text-secondary' : 'text-white';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    {
      name: 'About',
      path: '/about',
      subItems: [
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Our Team', path: '/about/team', icon: Users },
        { name: 'GWO Certification', path: '/about/gwo-benefits', icon: Award }
      ]
    },
    { name: 'Locations', path: '/locations' },
    {
      name: 'Student Info',
      path: '/student-info',
      subItems: [
        { name: 'Student Hub', path: '/student-info', icon: Laptop },
        { name: 'Online Enrolments', path: '/student-info/online-enrolments', icon: FileText },
        { name: 'USI Information', path: '/student-info/usi', icon: Shield },
        { name: 'Policies & Refund', path: '/student-info/refund-policy', icon: CreditCard },
        { name: 'Privacy Notice', path: '/student-info/privacy-notice', icon: Lock },
        { name: 'Complaints', path: '/student-info/complaints', icon: AlertCircle },
        { name: 'FAQ', path: '/student-info/faq', icon: HelpCircle }
      ]
    },
    { name: 'Contact', path: '/contact' },
  ];

  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ease-in-out h-20 flex items-center ${navBackgroundClass}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group z-50">
              <img
                src={LOGO_URL}
                alt="Skylar Education"
                className={`h-8 md:h-10 w-auto transition-all duration-300 ${isSolid ? 'brightness-0' : ''}`}
              />
              <div className="flex flex-col">
                <span className={`font-heading font-bold text-xl leading-none transition-colors ${isSolid ? 'text-secondary' : 'text-white'}`}>Skylar</span>
                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isSolid ? 'text-gray-500' : 'text-gray-300'}`}>Education</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.subItems && link.subItems.some(sub => location.pathname === sub.path));
                return (
                  <div
                    key={link.name}
                    className="relative group py-2 flex items-center"
                    onMouseEnter={() => handleMouseEnter(link.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={link.path}
                      className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 relative flex items-center gap-1 py-1.5 px-3 rounded-lg ${
                        isActive
                          ? (isSolid ? 'text-primary bg-slate-100/60 dark:bg-slate-800/40' : 'text-white bg-white/10')
                          : linkColorClass
                      } hover:bg-slate-100/40 dark:hover:bg-slate-800/20`}
                    >
                      {link.name}
                      {link.subItems && <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                    </Link>

                    {/* Dropdown Menu */}
                    {link.subItems && activeDropdown === link.name && (
                      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 pt-4 w-72 animate-fade-in-up">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl dark:shadow-black/20 border border-slate-100/80 dark:border-slate-800/80 overflow-hidden p-2">
                          {link.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group/item ${
                                  isSubActive ? 'bg-slate-50 dark:bg-slate-850/60' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-300 ${
                                  isSubActive
                                    ? 'bg-secondary text-accent dark:bg-slate-800'
                                    : 'bg-slate-100 dark:bg-slate-800/50 text-secondary dark:text-slate-300 group-hover/item:bg-secondary dark:group-hover/item:bg-accent group-hover/item:text-accent dark:group-hover/item:text-secondary'
                                }`}>
                                  {subItem.icon && <subItem.icon size={16} className="transition-transform duration-300 group-hover/item:scale-110" />}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                  isSubActive
                                    ? 'text-secondary dark:text-accent font-bold'
                                    : 'text-slate-700 dark:text-slate-300 group-hover/item:text-secondary dark:group-hover/item:text-white'
                                }`}>
                                  {subItem.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all ${isSolid
                    ? 'hover:bg-gray-100 text-secondary'
                    : 'hover:bg-white/20 text-white'
                  }`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/admin" className="relative group" title="Admin Panel">
                <div className={`p-2.5 rounded-full transition-all ${isSolid ? 'bg-gray-100 text-secondary hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  <Lock size={20} />
                </div>
              </Link>

              <Link to="/checkout" className="relative group">
                <div className={`p-2.5 rounded-full transition-all ${isSolid ? 'bg-gray-100 text-secondary hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm animate-pop-in">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link to="/courses">
                <button className={`px-7 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl ${isSolid
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'bg-white text-secondary hover:bg-gray-100'
                  }`}>
                  Enroll Now
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all ${isSolid
                    ? 'active:bg-gray-100 text-secondary'
                    : 'active:bg-white/20 text-white'
                  }`}
              >
                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>

              <Link to="/checkout" className="relative">
                <div className={`p-2 rounded-full ${isSolid ? 'text-secondary' : 'text-white'}`}>
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 focus:outline-none transition-transform active:scale-95 ${mobileToggleClass}`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-secondary/95 dark:bg-gray-900/95 backdrop-blur-xl transition-all duration-300 lg:hidden flex flex-col pt-24 px-6 overflow-y-auto ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
        <div className="flex flex-col gap-4 text-center">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col border-b border-white/5 pb-2">
              {link.subItems ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                    className="flex items-center justify-between w-full text-xl font-heading font-bold text-white hover:text-accent transition-colors py-2"
                  >
                    {link.name}
                    <ChevronDown size={20} className={`transition-transform ${mobileExpanded === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${mobileExpanded === link.name ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                    {link.subItems.map(subItem => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                      >
                        {subItem.icon && <subItem.icon size={16} />}
                        <span className="text-sm font-medium">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className="text-xl font-heading font-bold text-white hover:text-accent transition-colors py-2 text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
            <button className="w-full py-4 bg-accent text-secondary font-bold rounded-xl text-lg shadow-xl">
              Enroll Now
            </button>
          </Link>
        </div>

        <div className="mt-auto pb-8 text-center text-white/40 text-sm">
          <p>© 2025 Skylar Education</p>
          <div className="flex justify-center gap-4 mt-4">
            <span>RTO #45000</span>
            <span>•</span>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </>
  );
};
