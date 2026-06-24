
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, ChevronDown,
  Info, Users, Award, Shield,
  FileText, HelpCircle, Laptop, CreditCard, Lock, AlertCircle,
  Sun, Moon
} from 'lucide-react';
import { getCart, getSettings } from '../services/storageService';
import { LOGO_URL } from '../constants';

export const Navbar: React.FC = () => {
  const [settings, setSettings] = useState(getSettings());
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

  useEffect(() => {
    const handleThemeUpdate = () => {
      setSettings(getSettings());
    };
    window.addEventListener('themeUpdated', handleThemeUpdate);
    return () => window.removeEventListener('themeUpdated', handleThemeUpdate);
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
            <Link to="/" className="flex items-center gap-2 group z-50">
              <img
                src={(!isSolid || isDarkMode) ? (settings.lightLogoUrl || settings.darkLogoUrl || LOGO_URL) : (settings.darkLogoUrl || LOGO_URL)}
                alt="Skylar Education"
                className={`h-10 md:h-[42px] -ml-2 md:-ml-4 w-auto transition-all duration-300 ${(!isSolid || isDarkMode) && !settings.lightLogoUrl ? 'brightness-0 invert' : (isSolid && !isDarkMode && !settings.darkLogoUrl ? 'brightness-0' : '')}`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.subItems && link.subItems.some(sub => location.pathname === sub.path));
                return (
                  <div
                    key={link.name}
                    className="relative group py-4 flex items-center"
                  >
                    <Link
                      to={link.path}
                      className={`text-xs font-semibold uppercase tracking-widest transition-all duration-300 relative flex items-center gap-1 py-1.5 px-3 rounded-lg ${
                        isActive
                          ? (isSolid ? 'text-primary' : 'text-accent')
                          : (isSolid ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-accent')
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.subItems && <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180 opacity-75" />}
                      
                      {/* Active & Hover Slider Line */}
                      <span className={`absolute bottom-[-16px] left-3 right-3 h-[2px] bg-accent transform transition-transform duration-300 origin-center ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {link.subItems && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/10 border border-slate-100 overflow-hidden p-2">
                          {link.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group/item ${
                                  isSubActive ? 'bg-secondary text-white' : 'hover:bg-secondary text-slate-700'
                                }`}
                              >
                                <div className={`p-2 rounded-lg transition-all duration-300 ${
                                  isSubActive
                                    ? 'bg-white/20 text-accent'
                                    : 'bg-slate-100 text-secondary group-hover/item:bg-white/20 group-hover/item:text-white'
                                }`}>
                                  {subItem.icon && <subItem.icon size={16} className="transition-transform duration-300 group-hover/item:scale-110" />}
                                </div>
                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                  isSubActive
                                    ? 'text-white font-bold'
                                    : 'text-slate-700 group-hover/item:text-white'
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
