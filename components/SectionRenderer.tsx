
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Users, Award, Briefcase, Fan, Zap, BookOpen,
  ChevronRight, HardHat, ShieldCheck, Building2, Hammer,
  Target, Eye, Heart, Search, Calendar, FileText, Mail, Shield,
  Globe, UserCheck, Phone
} from 'lucide-react';
import { Button } from './Button';
import { PageSection } from '../types';

// Helper to map icon names to components
const IconMap: Record<string, any> = {
  Users, Award, CheckCircle, Briefcase, Zap, BookOpen, Fan, Target, Eye, Heart,
  Search, Calendar, FileText, Mail, HardHat, ShieldCheck, Building2, Hammer, Shield,
  Globe, UserCheck, Phone
};

// --- Custom Chart Component for GWO Overview ---
const GWOBenefitsChart: React.FC = () => {
  const chartData = [
    {
      label: "Established as contractual expectation",
      gradient: "conic-gradient(#E67E22 0% 45%, #1C3D72 45% 75%, #3498DB 75% 90%, #AED6F1 90% 95%, #95A5A6 95% 100%)",
      highlight: "45%" // Rank 1
    },
    {
      label: "Improved safety/fewer incidents/injury",
      gradient: "conic-gradient(#E67E22 0% 40%, #1C3D72 40% 70%, #3498DB 70% 85%, #AED6F1 85% 95%, #95A5A6 95% 100%)",
      highlight: "40%" // Rank 1
    },
    {
      label: "More efficient sourcing of labour",
      gradient: "conic-gradient(#1C3D72 0% 35%, #3498DB 35% 65%, #AED6F1 65% 90%, #95A5A6 90% 100%)",
      highlight: "35%" // Rank 2
    },
    {
      label: "Option to outsource non-core training",
      gradient: "conic-gradient(#E67E22 0% 25%, #3498DB 25% 60%, #AED6F1 60% 80%, #95A5A6 80% 100%)",
      highlight: "25%"
    },
    {
      label: "Utilise training budget for proprietary needs",
      gradient: "conic-gradient(#1C3D72 0% 20%, #3498DB 20% 45%, #AED6F1 45% 70%, #95A5A6 70% 100%)",
      highlight: "20%"
    }
  ];

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center animate-fade-in-up">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="font-heading font-bold text-secondary text-lg leading-tight mb-2">
          Benefits of GWO Standards
        </h3>
        <p className="text-sm text-gray-500">Ranking by GWO Members Survey</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8 text-xs font-bold text-gray-600">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#E67E22]"></div> 1 (Most)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#1C3D72]"></div> 2</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3498DB]"></div> 3</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#AED6F1]"></div> 4</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#95A5A6]"></div> 5 (Least)</div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-inner mb-3 transition-transform duration-500 group-hover:scale-110"
              style={{ background: item.gradient }}>
              {/* Center hole for donut effect */}
              <div className="absolute inset-0 m-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx + 1}
                </span>
              </div>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-gray-600 leading-tight max-w-[120px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-right">
        <span className="text-[10px] text-gray-400 italic">Source: GWO members' survey</span>
      </div>
    </div>
  );
};

