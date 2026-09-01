import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, HelpCircle, MapPin, Calendar, Clock, Users, Building, Mail, Phone, User, ShieldCheck, ChevronLeft, ChevronRight, BookOpen, Hash, Check, FileCheck } from 'lucide-react';
import { CourseInquiry, Course } from '../types';
import { getCourses, saveInquiry } from '../services/storageService';
import { sendInquiryConfirmationEmail, sendAdminInquiryAlert } from '../services/emailService';

interface InquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialCourseTitle?: string;
  initialDate?: string;
}

export const InquireModal: React.FC<InquireModalProps> = ({
  isOpen,
  onClose,
  initialCourseId,
  initialCourseTitle,
  initialDate
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || '');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Angeles City Training Centre, Pampanga');
  const [preferredDate, setPreferredDate] = useState(initialDate || '');
  const [participantsCount, setParticipantsCount] = useState('1 participant (Individual)');
  const [message, setMessage] = useState('');

  // Mode: 'intake' (choose from schedule) or 'custom' (interactive date picker)
  const [dateMode, setDateMode] = useState<'intake' | 'custom'>('intake');

  // Modern Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<CourseInquiry | null>(null);

  // Close calendar popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      return dateStr;
    }
    return dateStr;
  };

  const changeMonth = (offset: number) => {
    setCalendarViewDate(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return next;
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(year, month, day);
    target.setHours(0, 0, 0, 0);
    return target.getTime() < today.getTime();
  };

  // Generate calendar days array
  const currentYear = calendarViewDate.getFullYear();
  const currentMonth = calendarViewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  useEffect(() => {
    const loadedCourses = getCourses();
    setCourses(loadedCourses);

    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
    } else if (loadedCourses.length > 0) {
      setSelectedCourseId(loadedCourses[0].id);
    }

    if (initialDate) {
      setPreferredDate(initialDate);
    }
  }, [initialCourseId, initialDate, isOpen]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !email || !phone) return;

    setIsSubmitting(true);

    const chosenCourse = courses.find(c => c.id === selectedCourseId);
    const refCode = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: CourseInquiry = {
      id: `inq-${Date.now()}`,
      referenceCode: refCode,
      studentName,
      email,
      phone,
      company,
      courseId: selectedCourseId,
      courseTitle: chosenCourse?.title || initialCourseTitle || 'General Course Inquiry',
      location,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      participantsCount,
      message,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to storage
    saveInquiry(newInquiry);

    // Trigger SMTP Email transactions
    await sendInquiryConfirmationEmail(newInquiry);
    await sendAdminInquiryAlert(newInquiry);

    setIsSubmitting(false);
    setSubmittedInquiry(newInquiry);
  };

  const handleReset = () => {
    setSubmittedInquiry(null);
    setStudentName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
    setPreferredDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden relative text-white flex flex-col max-h-[96vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 border border-accent/40 rounded-xl text-accent">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-heading text-white leading-tight">Inquire & Enroll</h3>
              <p className="text-xs text-slate-400">Select course intake dates, duration, & receive corporate pricing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedInquiry ? (
            /* Success State */
            <div className="text-center py-8 space-y-5 animate-fade-in-up">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-xl shadow-green-500/10">
                <CheckCircle size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white mb-1.5 font-heading">Inquiry Submitted Successfully!</h4>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{submittedInquiry.studentName}</strong>. Our admissions team has reserved your schedule inquiry and will reach out shortly.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/90 p-5 rounded-2xl max-w-lg mx-auto text-left divide-y divide-slate-800/70 text-xs shadow-inner">
                {/* Reference Code */}
                <div className="flex justify-between items-center pb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="p-1 rounded-md bg-amber-500/10 text-accent">
                      <Hash size={13} />
                    </div>
                    <span className="font-medium">Reference Code:</span>
                  </div>
                  <span className="font-mono text-accent font-bold text-sm bg-accent/10 px-2.5 py-0.5 rounded-md border border-accent/20">
                    {submittedInquiry.referenceCode}
                  </span>
                </div>

                {/* Selected Course */}
                <div className="flex justify-between items-center py-2.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="p-1 rounded-md bg-sky-500/10 text-sky-400">
                      <BookOpen size={13} />
                    </div>
                    <span className="font-medium">Selected Course:</span>
                  </div>
                  <span className="font-semibold text-white truncate max-w-[240px] text-right">
                    {submittedInquiry.courseTitle}
                  </span>
                </div>

                {/* Intake / Date */}
                <div className="flex justify-between items-center py-2.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="p-1 rounded-md bg-amber-500/10 text-accent">
                      <Calendar size={13} />
                    </div>
                    <span className="font-medium">Intake / Date:</span>
                  </div>
                  <span className="font-semibold text-accent flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Clock size={12} className="text-accent" />
                    {submittedInquiry.preferredDate}
                  </span>
                </div>

                {/* Training Location */}
                <div className="flex justify-between items-center py-2.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="p-1 rounded-md bg-rose-500/10 text-rose-400">
                      <MapPin size={13} />
                    </div>
                    <span className="font-medium">Training Location:</span>
                  </div>
                  <span className="text-slate-200 font-medium text-right max-w-[220px] truncate">
                    {submittedInquiry.location}
                  </span>
                </div>

                {/* Confirmation Email */}
                <div className="flex justify-between items-center pt-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                      <Mail size={13} />
                    </div>
                    <span className="font-medium">Confirmation Email:</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    <Check size={12} /> Sent via SMTP Engine
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full max-w-xs py-3 px-6 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl transition-all shadow-lg text-sm"
              >
                Done & Close
              </button>
            </div>
          ) : (
            /* 2-Column Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Course Selector Row (Span Full Width) */}
              <div>
                <label htmlFor="inquire-course" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Select Course / Program *</span>
                  {selectedCourse?.duration && (
                    <span className="text-accent font-semibold text-xs lowercase">Duration: {selectedCourse.duration}</span>
                  )}
                </label>
                <select
                  id="inquire-course"
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    const c = courses.find(item => item.id === e.target.value);
                    if (c && c.upcomingDates && c.upcomingDates.length > 0) {
                      setPreferredDate(c.upcomingDates[0].split(',')[0].trim());
                    }
                  }}
                  className="w-full h-11 px-4 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs sm:text-sm cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.title} {c.duration ? `(${c.duration})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2-Column Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* ─── COLUMN 1: Upcoming Intakes & Date Selection (5 Cols) ─── */}
                <div className="lg:col-span-5 flex flex-col space-y-3.5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={15} className="text-accent" />
                      <span className="text-xs font-bold font-heading text-white uppercase tracking-wider">
                        Intakes & Duration
                      </span>
                    </div>
                    
                    {/* Toggle Mode Button */}
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setDateMode('intake')}
                        className={`px-2 py-1 rounded-md transition-colors ${dateMode === 'intake' ? 'bg-accent text-secondary' : 'text-slate-400 hover:text-white'}`}
                      >
                        Intakes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateMode('custom')}
                        className={`px-2 py-1 rounded-md transition-colors ${dateMode === 'custom' ? 'bg-accent text-secondary' : 'text-slate-400 hover:text-white'}`}
                      >
                        Custom Date
                      </button>
                    </div>
                  </div>

                  {dateMode === 'intake' ? (
                    /* Preset Upcoming Intake Cards */
                    <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[260px] pr-1">
                      {selectedCourse?.upcomingDates && selectedCourse.upcomingDates.length > 0 ? (
                        selectedCourse.upcomingDates.map((dateStr, idx) => {
                          const parts = dateStr.split(',');
                          const dateRange = parts[0]?.trim() || dateStr;
                          const timeSchedule = parts[1]?.trim() || (selectedCourse.duration ? `${selectedCourse.duration} Schedule` : '9:00 AM - 5:00 PM');
                          const isSelected = preferredDate === dateRange;
                          const isTba = dateRange.toLowerCase().includes('tba') || dateRange.toLowerCase().includes('upon request');

                          return (
                            <div
                              key={idx}
                              onClick={() => setPreferredDate(dateRange)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-amber-500/15 border-accent text-white shadow-md shadow-amber-500/5 ring-1 ring-accent'
                                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-accent' : 'text-white'}`}>
                                  {dateRange}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isSelected 
                                    ? 'bg-accent text-secondary' 
                                    : isTba
                                      ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                }`}>
                                  {isSelected ? '✓ Selected' : isTba ? 'TBA / Flexible' : 'Open'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock size={11} />
                                <span>{timeSchedule}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                          No scheduled public slots. Choose a custom date below.
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Interactive Date Picker & Input */
                    <div className="space-y-3 pt-1">
                      <div className="relative" ref={datePickerRef}>
                        <label htmlFor="inquire-custom-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Pick Custom Start Date
                        </label>
                        <button
                          type="button"
                          id="inquire-custom-date"
                          onClick={() => setShowDatePicker(prev => !prev)}
                          className="w-full h-11 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-left flex items-center justify-between text-xs sm:text-sm cursor-pointer hover:border-accent"
                        >
                          <span className={preferredDate ? 'text-white font-semibold' : 'text-slate-500'}>
                            {preferredDate ? formatDisplayDate(preferredDate) : 'Click to select date...'}
                          </span>
                          <Calendar size={15} className="text-accent" />
                        </button>

                        {/* Calendar Popover */}
                        {showDatePicker && (
                          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 backdrop-blur-xl animate-fade-in text-white">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                              <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                disabled={
                                  calendarViewDate.getFullYear() === new Date().getFullYear() &&
                                  calendarViewDate.getMonth() <= new Date().getMonth()
                                }
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-25"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <span className="text-xs font-bold text-white">
                                {monthNames[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
                              </span>
                              <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-slate-400">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => <span key={i}>{d}</span>)}
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                              {calendarDays.map((day, idx) => {
                                if (day === null) return <div key={idx} className="h-7 w-7" />;
                                const formattedDayStr = `${calendarViewDate.getFullYear()}-${String(calendarViewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = preferredDate === formattedDayStr;
                                const isPast = isPastDate(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day);

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => {
                                      if (!isPast) {
                                        setPreferredDate(formattedDayStr);
                                        setShowDatePicker(false);
                                      }
                                    }}
                                    className={`h-7 w-7 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                                      isPast
                                        ? 'text-slate-600 cursor-not-allowed line-through opacity-30'
                                        : isSelected
                                        ? 'bg-accent text-secondary font-bold shadow-md'
                                        : 'text-slate-300 hover:bg-white/10'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Badge */}
                  <div className="mt-auto pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target Date:</span>
                    <span className="font-bold text-accent truncate max-w-[170px]">
                      {preferredDate || 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* ─── COLUMN 2: Registrant & Training Details (7 Cols) ─── */}
                <div className="lg:col-span-7 space-y-3.5">
                  
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquire-name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          id="inquire-name"
                          name="name"
                          autoComplete="name"
                          type="text"
                          required
                          placeholder="e.g. Juan Dela Cruz"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full h-11 pl-9 pr-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquire-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          id="inquire-email"
                          name="email"
                          autoComplete="email"
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 pl-9 pr-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquire-phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Phone / Mobile *
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          id="inquire-phone"
                          name="phone"
                          autoComplete="tel"
                          type="tel"
                          required
                          placeholder="+63 9XX XXX XXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-11 pl-9 pr-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquire-company" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Company (Optional)
                      </label>
                      <div className="relative">
                        <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          id="inquire-company"
                          name="company"
                          autoComplete="organization"
                          type="text"
                          placeholder="e.g. Acme Offshore Energy"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full h-11 pl-9 pr-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Participants Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inquire-location" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                        <MapPin size={13} className="text-accent" /> Location
                      </label>
                      <select
                        id="inquire-location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full h-11 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm cursor-pointer"
                      >
                        <option value="Angeles City Training Centre, Pampanga" className="bg-slate-900">Angeles City Centre</option>
                        <option value="Nationwide Client Onsite Delivery" className="bg-slate-900">Nationwide Onsite</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="inquire-participants" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                        <Users size={13} className="text-accent" /> Participants
                      </label>
                      <select
                        id="inquire-participants"
                        name="participants"
                        value={participantsCount}
                        onChange={(e) => setParticipantsCount(e.target.value)}
                        className="w-full h-11 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm cursor-pointer"
                      >
                        <option value="1 participant (Individual)" className="bg-slate-900">1 Individual</option>
                        <option value="2-5 participants (Small Team)" className="bg-slate-900">2-5 Team</option>
                        <option value="6-15 participants (Group)" className="bg-slate-900">6-15 Group</option>
                        <option value="15+ participants (Corporate Batch)" className="bg-slate-900">15+ Corporate</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="inquire-message" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Message / Special Requirements
                    </label>
                    <textarea
                      id="inquire-message"
                      name="message"
                      autoComplete="off"
                      rows={2}
                      placeholder="Specify any questions, preferred schedule timing, or group customization requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full min-h-[56px] max-h-[96px] p-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-xs sm:text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 transition-colors text-xs sm:text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/20 flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={15} /> Submit Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
