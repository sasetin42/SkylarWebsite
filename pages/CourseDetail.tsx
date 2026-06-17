
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, DollarSign, CheckCircle, FileText, Star, User, ArrowLeft, Shield, ShoppingCart, Check, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { getCourseById, addToRecentCourses, addReview, getCourseReviews, addToCart, isInCart } from '../services/storageService';
import { Review, Course } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  
  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCourse = getCourseById(id);
      setCourse(foundCourse);
      if (foundCourse) {
        addToRecentCourses(foundCourse.id);
        setReviews(getCourseReviews(foundCourse.id));
        setAddedToCart(isInCart(foundCourse.id));
      }
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !userName.trim() || !newComment.trim()) return;

    setIsSubmittingReview(true);
    
    // Simulate network delay
    setTimeout(() => {
        const review: Review = {
          id: Date.now().toString(),
          courseId: course.id,
          user: userName,
          rating: newRating,
          comment: newComment,
          date: new Date().toLocaleDateString()
        };

        addReview(review);
        setReviews(prev => [...prev, review]);
        setUserName('');
        setNewComment('');
        setNewRating(5);
        setShowReviewForm(false);
        setIsSubmittingReview(false);
    }, 1000);
  };

  const handleAddToCart = () => {
    if (course) {
        addToCart(course.id);
        setAddedToCart(true);
    }
  };

  const handleEnrollNow = () => {
    if (course) {
      if (!addedToCart) {
        addToCart(course.id);
      }
      navigate('/checkout');
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-heading font-bold mb-4 text-secondary">Course not found</h2>
          <Link to="/courses"><Button>Back to Courses</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 relative pb-32 md:pb-24">
      <Breadcrumbs />
      
      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
         <div className="absolute inset-0 z-0">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
         </div>

        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="animate-fade-in-up">
              <Link to="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 md:mb-8 text-sm font-bold uppercase tracking-wider transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Courses
              </Link>

              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  {course.category}
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {course.title}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg border-l-4 border-accent/50 pl-5 mb-8">
                {course.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-sm md:text-base">
                <div className="flex items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg flex-1 sm:flex-none">
                    <Clock className="w-6 h-6 mr-3 text-accent" />
                    <div>
                        <span className="block text-xs text-gray-300 uppercase tracking-wide">Duration</span>
                        <span className="font-bold text-lg">{course.duration}</span>
                    </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg flex-1 sm:flex-none">
                    <DollarSign className="w-6 h-6 mr-3 text-accent" />
                    <div>
                        <span className="block text-xs text-gray-300 uppercase tracking-wide">Course Fee</span>
                        <span className="font-bold text-lg">${course.price}</span>
                    </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg flex-1 sm:flex-none">
                    <Shield className="w-6 h-6 mr-3 text-accent" />
                    <div>
                        <span className="block text-xs text-gray-300 uppercase tracking-wide">Level</span>
                        <span className="font-bold text-lg">{course.level}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 -mt-8 md:-mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 pb-10">
            
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                <section className="mb-12">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText size={24} className="md:w-7 md:h-7" /></div>
                    Course Overview
                </h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {course.fullDescription}
                </p>
                </section>

                <section className="mb-12">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle size={24} className="md:w-7 md:h-7" /></div>
                    What You Will Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                    "Industry best practices and safety standards",
                    "Practical skills application in simulated environments",
                    "Emergency response and hazard identification",
                    "Use of specialized equipment and PPE"
                    ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-surface rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                        <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6 mt-0.5 shrink-0" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                    </div>
                    ))}
                </div>
                </section>

                <section>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-6">Entry Requirements</h2>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <ul className="list-disc pl-5 space-y-3 text-gray-600 marker:text-accent text-sm md:text-base">
                        <li>Completion of Year 10 or equivalent (or relevant industry experience).</li>
                        <li>Minimum age of 16 years (18 for High Risk Work licenses).</li>
                        <li>Basic Language, Literacy and Numeracy (LLN) assessment.</li>
                        <li>Unique Student Identifier (USI).</li>
                    </ul>
                </div>
                </section>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-secondary">Student Reviews</h2>
                    <p className="text-gray-500 mt-1">See what our graduates have to say.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-8 animate-fade-in-down border border-gray-200 shadow-inner">
                  <h3 className="font-bold mb-6 text-lg">Submit your feedback</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button 
                            type="button" 
                            key={star}
                            onClick={() => setNewRating(star)}
                            className={`p-2 transition-all rounded-lg hover:bg-gray-200 ${star <= newRating ? 'text-accent scale-110' : 'text-gray-300'}`}
                          >
                            <Star className="fill-current w-8 h-8" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isSubmittingReview} className="w-full md:w-auto">
                        {isSubmittingReview ? <span className="flex items-center gap-2"><Loader className="animate-spin" size={16}/> Submitting...</span> : 'Submit Review'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-full shadow-md text-white">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-base block text-secondary">{review.user}</span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex text-accent bg-accent/10 px-2 py-1 rounded-lg">
                          {Array.from({length: review.rating}).map((_, i) => (
                            <Star key={i} size={14} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-4 ml-14 leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 sticky top-24 shadow-2xl z-20">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                 <Calendar className="text-primary w-6 h-6"/>
                 <h3 className="text-xl font-bold text-secondary">Upcoming Intakes</h3>
              </div>
              
              <div className="space-y-3 mb-8">
                {course.upcomingDates.map((date, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-accent hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                    <span className="font-bold text-gray-700 group-hover:text-primary">{date}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleEnrollNow}
                  className="w-full text-lg py-4 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-secondary text-white hover:bg-primary border-none uppercase tracking-wide"
                >
                  Enroll Now
                </Button>
                <Button 
                    variant="outline" 
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full font-bold border-2 py-4 ${addedToCart ? 'bg-green-50 border-green-500 text-green-700 cursor-default' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                >
                  {addedToCart ? <span className="flex items-center gap-2"><Check size={18} /> Added to Cart</span> : <span className="flex items-center gap-2"><ShoppingCart size={18} /> Add to Cart</span>}
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wide">Have questions?</p>
                <a href="tel:1300333883" className="text-primary font-bold hover:text-accent text-2xl transition-colors font-heading">1300 333 883</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Enrollment Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)] py-3 md:py-4 z-40 transform transition-transform duration-500 ${showStickyNav ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4">
            <img src={course.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm" />
            <div>
              <h3 className="font-bold text-secondary text-lg truncate max-w-xs lg:max-w-md leading-tight">{course.title}</h3>
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Seats filling fast</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <div className="flex flex-col md:flex-row md:items-center">
                <span className="text-xs text-gray-500 md:hidden uppercase font-bold tracking-wide">Course Fee</span>
                <div className="text-xl md:text-2xl font-bold text-primary mr-0 md:mr-4 font-heading">
                    ${course.price}
                </div>
             </div>
             <Button onClick={handleEnrollNow} className="bg-secondary text-white hover:bg-primary font-bold px-6 py-3 md:px-8 shadow-lg text-sm md:text-base">
                Enroll Now
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