// --- Custom Component for Emissions Reduction (Linear) ---
const EmissionsReductionChart: React.FC = () => {
  // Data points based on linear time scale:
  // 2023 (0 years) -> 0%
  // 2030 (7 years) -> 43%
  // 2050 (27 years) -> 100%
  // X percentages: 2030 is at (7/27)*100 ≈ 25.9%
  // Y percentages: 100% - value%

  const data = [
    { year: 2023, value: 0, x: '0%', y: '100%' },
    { year: 2030, value: 43, x: '26%', y: '57%' },
    { year: 2050, value: 100, x: '100%', y: '0%' }
  ];

  return (
    <div className="w-full mt-8 md:mt-0 p-2">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-lg">
        <h4 className="text-center font-bold text-gray-700 mb-10">Australia's Emissions Reduction Targets</h4>

        <div className="relative h-64 w-full px-8 pb-8 box-border mx-auto max-w-xl">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-mono -ml-2">
            <span>100%</span>
            <span>0%</span>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono -ml-2">
            <span>50%</span>
          </div>
          {/* Vertical Y-Axis Label */}
          <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap">
            Emissions Reduction (%)
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-x-8 top-0 border-t border-dashed border-gray-200"></div>
          <div className="absolute inset-x-8 top-1/2 border-t border-dashed border-gray-200"></div>
          <div className="absolute inset-x-8 bottom-8 border-t border-gray-300"></div>

          {/* Vertical Reference Line for 2030 */}
          <div className="absolute top-0 bottom-8 border-l border-dashed border-gray-200" style={{ left: 'calc(26% + 2rem)' }}></div>

          {/* Chart Area */}
          <div className="relative h-full w-full mb-8">
            {/* SVG Line */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#FFC107"
                strokeWidth="3"
                points="0,100 26,57 100,0"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-sm"
              />
            </svg>

            {/* Data Points & Labels */}
            {data.map((d, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: d.x, top: d.y, transform: 'translate(-50%, -50%)' }}>
                <div className="mb-2 text-xs font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">{d.value}%</div>
                <div className="w-3 h-3 bg-[#FFC107] rounded-full border-2 border-white shadow-md z-10 hover:scale-125 transition-transform"></div>
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="absolute bottom-0 w-full flex justify-between text-xs font-bold text-gray-600 px-0">
            <span className="transform -translate-x-1/2">2023</span>
            <span className="transform -translate-x-1/2 absolute" style={{ left: '26%' }}>2030</span>
            <span className="transform translate-x-1/2 right-0 absolute">2050</span>
          </div>
          <div className="absolute bottom-[-24px] w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">Year</div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Component for Workforce Productivity ---
const WorkforceProductivityGraphic: React.FC = () => {
  const bubbles = [
    { pct: "10%", label: "+1 day on site each year", size: "w-16 h-16", color: "bg-[#E67E22]", textCol: "text-white" },
    { pct: "10%", label: "+3 days on site each year", size: "w-16 h-16", color: "bg-[#1C3D72]", textCol: "text-white" },
    { pct: "30%", label: "+4 days on site each year", size: "w-24 h-24", color: "bg-[#3498DB]", textCol: "text-white" },
    { pct: "40%", label: "+5 days on site each year", size: "w-32 h-32", color: "bg-[#AED6F1]", textCol: "text-secondary" },
    { pct: "10%", label: "+6 days on site each year", size: "w-16 h-16", color: "bg-[#95A5A6]", textCol: "text-white" },
  ];

  const renderBubble = (item: typeof bubbles[0], idx: number) => (
    <div key={idx} className="flex flex-col items-center text-center gap-2 group shrink-0">
      <div className={`${item.size} rounded-full flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${item.color} ${item.textCol}`}>
        <span className="font-black text-sm md:text-base leading-none">{item.pct}</span>
      </div>
      <p className={`text-[10px] font-bold text-[#E67E22] uppercase tracking-tighter leading-tight max-w-[80px]`}>
        {item.label.split('site').map((part, i) => (
          <span key={i} className={i === 0 ? "block mb-0.5 text-xs text-gray-700 font-extrabold" : "block text-gray-400"}>
            {part}{i === 0 ? "site" : ""}
          </span>
        ))}
      </p>
    </div>
  );

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center animate-fade-in-up">
      <p className="text-sm font-bold text-gray-800 mb-8 leading-relaxed">
        For every GWO certified technician we employ/contract we can expect them to be available for
      </p>

      <div className="flex flex-col gap-8 mb-8">
        {/* Row 1: First 2 items (10%, 10%) */}
        <div className="flex items-end justify-center gap-12">
          {bubbles.slice(0, 2).map((item, idx) => renderBubble(item, idx))}
        </div>

        {/* Row 2: Next 3 items (30%, 40%, 10%) */}
        <div className="flex items-end justify-center gap-4">
          {bubbles.slice(2).map((item, idx) => renderBubble(item, idx + 2))}
        </div>
      </div>
    </div>
  );
};

interface SectionRendererProps {
  section: PageSection;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const [activeGwoTab, setActiveGwoTab] = useState('technical');

  // Custom Render for Technical Proficiency (Updated to Interactive Tabs)
  if (section.id === 'gwo_technical_safety') {
    const tabs = [
      { id: 'technical', label: 'Technical Proficiency and Safety' },
      { id: 'employers', label: 'Benefits to Employers' },
      { id: 'certification', label: 'GWO Certification' }
    ];

    const content: Record<string, { title: string, desc: string }[]> = {
      technical: section.data.items?.map(i => ({ title: i.title, desc: i.description })) || [],
      employers: [
        {
          title: "Building a Professional Training Environment",
          desc: "Employers benefit significantly from having GWO-certified personnel on their teams. The structured training environment fostered by GWO promotes a culture of safety and professionalism, ensuring that all team members are equipped to contribute positively to projects."
        },
        {
          title: "Increasing Operational Efficiency",
          desc: "With a GWO-certified workforce, companies can expect increased operational efficiency. Certified technicians possess the skills necessary to perform their tasks effectively, reducing downtime and ensuring projects are completed on schedule."
        }
      ],
      // Note: certification content is handled by custom render below
      certification: []
    };

    return (
      <section className="py-16 md:py-24 bg-white" id="gwo-tabs">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white p-6 md:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-6xl mx-auto">

            {/* Tabs Navigation */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-10 pb-4 border-b border-gray-100">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGwoTab(tab.id)}
                  className={`py-4 px-6 rounded-xl font-heading font-bold text-sm md:text-base uppercase tracking-wider transition-all duration-300 flex-1 text-center border-b-4 md:border-b-0 md:border-2 shadow-sm ${activeGwoTab === tab.id
                      ? 'bg-[#0072CE] text-white border-[#005bb5] shadow-lg transform md:-translate-y-1'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:text-[#0072CE]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="animate-fade-in" key={activeGwoTab}>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-secondary mb-8 pb-4 border-b border-gray-100 inline-block">
                {tabs.find(t => t.id === activeGwoTab)?.label}
              </h2>

              {activeGwoTab === 'certification' ? (
                <div className="space-y-12">
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                      <h3 className="text-xl md:text-2xl font-bold text-[#0072CE] mb-6">
                        Aligning with Renewable Energy Goals
                      </h3>
                      <div className="prose prose-lg text-gray-600">
                        <p className="leading-relaxed">
                          As Australia strives towards greater sustainability goals, GWO Certification aligns perfectly with these objectives. By supporting the development of a knowledgeable workforce, the wind energy sector can advance more rapidly, ultimately contributing to the nation’s renewable energy aspirations.
                        </p>
                      </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                      <EmissionsReductionChart />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-10">
                    <h3 className="text-xl md:text-2xl font-bold text-[#0072CE] mb-6">
                      The Role of GWO in Industry Growth
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                      The role of GWO in the growth of the renewable energy industry cannot be overstated. By ensuring that technicians are adequately trained and certified, GWO helps to create a stable and qualified workforce that can support the industry as it expands.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 md:space-y-12">
                  {content[activeGwoTab]?.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0072CE]/10 text-[#0072CE] flex items-center justify-center">
                          <CheckCircle size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle custom GWO sections specifically
  if (section.id === 'gwo_overview') {
    return (
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{section.data.subheading}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">{section.data.heading}</h2>
              <div className="prose prose-lg text-gray-600 mb-8 whitespace-pre-line">
                {section.data.description}
              </div>
            </div>
            {/* Custom Chart Component */}
            <GWOBenefitsChart />
          </div>
        </div>
      </section>
    );
  }

  if (section.id === 'gwo_productivity') {
    return (
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2">
              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{section.data.subheading}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">{section.data.heading}</h2>
              <ul className="space-y-4">
                {section.data.description?.split('\n').map((line, i) => (
                  line.trim() && (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-1" />
                      <span>{line.replace('✓', '').trim()}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
            {/* Custom Bubble Graphic */}
            <WorkforceProductivityGraphic />
          </div>
        </div>
      </section>
    );
  }

  if (section.id === 'gwo_coo_message') {
    return (
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl shrink-0">
              <img
                src={section.data.image}
                alt="COO"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading mb-4 text-accent">{section.data.heading}</h3>
              <p className="text-lg md:text-xl text-gray-200 italic leading-relaxed">
                "{section.data.description}"
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Safety Excellence Section with Blue Gradient
  if (section.id === 'safety_excellence') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#0A3D62]/20 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Blue Gradient Background */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#0A3D62] via-[#1B6CA8] to-[#3DA5F4] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-blue-50 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>

                {section.data.partners && (
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-4">Trusted Partners</p>
                    <div className="flex gap-6 opacity-90">
                      {section.data.partners.map(p => (
                        <span key={p} className="font-heading font-bold text-xl text-white">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Partner Excellence Section (Matches Safety Excellence Style)
  if (section.id === 'partner_excellence') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#0A3D62]/20 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Blue Gradient Background */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#0A3D62] via-[#1B6CA8] to-[#3DA5F4] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-blue-50 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium Next Step CTA Section (Matches Safety Excellence Style)
  if (section.id === 'gwo_next_step') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">

            {/* Image Section - Left (blending naturally) */}
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
              <img
                src={section.data.image}
                alt={section.data.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[#0A3D62]/30 mix-blend-multiply"></div>
            </div>

            {/* Text Content - Right with Premium Blue Gradient Background */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#0A3D62] via-[#1B6CA8] to-[#3DA5F4] p-8 md:p-12 lg:p-16 text-white relative flex flex-col justify-center">
              {/* Decorative subtle pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>

              <div className="relative z-10 animate-fade-in-up">
                {section.data.subheading && (
                  <span className="text-accent font-bold uppercase tracking-widest text-xs mb-3 block">
                    {section.data.subheading}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                  {section.data.heading}
                </h2>
                <div className="prose prose-lg text-blue-50 mb-8 whitespace-pre-line leading-relaxed">
                  {section.data.description}
                </div>

                {section.data.buttonText && (
                  <Link to={section.data.buttonLink || '#'}>
                    <Button
                      className="bg-accent text-secondary hover:bg-white hover:text-primary border-none shadow-xl"
                    >
                      {section.data.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  switch (section.type) {
    case 'hero':
      return (
        <section className="bg-secondary text-white py-20 relative overflow-hidden">
          {section.data.image && (
            <div className="absolute inset-0 z-0 opacity-40">
              <img src={section.data.image} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply"></div>
            </div>
          )}
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl">
              {section.data.subheading && (
                <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">{section.data.subheading}</span>
              )}
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">{section.data.heading}</h1>
              <p className="text-xl text-gray-300 mb-8">{section.data.description}</p>
              {section.data.buttonText && (
                <Link to={section.data.buttonLink || '#'}>
                  <Button size="lg" className="shadow-xl">{section.data.buttonText}</Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {section.data.heading && <h2 className="text-3xl font-heading font-bold text-center mb-12 text-secondary">{section.data.heading}</h2>}
            <div className="grid md:grid-cols-3 gap-8">
              {section.data.items?.map((item, idx) => {
                const Icon = IconMap[item.icon || 'Award'] || Award;
                return (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-secondary">{item.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case 'content':
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className={`w-full ${section.data.image ? 'md:w-1/2' : 'w-full text-center'}`}>
                {section.data.subheading && <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{section.data.subheading}</span>}
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">{section.data.heading}</h2>
                <div className="prose prose-lg text-gray-600 mb-8 whitespace-pre-line">
                  {section.data.description}
                </div>
                {section.data.buttonText && (
                  <Link to={section.data.buttonLink || '#'}>
                    <Button>{section.data.buttonText}</Button>
                  </Link>
                )}
                {/* Partners List if available */}
                {section.data.partners && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trusted Partners</p>
                    <div className="flex gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                      {section.data.partners.map(p => (
                        <span key={p} className="font-heading font-bold text-xl text-gray-300">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {section.data.image && (
                <div className="w-full md:w-1/2">
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img src={section.data.image} alt={section.data.heading} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'team':
      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-heading font-bold mb-12 text-secondary">{section.data.heading}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.data.items?.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                  <div className="h-64 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary">{item.title}</h3>
                    <p className="text-primary font-medium text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
