import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { getTestimonials, getGoogleReviewSettings } from '../services/storageService';
import { GOOGLE_REVIEWS_STATS } from '../constants';
import { Testimonial, GoogleReviewSettings } from '../types';

interface GoogleReviewsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showWriteReviewCta?: boolean;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  title = "About Us",
  subtitle = "WHAT DELEGATES & CLIENTS SAY",
  className = "",
  showWriteReviewCta = true
}) => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<GoogleReviewSettings>(getGoogleReviewSettings());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const loadData = () => {
    const all = getTestimonials();
    const approved = all.filter(t => (t.status || 'Approved') === 'Approved');
    setReviews(approved);
    setSettings(getGoogleReviewSettings());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('testimonialsUpdated', loadData);
    return () => window.removeEventListener('testimonialsUpdated', loadData);
  }, []);

  // Responsive visible cards count
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReviews = reviews.length;
  const maxIndex = Math.max(0, totalReviews - visibleCount);

  // Auto rotate carousel
  useEffect(() => {
    if (isPaused || totalReviews <= visibleCount) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, totalReviews, visibleCount]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const displayRating = settings.averageRating || GOOGLE_REVIEWS_STATS.rating;
  const displayTotalCount = settings.totalReviewsCount || GOOGLE_REVIEWS_STATS.totalReviews;
  const googleUrl = settings.placeUrl || GOOGLE_REVIEWS_STATS.googleMapsUrl;

  const currentShowingStart = totalReviews > 0 ? currentIndex + 1 : 0;
  const currentShowingEnd = Math.min(currentIndex + visibleCount, totalReviews);

  return (
    <section 
      className={`py-24 bg-secondary text-white relative overflow-hidden ${className}`}
      aria-label="Google Reviews and Client Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2 block">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 text-white">
            {title}
          </h2>

          {/* Google Verified Review Aggregate Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs text-gray-200 shadow-lg mt-1 backdrop-blur-md">
            <span className="font-extrabold text-white text-sm">
              {displayRating.toFixed(1)} / 5.0
            </span>
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="text-amber-400" />
              ))}
            </div>
            <span className="text-gray-300 font-medium">
              Verified Google Reviews ({displayTotalCount}+ Reviews)
            </span>
          </div>
        </div>

        {/* Slider Controls & Showing Tracker */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">SHOWING</span>
            <span className="text-xs font-bold text-accent px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
              {currentShowingStart} - {currentShowingEnd} of {totalReviews} Reviews
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-secondary text-white transition-all duration-300 flex items-center justify-center border border-white/15 shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Reviews"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-secondary text-white transition-all duration-300 flex items-center justify-center border border-white/15 shadow-lg transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Reviews"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sliding Viewport */}
        <div 
          className="overflow-hidden w-full relative py-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
            }}
          >
            {reviews.map((rev, idx) => {
              const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=1C3D72&color=FFC107&bold=true`;
              const avatarSrc = imageErrors[rev.id] ? fallbackAvatar : (rev.avatar || fallbackAvatar);

              return (
                <div 
                  key={rev.id || idx}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 bg-[#162238]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 hover:border-accent/40 hover:bg-[#1A2B48] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl group min-h-[340px]"
                >
                  <div>
                    {/* Top Row: Stars + Google Verified Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, star) => (
                          <Star key={star} size={15} fill="currentColor" className="text-amber-400" />
                        ))}
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 flex items-center gap-1.5 shadow-xs">
                        <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        <span>Google Verified</span>
                      </span>
                    </div>

                    {/* Review Feedback Text */}
                    <p className="text-[13.5px] md:text-[14.5px] text-gray-200 italic mb-6 leading-relaxed line-clamp-6">
                      “{rev.content}”
                    </p>
                  </div>

                  {/* Reviewer Profile Footer */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-white/10 mt-auto">
                    <img
                      src={avatarSrc}
                      alt={rev.name}
                      onError={() => setImageErrors(prev => ({ ...prev, [rev.id]: true }))}
                      className="w-11 h-11 rounded-full object-cover border-2 border-accent/80 shrink-0 shadow-md"
                      loading="lazy"
                    />
                    <div className="text-left overflow-hidden min-w-0 flex-1">
                      <h4 className="font-bold text-white text-[14px] leading-tight mb-0.5 truncate">
                        {rev.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-accent text-[11.5px] font-medium leading-snug truncate">
                          {rev.role || 'Verified Delegate'}
                        </span>
                        {rev.date && (
                          <>
                            <span className="text-gray-500 text-[10px]">•</span>
                            <span className="text-gray-400 text-[11px] truncate">
                              {rev.date}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[10.5px] text-gray-400 truncate mt-0.5">
                        {rev.locationName || 'Skylar Education'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-accent' : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Action Call to Action Footer */}
        {showWriteReviewCta && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Real Reviews from Certified GWO Delegates
                </h4>
                <p className="text-xs text-gray-400">
                  Synced in real-time from official Skylar Education Google Reviews.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer shadow-md"
              >
                <span>View all {displayTotalCount}+ Google Reviews</span>
                <ExternalLink size={14} className="text-accent" />
              </a>

              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-yellow-400 text-secondary text-xs font-extrabold transition-all shadow-lg hover:shadow-accent/25 cursor-pointer"
              >
                <span>Write a Review</span>
                <Star size={14} fill="currentColor" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
