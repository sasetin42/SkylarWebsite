import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, HelpCircle, MapPin, Calendar, Users, Building, Mail, Phone, User, ShieldCheck } from 'lucide-react';
import { CourseInquiry } from '../types';
import { getCourses, saveInquiry } from '../services/storageService';
import { sendInquiryConfirmationEmail, sendAdminInquiryAlert } from '../services/emailService';

interface InquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialCourseTitle?: string;
}

export const InquireModal: React.FC<InquireModalProps> = ({
  isOpen,
  onClose,
  initialCourseId,
  initialCourseTitle
}) => {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || '');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Angeles City Training Centre, Pampanga');
  const [preferredDate, setPreferredDate] = useState('');
  const [participantsCount, setParticipantsCount] = useState('1 participant (Individual)');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<CourseInquiry | null>(null);

  useEffect(() => {
    const loadedCourses = getCourses();
    setCourses(loadedCourses.map(c => ({ id: c.id, title: c.title })));

    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
    } else if (loadedCourses.length > 0) {
      setSelectedCourseId(loadedCourses[0].id);
    }
  }, [initialCourseId, isOpen]);

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-white">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/20 border border-accent/40 rounded-xl text-accent">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-heading text-white">Inquire Now</h3>
              <p className="text-xs md:text-sm text-slate-400">Get course details, schedules & custom group pricing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {submittedInquiry ? (
            /* Success State */
            <div className="text-center py-8 space-y-6 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-xl shadow-green-500/10">
                <CheckCircle size={44} />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Inquiry Submitted Successfully!</h4>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{submittedInquiry.studentName}</strong>. Our admissions team has received your inquiry and will reach out shortly.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <span>Reference Code:</span>
                  <span className="font-mono text-accent font-bold text-sm">{submittedInquiry.referenceCode}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Selected Course:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{submittedInquiry.courseTitle}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Training Location:</span>
                  <span>{submittedInquiry.location}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Confirmation Email:</span>
                  <span className="text-green-400 font-medium">Sent via SMTP Engine</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full max-w-xs py-3.5 px-6 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/20"
              >
                Done & Close
              </button>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Course Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Select Course / Program *
                </label>
                <div className="relative">
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full py-3.5 px-4 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm appearance-none cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan Dela Cruz"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+63 9XX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Company / Organization (Optional)
                  </label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Offshore Energy"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Training Parameters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <MapPin size={14} className="text-accent" /> Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full py-3 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-sm"
                  >
                    <option value="Angeles City Training Centre, Pampanga" className="bg-slate-900">Angeles City Training Centre, Pampanga</option>
                    <option value="Nationwide Client Onsite Delivery" className="bg-slate-900">Nationwide Client Onsite Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar size={14} className="text-accent" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full py-3 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                    <Users size={14} className="text-accent" /> Participants
                  </label>
                  <select
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(e.target.value)}
                    className="w-full py-3 px-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent text-sm"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message / Special Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify any questions, preferred schedule timing, or group customization requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-accent hover:bg-amber-400 text-secondary font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/20 flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={16} /> Submit Inquiry
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
