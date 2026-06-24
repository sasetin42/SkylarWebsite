import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, DollarSign, CheckCircle, FileText, Star, User, ArrowLeft, Shield, ShoppingCart, Check, Loader, Users, BookOpen, Award, Briefcase, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { getCourseById, addToRecentCourses, addReview, getCourseReviews, addToCart, isInCart } from '../services/storageService';
import { Review, Course } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

const formatDescription = (desc: string) => {
  if (!desc) return '';
  if (desc.trim().startsWith('<')) return desc;
  return desc
    .split('\n\n')
    .map(p => `<p class="mb-4">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
};

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | undefined>(() => id ? getCourseById(id) : undefined);
  
  // Review State
  const [reviews, setReviews] = useState<Review[]>(() => id ? getCourseReviews(id) : []);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [addedToCart, setAddedToCart] = useState(() => id ? isInCart(id) : false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
                {course.code && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                    Code: {course.code}
                  </span>
                )}
                {course.isGwo && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/30 text-white text-xs font-bold uppercase tracking-wider border border-primary/40 backdrop-blur-sm">
                    GWO Certified
                  </span>
                )}
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {course.title}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg border-l-4 border-accent/50 pl-5 mb-12">
                {course.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                {/* Duration Card */}
                <div className="flex items-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg flex-1 min-w-[160px]">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 mr-4 shrink-0 shadow-inner">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Duration</span>
                        <span className="font-bold text-lg text-white font-heading">{course.duration}</span>
                    </div>
                </div>

                {/* Level Card */}
                <div className="flex items-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg flex-1 min-w-[160px]">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 mr-4 shrink-0 shadow-inner">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Level</span>
                        <span className="font-bold text-lg text-white font-heading">{course.level}</span>
                    </div>
                </div>

                {/* Validity Card */}
                {course.validityMonths && (
                  <div className="flex items-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg flex-1 min-w-[160px]">
                      <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 mr-4 shrink-0 shadow-inner">
                          <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Validity</span>
                          <span className="font-bold text-lg text-white font-heading">{course.validityMonths} Months</span>
                      </div>
                  </div>
                )}

                {/* RTO Code Card */}
                {course.rtoCode && (
                  <div className="flex items-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg flex-1 min-w-[160px]">
                      <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 mr-4 shrink-0 shadow-inner">
                          <Award className="w-5 h-5" />
                      </div>
                      <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">RTO Code</span>
                          <span className="font-bold text-lg text-white font-heading">{course.rtoCode}</span>
                      </div>
                  </div>
                )}

                {/* Delivery Mode Card */}
                <div className="flex items-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg flex-1 min-w-[160px]">
                    <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400 mr-4 shrink-0 shadow-inner">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 tracking-wider uppercase font-bold">Delivery</span>
                        <span className="font-bold text-lg text-white font-heading">{course.deliveryMode || 'Face-to-Face'}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="container mx-auto px-4 md:px-8 relative z-20" style={{ marginTop: '0px', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <div className="grid lg:grid-cols-3" style={{ gap: '2.5rem' }}>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 pb-10">
            
            {/* 1. Overview Section Card */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <section>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-6 flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText size={24} className="md:w-7 md:h-7" /></div>
                      Course Overview
                  </h2>
                  <div 
                    className="prose max-w-none text-gray-600 leading-relaxed space-y-4 html-description overview-section-content"
                    dangerouslySetInnerHTML={{ __html: formatDescription(course.fullDescription) }}
                  />
                </section>
            </div>

            {/* 2. Certification Award Banner Card */}
            {course.certificationName && (
              <div className="bg-gradient-to-br from-[#041024]/5 to-[#041024]/10 p-6 md:p-8 rounded-3xl border border-[#041024]/10 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-secondary text-white rounded-2xl shadow-lg shrink-0">
                  <Shield size={28} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Certification Awarded</h3>
                  <p className="text-secondary font-bold text-xl mt-1">{course.certificationName}</p>
                  {course.validityMonths && (
                    <p className="text-xs text-gray-500 mt-1">This certification is industry-compliant and valid for {course.validityMonths} months.</p>
                  )}
                </div>
              </div>
            )}
 
            {/* 3. What You Will Learn Card */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <section>
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-6 flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle size={24} className="md:w-7 md:h-7" /></div>
                      What You Will Learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                      {(course.whatYouWillLearn || [
                        "Industry best practices and safety standards",
                        "Practical skills application in simulated environments",
                        "Emergency response and hazard identification",
                        "Use of specialized equipment and PPE"
                      ]).map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-surface rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                          <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6 mt-0.5 shrink-0" />
                          <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                      </div>
                      ))}
                  </div>
                </section>
            </div>
 
            {/* 4. Collapsible Course Information Accordion (Separated Premium Cards) */}
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-secondary mb-6">Course Specifications & Details</h2>
              <div className="space-y-4">
                {[
                  { id: 'courseBenefits', title: 'Course Benefits', content: course?.courseBenefits },
                  { id: 'isThisCourseForMe', title: 'Is this course for me?', content: course?.isThisCourseForMe },
                  { id: 'careerOpportunities', title: 'Career Opportunities', content: course?.careerOpportunities },
                  { id: 'durationOfTraining', title: 'What is the duration of training?', content: course?.durationOfTraining },
                  { id: 'whereDelivered', title: 'Where is the training delivered?', content: course?.whereDelivered },
                  { id: 'accreditedUnitsRich', title: 'Accredited Units', content: course?.accreditedUnitsRich },
                  { id: 'entryRequirementsRich', title: 'What are the entry requirements?', content: course?.entryRequirementsRich },
                  { id: 'lln', title: 'Language, Literacy & Numeracy (LLN)', content: course?.lln },
                  { id: 'assessment', title: 'Assessment', content: course?.assessment },
                  { id: 'certificationRecord', title: 'Certification/Training Record', content: course?.certificationRecord },
                  { id: 'validityPeriod', title: 'Validity Period', content: course?.validityPeriod },
                  { id: 'whatToBringRich', title: 'What to bring?', content: course?.whatToBringRich },
                  { id: 'costOfTraining', title: 'What is the cost of training?', content: course?.costOfTraining },
                  { id: 'paymentOptions', title: 'What are the payment options?', content: course?.paymentOptions },
                ].map((section) => {
                  if (!section.content) return null;
                  const isOpen = expandedSection === section.id;
                  return (
                    <div 
                      key={section.id} 
                      className={`rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-xl ring-1 ring-black/5 bg-[#041024]' : 'bg-[#041024] hover:shadow-lg'}`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isOpen ? null : section.id)}
                        className="w-full flex items-center gap-4 px-6 py-5 text-left font-bold text-white hover:bg-[#081a36] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#041024] font-bold text-sm shrink-0 transition-transform duration-300">
                          {isOpen ? '−' : '+'}
                        </span>
                        <span className="text-sm md:text-base font-semibold select-none flex-1">{section.title}</span>
                      </button>
                      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[800px] bg-white text-gray-800 p-6 border-t border-gray-100 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.15)]' : 'max-h-0'}`}>
                        <div 
                          className="prose max-w-none text-gray-700 text-sm leading-relaxed html-description"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
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
                        id="review-name"
                        name="reviewName"
                        autocomplete="name"
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
                        id="review-comment"
                        name="reviewComment"
                        autocomplete="off"
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
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4" style={{ marginBottom: '24px' }}>
                 <Calendar className="text-primary w-6 h-6"/>
                 <h3 className="text-xl font-bold text-secondary">Upcoming Intakes</h3>
              </div>
              
              <div className="flex flex-wrap gap-2.5" style={{ marginBottom: '24px' }}>
                {course.upcomingDates.map((date, idx) => (
                  <div key={idx} className="flex-1 min-w-[120px] flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-accent hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                    <span className="font-bold text-xs text-gray-700 group-hover:text-primary whitespace-nowrap">{date}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 ml-1.5"></div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button 
                  onClick={handleEnrollNow}
                  className="flex-1 text-sm py-3.5 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all bg-secondary text-white hover:bg-primary border-none uppercase tracking-wider whitespace-nowrap"
                >
                  REGISTER NOW!
                </Button>
              </div>

              {course.depositAmount && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500 font-medium leading-relaxed" style={{ marginTop: '20px', padding: '12px' }}>
                  Register now to secure your spot! Your invoice will be prepared and issued upon successful enrolment.
                </div>
              )}

              <div className="border-t border-gray-100 text-center" style={{ marginTop: '28px', paddingTop: '28px' }}>
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
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
             <Button onClick={handleEnrollNow} className="bg-secondary text-white hover:bg-primary font-bold px-6 py-3 md:px-8 shadow-lg text-sm md:text-base uppercase tracking-wider">
                REGISTER NOW!
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
