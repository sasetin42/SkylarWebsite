
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Clock, DollarSign, Heart, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { isCourseSaved, toggleSavedCourse, addToCart, isInCart } from '../services/storageService';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsSaved(isCourseSaved(course.id));
    setAddedToCart(isInCart(course.id));
    
    const handleCartUpdate = () => {
        setAddedToCart(isInCart(course.id));
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [course.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSavedCourse(course.id);
    setIsSaved(newState);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course.id);
    setAddedToCart(true); // Immediate visual feedback
  };

  // Badge Logic
  let badgeColorClass = "bg-secondary/90";
  if (course.level.toLowerCase().includes('new')) {
      badgeColorClass = "bg-[#FF0055]"; // Pink/Red for "New"
  } else if (course.level.toLowerCase().includes('popular')) {
      badgeColorClass = "bg-[#4CAF50]"; // Green for "Popular"
  }

  return (
    <article className="bg-white p-3 rounded-[8px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group relative hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/courses/${course.id}`} className="block relative aspect-[16/9] overflow-hidden rounded-[8px] bg-gray-100">
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
             <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" aria-hidden="true">
            <span className="bg-white/95 backdrop-blur text-secondary font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-lg">
              View Details <ArrowRight size={12} />
            </span>
        </div>

        {/* Level Badge */}
        <div className={`absolute top-3 left-3 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-[4px] shadow-sm border border-white/10 uppercase tracking-wide z-10 ${badgeColorClass}`}>
          {course.level}
        </div>

        {/* Save Button */}
        <button 
            onClick={handleToggleSave}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 z-20 focus:outline-none ${
            isSaved ? 'bg-red-500 text-white transform scale-110' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'
            }`}
            aria-label={isSaved ? "Remove from saved courses" : "Save course"}
        >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </Link>
      
      <div className="px-2 pt-4 pb-2 flex-1 flex flex-col">
        <div className="mb-2">
           <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-[4px] inline-block mb-2">
              {course.category}
           </span>
           <h3 className="text-lg font-heading font-bold text-secondary leading-tight group-hover:text-primary transition-colors">
            <Link to={`/courses/${course.id}`} className="focus:outline-none">
                {course.title}
            </Link>
           </h3>
        </div>

        <div className="space-y-3 mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center text-sm">
             <div className="flex items-center text-gray-600 font-medium" aria-label={`Duration: ${course.duration}`}>
                <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <span>{course.duration}</span>
             </div>
             <div className="font-bold text-primary flex items-center text-base" aria-label={`Price: ${course.price} dollars`}>
                <DollarSign className="w-3.5 h-3.5" />
                <span>{course.price}</span>
             </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 pt-2">
             <Link to={`/courses/${course.id}`} className="flex-1" tabIndex={-1}>
                <Button variant="outline" size="sm" className="w-full text-xs font-bold border-gray-200 text-gray-600 hover:border-primary hover:text-primary rounded-[6px] py-2.5">
                  View
                </Button>
             </Link>
             <Button 
                onClick={handleAddToCart}
                disabled={addedToCart}
                size="sm"
                className={`flex-1 transition-all shadow-none flex items-center justify-center gap-1.5 text-xs font-bold rounded-[6px] py-2.5 ${
                    addedToCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-transparent cursor-default ring-2 ring-green-600 ring-offset-1' 
                    : 'bg-secondary text-white hover:bg-primary'
                }`}
             >
                {addedToCart ? (
                    <>
                        <Check size={14} /> Added
                    </>
                ) : (
                    <>
                        <ShoppingCart size={14} /> Add
                    </>
                )}
             </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
