import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Wifi, Car, Coffee, 
  Layout, Calendar, Users, CheckCircle2, ShieldAlert, Sparkles, Send, HelpCircle, Check, ChevronDown, BookOpen
} from 'lucide-react';
import { LOCATIONS } from '../constants';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCourses, getSessions, addToCart, saveTicket } from '../services/storageService';
import { Course, Session } from '../types';

export const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = LOCATIONS.find(l => l.id === id);

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubject, setInquirySubject] = useState('Individual Booking');
  const [showInquirySuccess, setShowInquirySuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookingSuccessCourse, setBookingSuccessCourse] = useState<string | null>(null);

  useEffect(() => {
    const allCourses = getCourses();
    setCourses(allCourses);

    // Get sessions for this location
    let localSessions = getSessions().filter(s => s.locationId === id);

    // If no sessions exist in storage for this location, generate realistic mock sessions
    if (localSessions.length === 0 && allCourses.length > 0) {
      localSessions = [
        {
          id: 'mock-s1',
          courseId: allCourses[0].id,
          locationId: id || '',
          trainerId: 't1',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
          endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          capacity: 12,
          enrolledStudentIds: ['s1', 's2', 's3'],
          status: 'Scheduled'
        },
        {
          id: 'mock-s2',
          courseId: allCourses[1] ? allCourses[1].id : allCourses[0].id,
          locationId: id || '',
          trainerId: 't2',
          startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days from now
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          capacity: 10,
          enrolledStudentIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
          status: 'Scheduled'
        },
        {
          id: 'mock-s3',
          courseId: allCourses[2] ? allCourses[2].id : allCourses[0].id,
          locationId: id || '',
          trainerId: 't1',
          startDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 19 days from now
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          capacity: 15,
          enrolledStudentIds: [],
          status: 'Scheduled'
        }
      ];
    }
    setSessions(localSessions);
  }, [id]);

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location not found</h2>
          <Link to="/locations">
            <Button>Back to Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Facilities config
  const facilities = [
    { icon: Layout, label: "Modern Classrooms", desc: "Equipped with state-of-the-art interactive teaching systems" },
    { icon: Wifi, label: "High-Speed WiFi", desc: "Complimentary high-speed internet access across the campus" },
    { icon: Coffee, label: "Student Lounge", desc: "Relaxation hub with snacks, drinks, and charging stations" },
    { icon: Car, label: "On-site Parking", desc: "Safe, secure parking spaces for all students and delegates" },
  ];

  // FAQs config
  const faqs = [
    {
      q: "Is there public transport to the Pampanga campus?",
      a: "Yes, the Angeles City facility is easily accessible via local transport lines (jeepneys and tricycles) from major hubs like the Clark Freeport Zone and Dau Terminal."
    },
    {
      q: "What should I wear or bring to my training?",
      a: "For practical courses (like GWO heights or rescue), please wear comfortable work clothes and steel-toed boots. All specialised personal protective equipment (harnesses, helmets) will be provided on-site."
    },
    {
      q: "Do you offer corporate or group bookings at this location?",
      a: "Absolutely! We can arrange custom dates and corporate rates for groups. Use our quick inquiry form below or email us directly to discuss your requirements."
    },
    {
      q: "Are refreshments provided during training?",
      a: "We provide complimentary coffee, tea, and filtered water in the student lounge. There are also several local lunch options and cafes within short walking distance."
    }
  ];

  // Handle inquiry submit
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMessage) return;
    
    // Save locally to Support Tickets in LocalStorage
    const guestId = `guest|${inquiryName}|${inquiryEmail}`;
    const newTicket = {
      id: `tkt-${Date.now()}`,
      studentId: guestId,
      subject: `Campus Inquiry (${location.name}): ${inquirySubject}`,
      message: inquiryMessage,
      status: 'Open' as const,
      priority: 'Medium' as const,
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    saveTicket(newTicket);
    
    setShowInquirySuccess(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setShowInquirySuccess(false);
    }, 4000);
  };

  // Handle booking action
  const handleBookSession = (courseId: string, courseTitle: string) => {
    addToCart(courseId);
    setBookingSuccessCourse(courseTitle);
    setTimeout(() => {
      setBookingSuccessCourse(null);
    }, 5000);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24 animate-fade-in relative">
      <Breadcrumbs />
      
      {/* ─── Success Notification Toasts ──────────────────────────────── */}
      {bookingSuccessCourse && (
        <div className="fixed bottom-24 right-6 z-50 bg-secondary text-white p-5 rounded-2xl shadow-2xl border border-accent/20 flex flex-col gap-2 max-w-sm animate-slide-in-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
              <Check size={16} />
            </div>
            <div>
              <p className="font-bold text-sm">Course Added to Cart!</p>
              <p className="text-xs text-gray-300 line-clamp-1">{bookingSuccessCourse}</p>
            </div>
          </div>
          <div className="flex gap-2.5 mt-2 pt-2 border-t border-white/10">
            <Link to="/checkout" className="flex-1">
              <button className="w-full py-2 bg-accent text-secondary font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors">
                Checkout Now
              </button>
            </Link>
            <button 
              onClick={() => setBookingSuccessCourse(null)} 
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg uppercase transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        <div className="absolute inset-0 z-0">
          <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>
        <div className="relative z-10 pt-[120px] pb-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              <Link to="/locations" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 transition-colors w-fit text-sm font-bold uppercase tracking-widest">
                <ArrowLeft size={16} /> Back to All Locations
              </Link>
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-extrabold uppercase tracking-wider border border-accent/30 backdrop-blur-sm shadow-sm">
                  <MapPin size={12} /> Philippines Campus
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-extrabold uppercase tracking-wider border border-white/20 backdrop-blur-sm shadow-sm">
                  <Sparkles size={12} className="text-accent" /> Premium GWO Facility
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(28px, 5vw, 46px)', lineHeight: '1.2' }}>
                {location.name}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-6 rounded-full shadow-sm" />
              <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 text-gray-200 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2"><MapPin className="text-accent flex-shrink-0" size={16}/> {location.address}</div>
                <div className="flex items-center gap-2"><Phone className="text-accent flex-shrink-0" size={16}/> {location.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* ─── Left Columns: Campus Details & Upcoming Sessions ─── */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About the Campus */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
              <h2 className="text-2xl font-bold text-secondary mb-4 font-heading flex items-center gap-2">
                <BookOpen className="text-accent" size={24} /> About the Campus
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6 font-medium">
                Welcome to our {location.name} facility. Designed to provide a realistic and immersive training environment, this campus features state-of-the-art equipment and learning spaces. Whether you are undertaking GWO modules or High Risk Work licensing, our facility ensures you are job-ready.
              </p>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg font-medium">
                Our trainers at this location bring decades of local industry experience, ensuring that the skills you learn are directly applicable to sites across Angeles City, Pampanga, and beyond.
              </p>
            </section>

            {/* Campus Facilities */}
            <section>
              <h2 className="text-2xl font-bold text-secondary mb-6 font-heading">Campus Facilities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {facilities.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 transition-all hover:shadow-lg hover:border-slate-200 group">
                    <div className="p-3 bg-slate-50 text-primary rounded-xl shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors"><f.icon size={22}/></div>
                    <div>
                      <span className="block font-bold text-gray-800 text-base mb-1">{f.label}</span>
                      <span className="text-xs text-gray-500 font-medium leading-relaxed">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Sessions at this Location */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-secondary font-heading">Upcoming Sessions</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Direct Booking & Scheduled Calendars</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={12} /> Weekly Intakes
                </div>
              </div>

              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const course = courses.find(c => c.id === session.courseId);
                    if (!course) return null;

                    const seatsLeft = session.capacity - session.enrolledStudentIds.length;
                    const isAlmostFull = seatsLeft <= 3 && seatsLeft > 0;
                    const isFull = seatsLeft === 0;

                    const formattedStartDate = new Date(session.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    const formattedEndDate = new Date(session.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <div key={session.id} className="p-5 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-primary/10">
                            {course.category}
                          </span>
                          <Link to={`/courses/${course.id}`}>
                            <h4 className="font-extrabold text-secondary text-base md:text-lg leading-tight hover:text-primary transition-colors hover:underline decoration-accent decoration-2 underline-offset-4">
                              {course.title}
                            </h4>
                          </Link>
                          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> {formattedStartDate} - {formattedEndDate}</span>
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> {course.duration}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between sm:justify-start md:justify-center gap-3.5 pt-3 md:pt-0 border-t border-dashed border-slate-200/60 md:border-t-0 flex-shrink-0">
                          <div className="text-left md:text-right">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course Fee</span>
                            <span className="font-heading font-extrabold text-lg text-secondary">${course.price} USD</span>
                            
                            {/* Capacity badge */}
                            <span className={`block text-[11px] font-bold mt-1 uppercase ${
                              isFull ? 'text-rose-500' : isAlmostFull ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                              {isFull ? 'Session Full' : isAlmostFull ? `Only ${seatsLeft} seats left` : `${seatsLeft} spots available`}
                            </span>
                          </div>

                          <button
                            onClick={() => handleBookSession(course.id, course.title)}
                            disabled={isFull}
                            className={`w-full sm:w-auto md:w-full py-2.5 px-5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md ${
                              isFull 
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none' 
                                : 'bg-primary hover:bg-accent text-white hover:text-secondary hover:shadow-lg'
                            }`}
                          >
                            {isFull ? 'Sold Out' : 'Book Spot'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <ShieldAlert className="text-amber-500 mx-auto mb-2" size={32} />
                  <p className="text-gray-600 font-bold">No active sessions listed online right now.</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Please inquire below to request custom dates or group session scheduling.</p>
                </div>
              )}
            </section>

            {/* Quick Inquiry / Quote Form */}
            <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-white/10 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-10 left-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

              <div className="max-w-xl">
                <h2 className="text-2xl font-bold font-heading mb-2 text-white flex items-center gap-2">
                  <Mail className="text-accent" size={24} /> Campus Inquiry Form
                </h2>
                <p className="text-sm text-gray-400 font-medium mb-6">
                  Need a custom training schedule, corporate group booking, or detailed syllabus package? Send us a quick inquiry.
                </p>
                
                {showInquirySuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex items-center gap-3 animate-scale-in">
                    <CheckCircle2 size={24} className="flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Juan Dela Cruz, Thank You for Your Query!</p>
                      <p className="text-xs text-gray-300 mt-0.5">Our Pampanga campus representative will contact you within 24 hours.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          className="w-full bg-white/10 border border-white/10 text-white rounded-xl py-3 px-4 text-sm focus:border-accent focus:bg-white/15 outline-none transition-all placeholder:text-gray-500" 
                          placeholder="Juan Dela Cruz"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Your Email</label>
                        <input 
                          type="email" 
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          className="w-full bg-white/10 border border-white/10 text-white rounded-xl py-3 px-4 text-sm focus:border-accent focus:bg-white/15 outline-none transition-all placeholder:text-gray-500" 
                          placeholder="juan@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Inquiry Reason</label>
                        <select 
                          value={inquirySubject}
                          onChange={(e) => setInquirySubject(e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 text-white rounded-xl py-3 px-4 text-sm focus:border-accent outline-none transition-all"
                        >
                          <option value="Individual Booking">Individual Booking</option>
                          <option value="Corporate / Group Rates">Corporate Group Rates</option>
                          <option value="Custom Date Request">Custom Date Request</option>
                          <option value="General Question">General Question</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-0.5">
                        <span className="text-[11px] font-semibold text-gray-400 leading-tight">
                          We respond via email within 1 business day.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Your Message</label>
                      <textarea 
                        rows={3} 
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 text-white rounded-xl py-3 px-4 text-sm focus:border-accent focus:bg-white/15 outline-none transition-all resize-none placeholder:text-gray-500" 
                        placeholder="Tell us about your team size, expected dates, or questions..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full sm:w-auto py-3 px-6 bg-accent hover:bg-amber-400 text-secondary hover:text-secondary font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <span>Send Message</span>
                      <Send size={12} />
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Campus FAQ Accordion */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-secondary mb-6 font-heading flex items-center gap-2">
                <HelpCircle className="text-accent" size={24} /> Frequently Asked Questions
              </h2>
              <div className="space-y-3.5">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden transition-colors hover:border-slate-200">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full py-4.5 px-5 text-left font-bold text-secondary text-base flex justify-between items-center bg-slate-50/40 hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-gray-400 transition-transform duration-300 ${
                          activeFaq === idx ? 'transform rotate-180 text-primary' : ''
                        }`} 
                      />
                    </button>
                    {activeFaq === idx && (
                      <div className="p-5 text-sm md:text-base text-gray-500 leading-relaxed font-medium bg-white border-t border-slate-50/80 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ─── Right Column: Sidebar ──────────────────────────────── */}
          <div className="space-y-8">
            
            {/* Campus Location Map Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-secondary flex items-center gap-2">
                <MapPin size={20} className="text-primary" /> Campus Location
              </h3>
              <div className="aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4 relative border border-slate-200">
                <iframe 
                  title={`${location.name} Map`}
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  loading="lazy" 
                  allowFullScreen 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(location.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0"
                ></iframe>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-secondary font-bold rounded-xl transition-all shadow-sm group"
              >
                <MapPin size={18} className="group-hover:animate-bounce" /> Open in Google Maps
              </a>
            </div>

            {/* Contact Details Card */}
            <div className="bg-secondary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-6 text-white border-b border-white/10 pb-4">Contact Details</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <Phone className="text-accent mt-1" size={20} />
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone</span>
                      <span className="font-bold text-lg">{location.phone}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="text-accent mt-1" size={20} />
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email</span>
                      <span className="font-medium break-all text-white/90">{location.email}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Clock className="text-accent mt-1" size={20} />
                    <div>
                      <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Hours</span>
                      <span className="font-medium text-white/90">Mon-Fri, 8:00am - 5:00pm</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
