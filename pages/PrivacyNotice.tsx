
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Shield, Lock, FileText, Globe, Phone, Mail, CheckCircle, ChevronDown, ChevronUp,
  Search, HelpCircle, ArrowRight, ShieldCheck, Database, KeyRound, UserCheck,
  Eye, FileCheck, AlertTriangle, Scale, RefreshCw, Send, Check
} from 'lucide-react';

interface PrivacyClause {
  id: string;
  category: 'Collection' | 'WINDA & GWO' | 'Data Rights' | 'Security';
  icon: React.ReactNode;
  title: string;
  summary: string;
  details: React.ReactNode;
}

export const PrivacyNotice: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'collection-scope': true,
    'gwo-winda-handling': true
  });
  const [dpoFormState, setDpoFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [dpoRequestType, setDpoRequestType] = useState('Data Access Request');

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

  const handleDpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDpoFormState('submitting');
    setTimeout(() => {
      setDpoFormState('success');
    }, 1200);
  };

  const clauses: PrivacyClause[] = [
    {
      id: 'collection-scope',
      category: 'Collection',
      icon: <Database className="text-amber-500" size={20} />,
      title: '1. What Information We Collect & Why',
      summary: 'Identity verification, medical fitness declarations, contact information, and training records.',
      details: (
        <div className="space-y-4">
          <p>
            As an internationally accredited industrial safety and wind energy training provider, SKYLAR EDUCATION ASIA collects and processes personal information strictly required to deliver our certified training curricula, verify student identity, and comply with safety governance:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 my-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Delegate Identification
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Full legal name, birthdate, government-issued identification number (passport/national ID), and candidate photograph for certification rosters.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> GWO WINDA Credentials
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Your unique <strong>WINDA ID</strong> (Global Wind Organisation delegate identifier) required to link and populate valid certified safety modules.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Medical Fitness & Health
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Signed self-declaration of physical capability and absence of medical contraindications for Working at Heights, Confined Space, and heavy rescue.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Corporate & Billing Details
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Sponsor company name, billing address, tax identification (TIN), emergency contact person, and official email addresses.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'gwo-winda-handling',
      category: 'WINDA & GWO',
      icon: <Globe className="text-amber-500" size={20} />,
      title: '2. WINDA Database Integration & International Disclosure',
      summary: 'Data flows between SKYLAR EDUCATION ASIA, Global Wind Organisation (GWO), and employer registries.',
      details: (
        <div className="space-y-3">
          <p>
            Skylar Education Asia is an affiliate of Skylar Education Pty Ltd (Australia). All successfully completed GWO training records are transmitted to the centralized GWO WINDA global database:
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-slate-800 dark:text-amber-200 space-y-2">
            <div className="font-bold text-amber-500 flex items-center gap-2">
              <ShieldCheck size={16} /> International WINDA Synchronization Standard
            </div>
            <p className="leading-relaxed">
              When you complete a module (e.g. BST, ART, BTT), your WINDA ID, assessment date, course module code, and pass status are securely uploaded via encrypted API to GWO servers (Copenhagen, Denmark) within 10 business days.
            </p>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mt-2">
            <li>GWO uses this data to maintain the global registry of qualified wind turbine technicians and safety personnel.</li>
            <li>Prospective employers and turbine operators can verify your certificate validity in real-time by entering your WINDA ID.</li>
            <li>We never sell, rent, or commercialize your personal information to third-party marketing companies.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dpa-compliance',
      category: 'Data Rights',
      icon: <Scale className="text-amber-500" size={20} />,
      title: '3. Philippine Data Privacy Act of 2012 (RA 10173) Rights',
      summary: 'Your statutory rights as a data subject including access, correction, erasure, and portability.',
      details: (
        <div className="space-y-4">
          <p>
            In full compliance with Republic Act No. 10173 (Data Privacy Act of 2012) and National Privacy Commission (NPC) circulars, every candidate and student is guaranteed the following statutory rights:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">1. Right to Be Informed</span>
              <p className="text-slate-500 dark:text-slate-400">You are informed before personal data is entered into our LMS or certification registry.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">2. Right to Access &amp; Portability</span>
              <p className="text-slate-500 dark:text-slate-400">Request copies of your academic records, attendance sheets, and examination grades.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">3. Right to Rectification</span>
              <p className="text-slate-500 dark:text-slate-400">Correct any inaccurate name spelling, birthdate, or ID details on issued certificates.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">4. Right to Object &amp; File Complaints</span>
              <p className="text-slate-500 dark:text-slate-400">File inquiries directly with our Data Protection Officer or the National Privacy Commission.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security-measures',
      category: 'Security',
      icon: <Lock className="text-amber-500" size={20} />,
      title: '4. Physical, Technical & Organizational Security Measures',
      summary: '256-bit encryption, role-based database access, and ISO 9001 quality audit trails.',
      details: (
        <div className="space-y-3">
          <p>
            We implement multi-layered defense mechanisms to safeguard candidate records against unauthorized access, alteration, disclosure, or accidental destruction:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 my-2 text-xs">
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
              <span><strong>TLS 1.3 Encryption:</strong> All web traffic and portal submissions are fully encrypted.</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
              <span><strong>Role-Based Access:</strong> Only certified registrar staff access identification and medical files.</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
              <span><strong>Secure Data Center:</strong> Daily automated backups with geo-redundant disaster recovery.</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
              <span><strong>Retention Schedules:</strong> Records retained for the duration mandated by DOLE and GWO audit rules.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'cookies-tracking',
      category: 'Security',
      icon: <Eye className="text-amber-500" size={20} />,
      title: '5. Cookies & Website Analytics',
      summary: 'Essential session cookies, anonymous traffic analytics, and browser preference controls.',
      details: (
        <div className="space-y-3">
          <p>
            Our web platform uses standard cookies and session storage to provide a secure and streamlined browsing experience:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li><strong>Essential Cookies:</strong> Required for secure login, cart operations, course inquiries, and form submission protection.</li>
            <li><strong>Functional Storage:</strong> Saves your dark/light theme choice and preferred training center filters.</li>
            <li><strong>Analytics:</strong> Aggregated, non-personally identifiable metrics used to optimize page speed and navigation.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'surveys-communications',
      category: 'Collection',
      icon: <Mail className="text-amber-500" size={20} />,
      title: '6. Student Feedback, Surveys & Renewal Notices',
      summary: 'Post-training satisfaction evaluations, refresher countdown alerts, and opt-out preferences.',
      details: (
        <div className="space-y-3">
          <p>
            Following course completion, delegates may receive post-training quality evaluation surveys to support our ISO 9001 continuous improvement audits:
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            We may also send courtesy renewal reminder notifications 90 days before your 2-year GWO certificate expiration. You may easily opt out of non-mandatory communications at any time.
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
              <Shield size={14} /> Privacy &amp; Data Protection
            </span>
            <span className="text-xs text-slate-400 font-medium">Updated August 2026</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 text-white tracking-tight">
            Privacy Notice
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            How SKYLAR EDUCATION ASIA collects, uses, protects, and discloses student, corporate delegate, and WINDA registration data under the Philippine Data Privacy Act of 2012 (RA 10173) and international GWO governance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>DPA 2012 (RA 10173)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>GWO WINDA Registered</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>256-bit TLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>ISO 9001 Audit Trail</span>
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
            {['All', 'Collection', 'WINDA & GWO', 'Data Rights', 'Security'].map(cat => (
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
                placeholder="Search privacy topics..."
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
              No privacy topics matched "{searchTerm}". Try clearing your search query.
            </div>
          )}
        </div>

        {/* Data Protection Officer (DPO) Request Form Card */}
        <div className="mt-12 bg-white dark:bg-[#071328] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 mb-3">
              <FileCheck size={14} /> Exercise Your Privacy Rights
            </span>
            <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Submit a Data Subject Request (DPO)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Need to access your training file, rectify WINDA ID details, or request verification of data processing records? Submit your direct request to our Data Protection Officer:
            </p>

            {dpoFormState === 'success' ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-3 animate-fade-in">
                <CheckCircle size={22} className="shrink-0" />
                <div>
                  <p className="font-bold">Request Transmitted to Data Protection Office</p>
                  <p className="text-xs font-normal text-slate-600 dark:text-slate-300 mt-0.5">
                    Your request reference code has been logged. Our compliance officer will acknowledge within 48 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDpoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Juan Dela Cruz" 
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-400 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="student@example.ph" 
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-400 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      WINDA ID (If applicable)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. JD123456" 
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-400 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Request Type
                    </label>
                    <select
                      value={dpoRequestType}
                      onChange={(e) => setDpoRequestType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-amber-400 dark:text-white cursor-pointer"
                    >
                      <option value="Data Access Request">Data Access Request (Copy of Records)</option>
                      <option value="Information Rectification">Information Rectification / Correction</option>
                      <option value="WINDA ID Verification">WINDA ID Upload Verification</option>
                      <option value="Privacy Inquiries / Other">Privacy Inquiries / Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dpoFormState === 'submitting'}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {dpoFormState === 'submitting' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      Transmitting Request...
                    </>
                  ) : (
                    <>
                      <Send size={13} /> Submit DPO Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Support & Legal Contact Card */}
        <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-[#041024] to-[#0a234d] text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                <HelpCircle size={14} /> Data Privacy Office
              </span>
              <h3 className="text-2xl font-bold font-heading mb-2">Contact Our Privacy Officer</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                For formal privacy inquiries, data subject requests, or regulatory audits under RA 10173, reach our compliance coordinators directly:
              </p>
              <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                <p className="font-bold text-white">SKYLAR EDUCATION ASIA - Data Privacy Unit</p>
                <p>Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, 2009 Pampanga, Philippines</p>
                <p>Email: <a href="mailto:bon@skylarasia.com" className="text-amber-400 hover:underline">bon@skylarasia.com</a> / <a href="mailto:junrey@skylarasia.com" className="text-amber-400 hover:underline">junrey@skylarasia.com</a></p>
                <p>Phone: <a href="tel:+639683824294" className="text-amber-400 hover:underline">+63 968 382 4294</a> / <a href="tel:+639159029406" className="text-amber-400 hover:underline">+63 915 902 9406</a></p>
                <p>Facebook: <a href="https://www.facebook.com/skylarasiapac/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">facebook.com/skylarasiapac</a></p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <a href="mailto:bon@skylarasia.com" className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl"><Mail size={16} /></div>
                <div>
                  <div className="font-bold text-white">Direct DPO Inquiries</div>
                  <div className="text-slate-400 text-xs">bon@skylarasia.com</div>
                </div>
              </a>

              <a href="tel:+639683824294" className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><Phone size={16} /></div>
                <div>
                  <div className="font-bold text-white">Compliance Helpline</div>
                  <div className="text-slate-400 text-xs">+63 968 382 4294 / +63 915 902 9406</div>
                </div>
              </a>

              <a href="https://www.facebook.com/skylarasiapac/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><Globe size={16} /></div>
                <div>
                  <div className="font-bold text-white">Official Facebook Channel</div>
                  <div className="text-slate-400 text-xs">facebook.com/skylarasiapac</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; {new Date().getFullYear()} SKYLAR EDUCATION ASIA All Rights Reserved. &nbsp;|&nbsp; DPA 2012 (RA 10173) &amp; GWO WINDA Compliant
        </p>
      </div>
    </div>
  );
};

export default PrivacyNotice;
