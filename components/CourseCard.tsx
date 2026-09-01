import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Clock, DollarSign, ArrowRight, ShoppingCart, Check, Calendar, Shield, Award, Users } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { addToCart, isInCart } from '../services/storageService';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setAddedToCart(isInCart(course.id));
    
    const handleCartUpdate = () => {
        setAddedToCart(isInCart(course.id));
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [course.id]);

  // Badge Logic
  let badgeColorClass = "bg-secondary/90";
  if (course.level && course.level.toLowerCase().includes('new')) {
      badgeColorClass = "bg-[#FF0055]"; // Pink/Red for "New"
  } else if (course.level && course.level.toLowerCase().includes('popular')) {
      badgeColorClass = "bg-[#4CAF50]"; // Green for "Popular"
  }

  return (
    <article className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group relative hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/courses/${course.id}`} className="block relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 shadow-2xs">
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse flex items-center justify-center z-10">
             <svg className="w-10 h-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
        )}

        <img 
          src={course.image} 
          alt={`${course.title} training course`} 
          width="800"
          height="450"
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Price Tag Floating Overlay */}
        {course.price > 0 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-secondary/90 dark:bg-gray-900/90 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-white/20 shadow-md">
            ${course.price}
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" aria-hidden="true">
            <span className="bg-white/95 backdrop-blur text-secondary font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-lg">
              Explore Course <ArrowRight size={12} />
            </span>
        </div>

        {/* Level / Status Badge */}
        {course.level && course.level.toLowerCase() !== 'available' && (
          <div className={`absolute top-2.5 left-2.5 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-white/10 uppercase tracking-wide z-10 ${badgeColorClass}`}>
            {course.level}
          </div>
        )}
      </Link>
      
      {/* Content Body */}
      <div className="pt-4 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Course Code */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#232323] bg-[#FFC107] px-2.5 py-0.5 rounded-md border border-amber-400/50 shadow-2xs truncate max-w-[200px]">
              {course.category}
            </span>
            {course.code && (
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 shrink-0 whitespace-nowrap">
                {course.code}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[46px]">
            <Link to={`/courses/${course.id}`} className="focus:outline-none hover:underline decoration-amber-400/60 underline-offset-4">
              {course.title}
            </Link>
          </h3>

          {/* Short Description */}
          {course.shortDescription && (
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 line-clamp-2 leading-relaxed font-normal">
              {course.shortDescription}
            </p>
          )}

          {/* Key Specs / Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {course.validityMonths && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
                <Shield size={10} className="text-blue-500" /> {course.validityMonths}m Validity
              </span>
            )}
            {course.deliveryMode && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                <Users size={10} className="text-gray-400" /> {course.deliveryMode}
              </span>
            )}
          </div>
        </div>

        {/* Footer & Action Buttons */}
        <div className="space-y-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-1.5" aria-label={`Duration: ${course.duration}`}>
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{course.duration || 'Flexible'}</span>
            </div>

            {course.upcomingDates && course.upcomingDates.length > 0 ? (
              <div 
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs"
                title={`Next scheduled dates: ${course.upcomingDates.slice(0, 2).join(', ')}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{course.upcomingDates.length} {course.upcomingDates.length === 1 ? 'Intake' : 'Intakes'}</span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400 font-normal">On-demand</span>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-2.5 pt-1">
            <Link to={`/courses/${course.id}`} className="flex-1" tabIndex={-1}>
              <button 
                type="button"
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700 transition-all shadow-xs text-center cursor-pointer"
              >
                View Details
              </button>
            </Link>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('openInquireModal', { 
                  detail: { courseId: course.id, courseTitle: course.title } 
                }));
              }}
              size="sm"
              className="flex-1 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 text-xs font-bold rounded-xl py-2.5 bg-[#FFC107] text-[#041024] hover:bg-[#e5ac06] uppercase tracking-wider cursor-pointer font-sans"
            >
              INQUIRE NOW
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
