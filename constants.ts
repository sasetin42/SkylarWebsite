import { Course, CourseCategory, Location, Testimonial, BlogPost } from './types';

export const LOGO_URL = "/skylar-logo.svg";

export const COURSES: Course[] = ([
  {
    id: 'gwo-art-initial',
    title: 'GWO Combined Advanced Rescue Training (ART) Initial',
    category: CourseCategory.GWO,
    shortDescription: 'Discover the essential skills needed for advanced rescue operations in the wind industry.',
    fullDescription: 'Discover the essential skills needed for advanced rescue operations in the wind industry with our comprehensive GWO Combined Advanced Rescue Training Initial. Learn from experienced trainers in realistic scenarios to ensure your readiness for any emergency.',
    price: 1890,
    duration: '3 Days',
    level: 'Available',
    image: 'https://images.unsplash.com/photo-1519802772250-a52a9af0eacb?auto=format&fit=crop&q=80&w=800', 
    upcomingDates: ['Mar 05, 2025', 'Mar 19, 2025'],
    code: 'GWO-ART-I',
    certificationName: 'GWO Advanced Rescue Training (ART) Initial Certificate',
    validityMonths: 24,
    isGwo: true,
    whatYouWillLearn: [
      'Hub, Spinner and Inside Blade Rescue procedures',
      'Nacelle, Tower and Basement Rescue scenarios',
      'Rescue Up / Rescue Down evacuation protocols',
      'Deploying spinal splints and recovery stretchers',
      'Advanced rigging and haulage systems for rescues'
    ],
    entryRequirements: [
      'Must possess a valid GWO BST Working at Heights, Manual Handling, and First Aid certificate',
      'A valid, signed medical statement or certificate declaring fitness for training',
      'Minimum age of 18 years',
      'A valid Unique Student Identifier (USI)'
    ],
    targetAudience: [
      'Wind turbine technicians working on onshore/offshore wind turbines',
      'Emergency response team members in wind energy installations',
      'Safety officers and supervisors overseeing high-risk wind farm work'
    ]
  },
  {
    id: 'gwo-art-refresher',
    title: 'GWO Combined Advanced Rescue Training (ART) Refresher',
    category: CourseCategory.GWO,
    shortDescription: 'Refresh your critical rescue skills with the GWO Combined Advanced Rescue Training (ART) Refresher course.',
    fullDescription: 'Refresh your critical rescue skills with the GWO Combined Advanced Rescue Training (ART) Refresher course, specifically designed for wind industry personnel. This intensive program ensures you remain competent in executing advanced rescues in challenging environments.',
    price: 1890,
    duration: '3 Days',
    level: 'Available',
    image: 'https://images.unsplash.com/photo-1605218427306-63544320f23d?auto=format&fit=crop&q=80&w=800',
    upcomingDates: ['Mar 07, 2025', 'Mar 21, 2025'],
    code: 'GWO-ART-R',
    certificationName: 'GWO Advanced Rescue Training (ART) Refresher Certificate',
    validityMonths: 24,
    isGwo: true,
    whatYouWillLearn: [
      'Refreshed Hub, Spinner and Inside Blade Rescue procedures',
      'Nacelle, Tower and Basement Rescue refresher scenarios',
      'Hands-on rescue drills and rigging exercises',
      'Updated emergency protocols and wind industry best practices'
    ],
    entryRequirements: [
      'Must possess a valid GWO ART Initial certificate or equivalent refresher',
      'A valid, signed medical statement or certificate declaring fitness for training',
      'Minimum age of 18 years'
    ],
    targetAudience: [
      'Experienced wind turbine technicians requiring bi-annual refresher certification',
      'Active members of turbine rescue teams'
    ]
  },
  {
    id: 'gwo-bst-initial',
    title: 'GWO Basic Safety Training (BST) Initial',
    category: CourseCategory.GWO,
    shortDescription: 'Essential Safety Skills for the Wind Industry',
    fullDescription: 'The Global Wind Organisation Basic Safety Training (BST) Initial is a comprehensive training program designed specifically for individuals working in the global wind energy industry. It encompasses a series of modules aimed at providing essential safety knowledge and skills necessary for working safely and effectively in various roles within the wind sector, particularly those involved in wind turbine installation, maintenance, and other related activities.',
    price: 2205,
    duration: '4 Days',
    level: 'Available',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    upcomingDates: ['Mar 03, 2025', 'Mar 17, 2025', 'Mar 31, 2025'],
    code: 'GWO-BST-I',
    certificationName: 'GWO Basic Safety Training (BST) Initial Certificate',
    validityMonths: 24,
    isGwo: true,
    rtoCode: 'RTO 21647',
    deliveryMode: 'Face-to-Face',
    depositAmount: 1500,
    whatYouWillLearn: [
      'Gain foundational knowledge and skills in working safely at heights, including the use of necessary safety equipment and procedures.',
      'Develop proficiency in manual handling techniques to prevent injuries and ensure safety during physical tasks.',
      'Master the basics of fire awareness, learning to identify fire hazards and apply effective firefighting techniques in a wind turbine environment.',
      'Learn critical first aid and CPR procedures to provide immediate care in medical emergencies.',
      'Enhance skills in risk assessment and hazard identification, focusing on the ability to foresee and manage potential dangers in wind turbine operations.',
      'Build effective communication and coordination skills for emergency response and routine safety operations.'
    ],
    entryRequirements: [
      'All course participants shall conform to any GWO prerequisites for the specific standard and modules as well as personal legal obligations.',
      'The course participant shall have created a personal profile in WINDA and have provided their WINDA ID prior to completing the GWO training.',
      'The course participants shall be medically fit, appear well-rested and be capable of fully participating showing no signs of fatigue, substance abuse or sickness.',
      'Be wearing long pants and work boots (all other PPE are provided).'
    ],
    targetAudience: [
      'Individuals seeking to enter or continue working in the wind energy industry, particularly in roles related to turbine installation and maintenance.',
      'Emergency Response Coordinators and Rescue Operations Managers.',
      'Wind Turbine Technicians and Safety Officers for wind energy projects.'
    ],
    accreditedUnits: [
      'RIIWHS204E – Work Safely at Heights',
      'PUASAR022 – Participate in Rescue Operations',
      'HLTWHS005 – Conduct manual tasks safely',
      'HLTAID009 – Perform Cardiopulmonary Resuscitation (CPR)',
      'HLTAID011 – Provide First Aid',
      'UETDRMP010 – Perform First Aid in an ESI environment',
      'CPPFES2005 – Demonstrate First Attack Fire Fighting Equipment',
      'PUAFER008 – Confine Small Emergencies in a Facility',
      'UETDRMP018 – Perform rescue from a live low voltage panel (LVR)'
    ],
    whatToBring: [
      'Long pants and work boots suitable for practical activities',
      'Laptop or tablet is recommended for digital assessments (mobile phones may be used too)',
      'Photo Identification'
    ]
  },
  {
    id: 'gwo-bst-refresher',
    title: 'GWO Basic Safety Training (BST) Refresher',
    category: CourseCategory.GWO,
    shortDescription: 'Keep your wind industry safety skills sharp with Skylar Education’s GWO BST Refresher course.',
    fullDescription: 'Keep your wind industry safety skills sharp with Skylar Education’s GWO BST Refresher course. Update your certification and stay compliant with industry standards.',
    price: 1690,
    duration: '3 Days',
    level: 'Available',
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800',
    upcomingDates: ['Feb 26, 2025', 'Mar 12, 2025'],
    code: 'GWO-BST-R',
    certificationName: 'GWO Basic Safety Training (BST) Refresher Certificate',
    validityMonths: 24,
    isGwo: true,
    whatYouWillLearn: [
      'Updated First Aid procedures and remote rescue techniques',
      'Revised Working at Heights self-evacuation protocols',
      'Refreshed Fire Awareness and tactical containment drill',
      'Manual Handling compliance review and injury prevention'
    ],
    entryRequirements: [
      'Must hold a valid GWO BST Initial or previous Refresher certificate',
      'A valid, signed medical statement or certificate declaring fitness for training'
    ],
    targetAudience: [
      'Active wind turbine personnel needing to renew safety competencies'
    ]
  },
  {
    id: 'gwo-btt',
    title: 'GWO Basic Technical Training (BTT)',
    category: CourseCategory.GWO,
    shortDescription: 'Comprehensive technical training program for wind energy industry.',
    fullDescription: 'The Global Wind Organisation Basic Technical Training (BTT).',
    price: 3050,
    duration: 'TBA',
    level: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    upcomingDates: [],
    code: 'GWO-BTT',
    certificationName: 'GWO Basic Technical Training Certificate',
    isGwo: true
  },
  {
    id: 'c-confined-spaces',
    title: 'Enter and Work in Confined Spaces',
    category: CourseCategory.CONSTRUCTION,
    shortDescription: 'Skills and knowledge required to safely enter and work in confined spaces.',
    fullDescription: 'This unit of competency covers the skills and knowledge required to safely enter and work in confined spaces.',
    price: 0,
    duration: 'TBA',
    level: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1617103857313-2423927515b8?auto=format&fit=crop&q=80&w=800', 
    upcomingDates: []
  },
  {
    id: 'c-work-at-heights',
    title: 'Work Safely at Heights',
    category: CourseCategory.CONSTRUCTION,
    shortDescription: 'Work Safely at Heights course covering skills to work safely at heights.',
    fullDescription: 'This course covers the skills and knowledge required to work safely at heights in various work environments.',
    price: 0,
    duration: 'TBA',
    level: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    upcomingDates: []
  },
  {
    id: 's-fire-extinguisher',
    title: 'Fire Extinguisher Training',
    category: CourseCategory.SAFETY,
    shortDescription: 'Inspect, test, and maintain fire extinguishers and fire blankets.',
    fullDescription: 'Provides participants with the skills and knowledge required to inspect, test, and maintain fire extinguishers.',
    price: 0,
    duration: 'TBA',
    level: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=800',
    upcomingDates: []
  },
  {
    id: 'fa-provide-first-aid',
    title: 'Provide First Aid',
    category: CourseCategory.FIRST_AID,
    shortDescription: 'Equips participants with knowledge and skills for first aid response.',
    fullDescription: 'Designed to equip participants with the knowledge and skills required to provide a first aid response to a casualty.',
    price: 0,
    duration: 'TBA',
    level: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1552083855-45233e8cd6e6?auto=format&fit=crop&q=80&w=800',
    upcomingDates: []
  }
] as Course[]).map((course) => ({
  ...course,
  courseBenefits: course.courseBenefits || `
    <div class="html-alert alert-info">
      <strong>Accelerated Path:</strong> This certification unlocks top-tier opportunities in industrial safety.
    </div>
    <ul>
      <li><strong>Industry Recognition:</strong> Widely recognized by global operators.</li>
      <li><strong>Hands-on Practice:</strong> Real-world scenarios in state-of-the-art simulation facilities.</li>
      <li><strong>Qualified Trainers:</strong> Guided by certified rescue veterans.</li>
    </ul>
  `,
  isThisCourseForMe: course.isThisCourseForMe || `
    <p>This course is specifically designed for:</p>
    <ul>
      <li>Active wind turbine technicians.</li>
      <li>Safety supervisors and field risk coordinators.</li>
      <li>Industrial rescue response personnel looking to expand their skill portfolio.</li>
    </ul>
  `,
  careerOpportunities: course.careerOpportunities || `
    <p>Graduates find placement with leading wind operators and industrial height safety teams. Careers include:</p>
    <ul>
      <li>Advanced Wind Safety Coordinator</li>
      <li>Rescue Team Lead</li>
      <li>HSE Compliance Officer</li>
    </ul>
  `,
  durationOfTraining: course.durationOfTraining || `
    <p><strong>Training duration:</strong> ${course.duration || 'Flexible hours'} face-to-face intensive theory and practical rescue drills.</p>
  `,
  whereDelivered: course.whereDelivered || `
    <p>Delivered at our premium simulated wind farm and heights facility, offering real-world environment training.</p>
  `,
  accreditedUnitsRich: course.accreditedUnitsRich || (course.accreditedUnits && course.accreditedUnits.length > 0
    ? `<ul>${course.accreditedUnits.map(unit => `<li>${unit}</li>`).join('')}</ul>`
    : `<ul><li>Standard GWO Safety Modules</li><li>Accredited Industrial Heights Safety Protocols</li></ul>`),
  entryRequirementsRich: course.entryRequirementsRich || (course.entryRequirements && course.entryRequirements.length > 0
    ? `<ul>${course.entryRequirements.map(req => `<li>${req}</li>`).join('')}</ul>`
    : `<p>Must be medically fit and over 18 years of age.</p>`),
  lln: course.lln || `
    <p>Participants must have basic Language, Literacy, and Numeracy skills to interpret technical wind-safety instructions and communicate with team members.</p>
  `,
  assessment: course.assessment || `
    <p>Assessment is conducted via practical rescue simulations, height safety navigation exams, and a final written theory questionnaire.</p>
  `,
  certificationRecord: course.certificationRecord || `
    <p>Upon completion, record is registered directly onto WINDA database. Hardcopy certificate is issued within 5-7 business days.</p>
  `,
  validityPeriod: course.validityPeriod || `
    <p>This certificate is valid for <strong>${course.validityMonths || 24} months</strong>. Refresher training is required prior to expiration.</p>
  `,
  whatToBringRich: course.whatToBringRich || (course.whatToBring && course.whatToBring.length > 0
    ? `<ul>${course.whatToBring.map(item => `<li>${item}</li>`).join('')}</ul>`
    : `<ul><li>Steel-capped safety boots</li><li>Government-issued photo identification</li><li>Comfortable workwear suitable for heights harness work</li></ul>`),
  costOfTraining: course.costOfTraining || `
    <p>Total course cost: <strong>$${course.price.toLocaleString()}</strong></p>
    ${course.depositAmount ? `<p>Requires a deposit of <strong>$${course.depositAmount.toLocaleString()}</strong> to secure seat allocation.</p>` : ''}
  `,
  paymentOptions: course.paymentOptions || `
    <p>Flexible payment methods include:</p>
    <ul>
      <li>Direct Bank Transfer (EFT)</li>
      <li>Credit Card (Visa, Mastercard, AMEX)</li>
      <li>Corporate Purchase Orders and Invoice Arrangements</li>
    </ul>
  `
}));

