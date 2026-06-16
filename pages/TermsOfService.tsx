
import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  FileText, Shield, AlertCircle, Scale, Globe, Phone, Mail,
  CheckCircle, ChevronDown, ChevronUp, BookOpen, Users, Lock, Clock
} from 'lucide-react';

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, icon, title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0">{icon}</div>
          <h3 className="text-base font-bold text-secondary group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <div className="shrink-0 ml-4 text-gray-400">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-0 text-gray-600 text-sm leading-relaxed space-y-3 border-t border-gray-50 animate-fade-in-up">
          {children}
        </div>
      )}
    </div>
  );
};

export const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs />

      {/* Hero */}
      <div className="bg-secondary text-white relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Scale className="text-accent" size={22} />
            </div>
            <span className="text-accent font-bold text-xs uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Terms of Service</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully before using our services. By accessing or using Skylar Education Asia Inc. services, you agree to be bound by these terms.
          </p>
          <p className="text-gray-400 text-sm mt-4">
            <Clock size={14} className="inline mr-1.5" />
            Last Updated: 1 June 2026 &nbsp;|&nbsp; Effective Date: 1 June 2026
          </p>
        </div>
      </div>

      {/* Quick Summary Banner */}
      <div className="bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl py-5">
          <div className="flex flex-wrap gap-6 text-sm font-medium text-secondary">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> RTO #45000 Registered</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> ISO 9001 Certified</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> GDPR & Privacy Act Compliant</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Philippines Operations</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-5xl py-16">

        {/* Intro */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-6 mb-10 text-sm text-blue-900 leading-relaxed">
          <p className="font-bold mb-1 flex items-center gap-2"><AlertCircle size={16} /> Important Notice</p>
          <p>These Terms of Service ("Terms") govern your access to and use of all services, platforms, and training programs offered by <strong>Skylar Education Asia Inc.</strong> ("Skylar", "we", "us", "our"), a registered training organisation operating in the Philippines, affiliated with Skylar Education Pty Ltd (Australia). By enrolling in any course or using our website, you confirm that you accept these Terms.</p>
        </div>

        <div className="space-y-4">

          <Section id="eligibility" icon={<Users size={20} />} title="1. Eligibility and Account Registration">
            <p>To access our training services, you must:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Be at least 18 years of age, or have parental/guardian consent if under 18</li>
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorised access to your account</li>
            </ul>
            <p className="mt-3">Skylar Education Asia Inc. reserves the right to refuse enrolment or terminate accounts at its discretion, particularly in the case of violations of these Terms.</p>
          </Section>

          <Section id="services" icon={<BookOpen size={20} />} title="2. Training Services & Enrolment">
            <p>Skylar Education Asia Inc. provides nationally recognised and internationally accredited vocational safety training, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>GWO (Global Wind Organisation)</strong> — Basic Safety Training, Advanced Rescue, Blades</li>
              <li><strong>High Risk Work Licensing</strong> — Dogging, Rigging, Crane Operations, Forklift</li>
              <li><strong>Industrial Safety Programs</strong> — Working at Heights, Confined Space, Fire Safety</li>
              <li><strong>First Aid & Emergency Response</strong> — HLTAID and related qualifications</li>
            </ul>
            <p className="mt-3">Enrolment is complete only upon receipt of full payment confirmation and written acceptance from Skylar Education. Course places are not guaranteed until confirmed in writing.</p>
          </Section>

          <Section id="payment" icon={<FileText size={20} />} title="3. Fees, Payment, and Refunds">
            <p>All fees are quoted in Australian Dollars (AUD) or Philippine Peso (PHP) as applicable. Fees must be paid in full prior to the commencement of training unless a formal payment plan has been agreed in writing.</p>
            <div className="mt-3 space-y-2">
              <p><strong>Cancellation by Student:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>More than 10 business days before commencement: Full refund minus administration fee</li>
                <li>5–10 business days before commencement: 50% refund</li>
                <li>Less than 5 business days: No refund (credit toward future course may be considered)</li>
              </ul>
              <p className="mt-2"><strong>Cancellation by Skylar:</strong> If Skylar Education cancels a course, all enrolled students will receive a full refund or the option to transfer to the next available session.</p>
            </div>
            <p className="mt-3 text-xs text-gray-500">See our full <a href="#/student-info/refund-policy" className="text-primary underline">Refund Policy</a> for complete details.</p>
          </Section>

          <Section id="conduct" icon={<Shield size={20} />} title="4. Student Obligations & Code of Conduct">
            <p>All students are expected to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Attend all scheduled training sessions punctually</li>
              <li>Bring required personal protective equipment (PPE) as specified</li>
              <li>Treat all trainers, staff, and fellow students with respect</li>
              <li>Not engage in any form of harassment, discrimination, or bullying</li>
              <li>Comply with all workplace health and safety (WHS) rules during training</li>
              <li>Not use mobile phones or other devices in a distracting manner during sessions</li>
            </ul>
            <p className="mt-3">Skylar Education reserves the right to remove any student from training for misconduct without refund.</p>
          </Section>

          <Section id="certification" icon={<CheckCircle size={20} />} title="5. Certification & Competency Assessment">
            <p>Certification is issued only upon successful demonstration of all required competencies. Skylar Education cannot guarantee that every enrolled student will achieve certification. Assessment decisions are based on evidence gathered during training and must meet the standards set by the relevant training package or accrediting body (e.g., GWO, TESDA).</p>
            <p className="mt-3">If a student is deemed not yet competent (NYC), they may be offered a re-assessment opportunity at an additional fee. The number of re-assessment attempts is at the trainer's discretion.</p>
          </Section>

          <Section id="intellectual-property" icon={<Lock size={20} />} title="6. Intellectual Property">
            <p>All training materials, course content, manuals, assessments, and digital resources provided by Skylar Education Asia Inc. are the exclusive intellectual property of Skylar Education Asia Inc. and/or its licensors.</p>
            <p className="mt-3">Students may not:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Reproduce, distribute, or sell any course materials</li>
              <li>Record training sessions without prior written consent</li>
              <li>Share login credentials or digital access with third parties</li>
            </ul>
          </Section>

          <Section id="privacy" icon={<Shield size={20} />} title="7. Privacy & Data Protection">
            <p>The collection, storage, and use of your personal information is governed by our Privacy Notice. By enrolling, you consent to the collection and use of your data as described therein, including mandatory disclosure to relevant government authorities as required by the National VET Data Collection and TESDA (Technical Education and Skills Development Authority) requirements.</p>
            <p className="mt-3 text-xs text-gray-500">See our full <a href="#/student-info/privacy-notice" className="text-primary underline">Privacy Notice</a> for complete details.</p>
          </Section>

          <Section id="liability" icon={<AlertCircle size={20} />} title="8. Limitation of Liability">
            <p>To the maximum extent permitted by law, Skylar Education Asia Inc. shall not be liable for:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Any indirect, consequential, or incidental damages arising from use of our services</li>
              <li>Loss of income or employment outcomes resulting from training or certification</li>
              <li>Any physical injury sustained outside of training activities while on-site</li>
              <li>Disruptions to training caused by events beyond our control (force majeure)</li>
            </ul>
            <p className="mt-3">Our total liability shall not exceed the total fees paid by the student for the relevant course.</p>
          </Section>

          <Section id="governing-law" icon={<Globe size={20} />} title="9. Governing Law & Jurisdiction">
            <p>These Terms are governed by the laws of the Republic of the Philippines. For Australian operations and students, the relevant laws of the Commonwealth of Australia and the state/territory of operation apply. Any disputes shall be submitted to the jurisdiction of the applicable courts of the relevant country.</p>
            <p className="mt-3">Skylar Education encourages all disputes to be resolved through its internal complaints process prior to any formal legal action. See our <a href="#/student-info/complaints" className="text-primary underline">Complaints Policy</a>.</p>
          </Section>

          <Section id="changes" icon={<FileText size={20} />} title="10. Changes to These Terms">
            <p>Skylar Education Asia Inc. reserves the right to update or modify these Terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services after changes are posted constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.</p>
            <p className="mt-3">For material changes, we will notify enrolled students via email to the address on file.</p>
          </Section>

        </div>

        {/* Contact */}
        <div className="mt-12 bg-secondary text-white rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Questions about these Terms?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                If you have questions about our Terms of Service or any other legal matter, our team is happy to assist.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <a href="mailto:info@skylareducation.asia" className="flex items-center gap-3 text-gray-200 hover:text-accent transition-colors">
                <div className="p-2 bg-white/10 rounded-lg"><Mail size={16} /></div>
                info@skylareducation.asia
              </a>
              <a href="tel:+63451234567" className="flex items-center gap-3 text-gray-200 hover:text-accent transition-colors">
                <div className="p-2 bg-white/10 rounded-lg"><Phone size={16} /></div>
                +63 45 123 4567
              </a>
              <div className="flex items-center gap-3 text-gray-200">
                <div className="p-2 bg-white/10 rounded-lg"><Globe size={16} /></div>
                www.skylareducation.asia
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          © 2026 Skylar Education Asia Inc. All rights reserved. &nbsp;|&nbsp; RTO #45000 &nbsp;|&nbsp; ISO 9001 Certified
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
