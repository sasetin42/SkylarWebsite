
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCourses } from '../services/storageService';
import { LOCATIONS } from '../constants';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const courses = getCourses();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and not at the very top (threshold 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        // Show if scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // If we are on the home page, don't show breadcrumbs
  if (location.pathname === '/') return null;

  const getBreadcrumbName = (value: string, index: number, arr: string[]) => {
    // Check if it's a course ID
    const course = courses.find(c => c.id === value);
    if (course) return course.title;

    // Check if it's a location ID
    const loc = LOCATIONS.find(l => l.id === value);
    if (loc) return loc.name;

    // Standard mapping
    const map: Record<string, string> = {
      courses: 'Courses',
      about: 'About Us',
      'gwo-benefits': 'GWO Certification',
      locations: 'Locations',
      'student-info': 'Student Info',
      'online-enrolments': 'Online Enrolments',
      'refund-policy': 'Refund Policy',
      'privacy-notice': 'Privacy Notice',
      usi: 'USI Information',
      complaints: 'Complaints',
      faq: 'Frequently Asked Questions',
      contact: 'Contact',
      news: 'News & Articles',
      checkout: 'Checkout',
      'my-learning': 'My Learning',
      team: 'Our Team'
    };

    if (map[value]) return map[value];

    // Fallback: Capitalize first letter
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`pt-24 pb-4 px-4 md:px-8 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto">
        <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 font-medium">
          <li>
            <Link 
              to="/" 
              className="flex items-center hover:text-primary transition-colors hover:scale-105 transform duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const name = getBreadcrumbName(value, index, pathnames);

            return (
              <li key={to} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-300 mx-1 flex-shrink-0" />
                {isLast ? (
                  <span className="text-secondary font-bold truncate max-w-[200px] md:max-w-none" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link 
                    to={to} 
                    className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
