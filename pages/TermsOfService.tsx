import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  FileText, Shield, AlertCircle, Scale, Globe, Phone, Mail,
  CheckCircle, ChevronDown, ChevronUp, BookOpen, Users, Lock, Clock,
  Award, Search, HelpCircle, ArrowRight, ShieldCheck, Check, Sparkles, Building2, MapPin
} from 'lucide-react';

interface TermClause {
  id: string;
  category: 'General' | 'Enrollment' | 'Conduct' | 'Legal';
  icon: React.ReactNode;
  title: string;
  summary: string;
  details: React.ReactNode;
}

export const TermsOfService: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'eligibility': true,
    'services': true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    clauses.forEach(c => { all[c.id] = true; });
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const clauses: TermClause[] = [
    {
      id: 'eligibility',
      category: 'General',
      icon: <Users className="text-amber-500" size={20} />,
      title: '1. Eligibility & Account Registration',
      summary: 'Candidate requirements, identification verification, and account credentials security.',
      details: (
        <div className="space-y-3">
          <p>
            To access our industrial safety programs, GWO courses, or digital portals, all candidates and participant sponsors must meet standard qualification criteria:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 my-2">
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Age Requirement:</strong> Minimum 18 years of age (or verified written parental/employer consent).</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Valid Identification:</strong> Government-issued photo ID and valid WINDA ID (for GWO modules).</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Medical Fitness:</strong> Signed medical declaration confirming physical capability for high-risk exercises.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Credential Security:</strong> Confidentiality and non-transferability of student account access.</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SKYLAR EDUCATION ASIA reserves the right to decline admissions or suspend accounts where false information or unsafe conditions are identified.
          </p>
        </div>
      )
    },
    {
      id: 'services',
      category: 'Enrollment',
      icon: <BookOpen className="text-amber-500" size={20} />,
      title: '2. Course Delivery, Certification & WINDA Registration',
      summary: 'Standards alignment with Global Wind Organisation (GWO), modules completion, and international validity.',
      details: (
        <div className="space-y-3">
          <p>
            Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). Training is conducted locally in our Angeles City Training Centre or certified client facilities, while formal accredited certifications are issued in full compliance with international standards:
          </p>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300">
            <strong>GWO WINDA Database Upload:</strong> Upon successful competency assessment, training records are uploaded directly to the GWO WINDA registry within 10 business days, ensuring global portability across international wind energy projects.
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Course bookings are confirmed upon verified seat availability and formal booking confirmation.</li>
            <li>Practical sessions require 100% attendance and successful demonstration of physical competencies.</li>
            <li>Certificates specify validity periods (typically 2 years for GWO refresher cycles).</li>
          </ul>
        </div>
      )
    },
    {
      id: 'fees-payment',
      category: 'Enrollment',
      icon: <FileText className="text-amber-500" size={20} />,
      title: '3. Fees, Payment Terms & Schedules',
      summary: 'Tuition rates, corporate billing options, deposit policies, and session transfers.',
      details: (
        <div className="space-y-3">
          <p>
            All course fees are clearly quoted in Philippine Peso (PHP) or US Dollars (USD) according to published catalogs and approved commercial quotations:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 my-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Individuals</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Payment required in full prior to course start date.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Corporate Clients</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Purchase orders or 30-day approved credit invoices accepted.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Transfers</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Free schedule transfer up to 5 days prior to scheduled intake.</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            For specialized corporate group rates or custom on-site delivery terms, please consult your assigned account coordinator.
          </p>
        </div>
      )
    },
    {
      id: 'conduct-safety',
      category: 'Conduct',
      icon: <ShieldCheck className="text-amber-500" size={20} />,
      title: '4. Workplace Health, Safety & Code of Conduct',
      summary: 'Mandatory PPE compliance, zero-tolerance substance policy, and facility safety regulations.',
      details: (
        <div className="space-y-3">
          <p>
            Safety is paramount across all Skylar training simulators, high-angle towers, and confined space structures:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li><strong>PPE Regulations:</strong> Appropriate safety boots and workwear are mandatory. Certified harnesses, helmets, and rescue gear are inspected and provided on-site.</li>
            <li><strong>Zero Substance Policy:</strong> Alcohol or illicit substance consumption is strictly forbidden. Random or suspicion-based screening may be enforced.</li>
            <li><strong>Safety Direction:</strong> Candidates must strictly obey trainer safety commands and emergency stop protocols at all times.</li>
            <li><strong>Respectful Environment:</strong> Harassment, bullying, or unsafe conduct will result in immediate removal without refund.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      category: 'Legal',
      icon: <Lock className="text-amber-500" size={20} />,
      title: '5. Intellectual Property & Digital Learning Content',
      summary: 'Proprietary rights over training syllabi, manuals, examination material, and digital portals.',
      details: (
        <div className="space-y-3">
          <p>
            All course materials, diagrams, manuals, technical animations, and assessment frameworks are protected under copyright laws belonging to Skylar Education Asia and its licensing partners.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            No participant may record, duplicate, broadcast, or commercially redistribute training materials or examination question banks without prior express written authorization.
          </p>
        </div>
      )
    },
    {
      id: 'privacy-data',
      category: 'Legal',
      icon: <Shield className="text-amber-500" size={20} />,
      title: '6. Privacy, WINDA & Data Protection',
      summary: 'Compliance with Philippine Data Privacy Act of 2012 (RA 10173) and international regulatory handling.',
      details: (
        <div className="space-y-3">
          <p>
            We respect candidate confidentiality and process records in accordance with the <strong>Data Privacy Act of 2012</strong> and GWO auditing protocols.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Candidate identification and performance records are shared strictly with certified bodies (GWO WINDA, industry safety registers) for credential verification. Review our complete <Link to="/student-info/privacy-notice" className="text-amber-500 font-bold hover:underline">Privacy Notice</Link> for data subject rights.
          </p>
        </div>
      )
    },
    {
      id: 'liability-jurisdiction',
      category: 'Legal',
      icon: <Scale className="text-amber-500" size={20} />,
      title: '7. Limitation of Liability & Governing Law',
      summary: 'Legal venue, force majeure considerations, and statutory rights.',
      details: (
        <div className="space-y-3">
          <p>
            These terms are executed under and governed by the laws of the <strong>Republic of the Philippines</strong>.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            In no event shall Skylar Education Asia be liable for indirect, incidental, or consequential damages exceeding the total training fees paid for the course in question. Natural weather disruptions, typhoons, or safety-mandated closures will be promptly accommodated with flexible rescheduling options.
          </p>
        </div>
      )
    }
  ];

  const filteredClauses = clauses.filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = searchTerm.trim() === '' || 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#041024] min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <Breadcrumbs />

      {/* Modern Hero Section */}
      <div className="bg-[#041024] text-white relative overflow-hidden py-16 md:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-500 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600 rounded-full blur-[130px]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Scale size={14} /> Legal &amp; Governance
            </span>
            <span className="text-xs text-slate-400 font-medium">Updated August 2026</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 text-white tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            Transparent, certified standards governing student admissions, GWO WINDA credentials, workplace safety compliance, and international training delivery by SKYLAR EDUCATION ASIA.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>GWO Certified</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>ISO 9001 Standard</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>DPA 2012 Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>Philippines Operations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 max-w-5xl py-10 md:py-14">
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white dark:bg-[#071328] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {['All', 'General', 'Enrollment', 'Conduct', 'Legal'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search clauses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#071328] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-amber-400 dark:text-white placeholder-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-slate-500 hover:text-amber-500 transition-colors px-2 py-1.5 cursor-pointer"
            >
              Expand All
            </button>
          </div>
        </div>

        {/* Clauses Accordion Stack */}
        <div className="space-y-4">
          {filteredClauses.length > 0 ? (
            filteredClauses.map((clause) => {
              const isOpen = !!expandedSections[clause.id];

              return (
                <div
                  key={clause.id}
                  id={clause.id}
                  className="bg-white dark:bg-[#071328] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(clause.id)}
                    className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        {clause.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {clause.category}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading group-hover:text-amber-500 transition-colors">
                          {clause.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {clause.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 md:px-6 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-fade-in leading-relaxed space-y-3 bg-slate-50/40 dark:bg-slate-900/20">
                      {clause.details}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#071328] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-sm">
              No clauses matched "{searchTerm}". Try clearing your search query.
            </div>
          )}
        </div>

        {/* Support & Legal Contact Card */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-[#041024] to-[#0a234d] text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                <HelpCircle size={14} /> Need Clarification?
              </span>
              <h3 className="text-2xl font-bold font-heading mb-2">Legal &amp; Enrolment Inquiries</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Have specific contractual questions or corporate compliance requirements? Our admissions &amp; standards team is available to assist.
              </p>
              
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-2"><Building2 size={14} className="text-amber-400 shrink-0" /> SKYLAR EDUCATION ASIA INC.</p>
                <p className="flex items-start gap-2"><MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" /> Angeles City Training Centre, 2009 Pampanga, Philippines</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <a 
                href="mailto:bon@skylarasia.com" 
                className="flex items-center gap-3 p-3.5 bg-white/10 hover:bg-amber-500 hover:text-slate-950 rounded-2xl border border-white/10 transition-all font-medium text-xs group"
              >
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-900 block">General Admissions</span>
                  <span>bon@skylarasia.com</span>
                </div>
              </a>

              <a 
                href="tel:+639683824294" 
                className="flex items-center gap-3 p-3.5 bg-white/10 hover:bg-amber-500 hover:text-slate-950 rounded-2xl border border-white/10 transition-all font-medium text-xs group"
              >
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-900 block">Direct Hotline</span>
                  <span>+63 968 382 4294</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8 text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} SKYLAR EDUCATION ASIA. All rights reserved. &bull; GWO Certified International Provider
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