export const LOCATIONS: Location[] = [
  {
    id: 'ph-facility',
    name: 'Skylar Education Asia - Pampanga Facility',
    address: 'Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, Pampanga',
    phone: '+63 45 123 4567',
    email: 'info@skylareducation.asia',
    image: '/wind-turbine-worker.png',
    coordinates: { lat: 15.14, lng: 120.59 },
    state: 'Pampanga'
  },
  {
    id: 'manila-facility',
    name: 'Skylar Education Asia - Manila Safety Center',
    address: 'Pier 18, Port Area, Tondo, Manila, Metro Manila, 1012, Philippines',
    phone: '+63 2 8234 5678',
    email: 'manila@skylareducation.asia',
    image: '/manila-safety-center.png',
    coordinates: { lat: 14.62, lng: 120.96 },
    state: 'Manila'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'James Wilson',
    role: 'Wind Turbine Technician',
    content: 'The GWO training at Skylar was exceptional. The simulators are exactly like what we use offshore.',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 't2',
    name: 'Sarah Chen',
    role: 'Safety Officer',
    content: 'Excellent facilities and knowledgeable trainers. Highly recommended for industrial safety training.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 't3',
    name: 'Michael Rodriguez',
    role: 'Site Supervisor',
    content: 'The hands-on approach really helped our team understand the critical safety procedures effectively.',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 't4',
    name: 'Emma Thompson',
    role: 'Renewable Energy Engineer',
    content: 'A world-class training center. The instruction quality is on par with the best international standards.',
    avatar: 'https://i.pravatar.cc/150?img=9'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Growing Demand for GWO-Certified Technicians',
    excerpt: 'Discover why GWO certification is becoming a prerequisite for technicians in the rapidly growing wind energy market.',
    date: 'Feb 10, 2026',
    category: 'CAREERS',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'Top Mistakes to Avoid in Wind Turbine Safety and Maintenance',
    excerpt: 'Learn about common safety pitfalls in wind turbine maintenance and how technicians can avoid high-risk incidents.',
    date: 'Jan 15, 2026',
    category: 'UPDATES',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: 'Work at Height Hazards and Control Measures for Safety Compliance',
    excerpt: 'Essential insights into managing working at height hazards to ensure safety and regulatory compliance on industrial sites.',
    date: 'Dec 05, 2025',
    category: 'UPDATES',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b4',
    title: 'Dropped Object Prevention: Protecting Lives and Infrastructure',
    excerpt: 'Understanding the critical importance of dropped object prevention protocols in high-altitude turbine work zones.',
    date: 'Nov 18, 2025',
    category: 'UPDATES',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800'
  }
];