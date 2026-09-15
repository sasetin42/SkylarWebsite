import { Course, Category, Location, Testimonial, BlogPost } from './types';

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat_gwo', name: 'Global Wind Organisation', description: 'GWO certified training courses.' },
  { id: 'cat_construction', name: 'Industrial Safety & High Risk Work', description: 'Certified industrial safety and high risk work courses.' },
  { id: 'cat_rescue', name: 'Specialised Rescue', description: 'Advanced rescue techniques.' },
  { id: 'cat_safety', name: 'Workplace Safety & Emergency Response', description: 'Safety and emergency response protocols.' },
  { id: 'cat_first_aid', name: 'First Aid', description: 'First aid and CPR certifications.' },
  { id: 'cat_worksafe', name: 'WorkSafe-Approved Courses', description: 'WorkSafe approved safety training.' },
  { id: 'cat_electrical', name: 'Electrical & Utilities', description: 'Electrical safety and utilities training.' }
];

export const LOGO_URL = "/skylar-logo.svg";

export const COURSES: Course[] = ([
  {
    id: 'gwo-art-initial',
    title: 'GWO Combined Advanced Rescue Training (ART) Initial',
    category: 'Global Wind Organisation',
    shortDescription: 'Discover the essential skills needed for advanced rescue operations in the wind industry.',
    fullDescription: 'Discover the essential skills needed for advanced rescue operations in the wind industry with our comprehensive GWO Combined Advanced Rescue Training Initial. Learn from certified instructors in realistic scenarios to ensure your readiness for any emergency.',
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
      'A valid WINDA ID registered with GWO'
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
    category: 'Global Wind Organisation',
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
      'Active wind turbine technicians requiring bi-annual refresher certification',
      'Active members of turbine rescue teams'
    ]
  },
  {
    id: 'gwo-bst-initial',
    title: 'GWO Basic Safety Training (BST) Initial',
    category: 'Global Wind Organisation',
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
    whatToBring: [
      'Long pants and work boots suitable for practical activities',
      'Laptop or tablet is recommended for digital assessments (mobile phones may be used too)',
      'Photo Identification'
    ]
  },
  {
    id: 'gwo-bst-refresher',
    title: 'GWO Basic Safety Training (BST) Refresher',
    category: 'Global Wind Organisation',
    shortDescription: 'Keep your wind industry safety skills sharp with SKYLAR EDUCATION ASIA’s GWO BST Refresher course.',
    fullDescription: 'Keep your wind industry safety skills sharp with SKYLAR EDUCATION ASIA’s GWO BST Refresher course. Update your certification and stay compliant with industry standards.',
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
    category: 'Global Wind Organisation',
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
    category: 'Construction & High Risk Work',
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
    category: 'Construction & High Risk Work',
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
    category: 'Workplace Safety & Emergency Response',
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
    category: 'First Aid',
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
  gwoModulesRich: course.gwoModulesRich || (course.gwoModules && course.gwoModules.length > 0
    ? `<ul>${course.gwoModules.map(unit => `<li>${unit}</li>`).join('')}</ul>`
    : `<ul><li>Standard GWO Safety Modules</li><li>Certified Industrial Heights Safety Protocols</li></ul>`),
  entryRequirementsRich: course.entryRequirementsRich || (course.entryRequirements && course.entryRequirements.length > 0
    ? `<ul>${course.entryRequirements.map(req => `<li>${req}</li>`).join('')}</ul>`
    : `<p>Must be medically fit and over 18 years of age.</p>`),
  languageRequirements: course.languageRequirements || `
    <p>Participants must have basic English language and communication skills to interpret technical wind-safety instructions and communicate with team members.</p>
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
    name: 'SKYLAR EDUCATION ASIA - Angeles City Training Centre',
    address: 'Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, 2009 Pampanga, Philippines',
    phone: '+63 968 382 4294 / +63 915 902 9406',
    email: 'bon@skylarasia.com / junrey@skylarasia.com',
    image: '/angeles-training-centre.jpg',
    coordinates: { lat: 15.14, lng: 120.59 },
    state: 'Pampanga'
  }
];

export const GOOGLE_REVIEWS_STATS = {
  rating: 4.9,
  totalReviews: 154,
  placeName: 'Skylar Education',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Skylar+Education'
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'g-rev-1',
    name: 'Andrew Mykytowych',
    role: 'Verified Delegate',
    content: 'Brenton (WAH and Height Rescue) and Chris (First Aid, Manual Handling, LV Rescue and Fire) were excellent trainers, knowledgeable and approachable for numerous questions. The SKYLAR training facility is well set out, fully equipped and has comfortable training rooms. Thanks once again for another comprehensive GWO Training session.',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXV6fOEs2U-M_QujJDfd6KCT2KRo8v7OchE2yq8yIkRNm-28gTp=w120-h120-c-rp-mo-ba2-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-12-04',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-2',
    name: 'Stephen Winter',
    role: 'Verified Delegate',
    content: 'Great facility and staff for doing your GWO training.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLDQA3wNChtCSl4v_O2GJyl6vO48HVlOcTl-smhpJKHsKsXoA=w120-h120-c-rp-mo-ba2-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-11-30',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-3',
    name: 'mikah k',
    role: 'Verified Delegate',
    content: 'Awesome training by Bon, very knowledgeable and easily transferable skills into the wind industry, highly recommended 👍',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW-Dn9KmGzBtBsdoUDrPVsmtnkQpb41THGRjATHOtm923S0rl4=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-09-11',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-4',
    name: 'Alex Cook',
    role: 'Verified Delegate',
    content: 'Great crew at Skylar, always very informative and engaging. Bon was a great teacher, very well informed and easy to get along with.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocL9tSSxn1OhyZrW3JWfVtmcWkdGN86ESZfHBeOgSjED5NGJHA=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-07-24',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-5',
    name: 'Darcy Owen',
    role: 'Verified Delegate',
    content: 'Really extensive course can’t recommend enough. Bon was awesome.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIH3-vdVoLb8L64OUTI_EIPSnxjA8JcSur1ufeRCi8rLsLl=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-09-11',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-6',
    name: 'Pee Jay Valle',
    role: 'Verified Delegate',
    content: 'Nice facilities and amazing training. Also Bon is a nice instructor, you learn more about the strategy, technique, and safety protocols.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocI4QIFXWdHGe8EItvfT3FNwc_NXTi4qSv0F5jaqB6rrgQHy1A=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-09-11',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-7',
    name: 'Tong Yak',
    role: 'Verified Delegate',
    content: 'Great training for those entering the wind industry. Bon was a great trainer.',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWnsKU7wPK1iVrcfsEwL2jUiTl4Oqtcijxy7Ll8ytSfHNvvKh2w=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-09-11',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-8',
    name: 'Harmon Rundle',
    role: 'Verified Delegate',
    content: 'Great experience training with the Skylar team! Facilities are modern and practical.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJNLqwHEviPmvXctM2qpzNO3_rsphcV3yKANze5Gt4xPt5tzA=w120-h120-c-rp-mo-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-10-06',
    locationName: 'Skylar Education'
  },
  {
    id: 'g-rev-9',
    name: 'hayden smith',
    role: 'Verified Delegate',
    content: 'Great trainers and training facility. Hands-on modules made all the difference.',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKCzvBv7-uLSgs4Yo6ejK7DMSGQ-y5bJNOlHFlm3GKIvlbN2Q=w120-h120-c-rp-mo-ba2-br100',
    rating: 5,
    source: 'Google',
    status: 'Approved',
    isFeatured: true,
    date: '2025-09-11',
    locationName: 'Skylar Education'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'gwo-demand-technicians',
    title: 'The Growing Demand for GWO-Certified Technicians',
    excerpt: 'Discover why GWO certification is becoming a prerequisite for technicians in the rapidly growing wind energy market across Asia and globally.',
    date: 'Feb 10, 2026',
    category: 'CAREERS',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
    readTime: '6 min read',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead GWO Training Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Over 8 years of wind safety instruction experience with international certification in GWO BST, ART, and Blade Repair.'
    },
    tags: ['GWO Certification', 'Wind Energy', 'Renewable Careers', 'Workforce Trends', 'WINDA ID'],
    keyTakeaways: [
      'Global wind capacity is projected to surge by over 680 GW by 2030, creating a worldwide deficit of certified wind turbine specialists.',
      'Global Wind Organisation (GWO) certification is now an unconditional standard requirement for 92% of commercial wind farm projects in Southeast Asia.',
      'Technicians holding certified multi-module credentials (BST + BTT + ART) command an estimated 35% to 45% wage premium with rapid career mobility.',
      'All GWO qualifications are registered directly to the international WINDA database, granting delegates portable career recognition in over 50 countries.'
    ],
    stats: [
      { label: '570,000+', value: 'New Technicians', sublabel: 'Needed globally by 2030 (GWEC)' },
      { label: '+43%', value: 'Salary Premium', sublabel: 'For multi-module certified specialists' },
      { label: '50+ Countries', value: 'Global Recognition', sublabel: 'Via direct GWO WINDA portal validation' }
    ],
    charts: [
      {
        title: 'Global Wind Capacity Growth vs Technician Demand (2022-2030)',
        subtitle: 'Source: Global Wind Energy Council (GWEC) Global Workforce Assessment',
        type: 'bar',
        data: [
          { label: '2022', value: 837, formattedValue: '837 GW (340k Techs)', color: '#3B82F6', description: 'Base baseline capacity' },
          { label: '2024', value: 1020, formattedValue: '1,020 GW (410k Techs)', color: '#2563EB', description: 'Accelerated offshore rollouts' },
          { label: '2026', value: 1280, formattedValue: '1,280 GW (515k Techs)', color: '#1D4ED8', description: 'Current rapid expansion phase' },
          { label: '2028 (Proj.)', value: 1540, formattedValue: '1,540 GW (620k Techs)', color: '#F59E0B', description: 'Major APAC offshore projects online' },
          { label: '2030 (Proj.)', value: 1850, formattedValue: '1,850 GW (740k Techs)', color: '#EAB308', description: 'Global net-zero interim benchmark' }
        ]
      },
      {
        title: 'APAC Regional Certified Technician Hiring Growth Rate',
        subtitle: 'Year-over-year demand increase across key Asia-Pacific markets',
        type: 'comparison',
        data: [
          { label: 'Philippines', value: 38, formattedValue: '+38% YoY', color: '#10B981', description: 'Fastest growing wind market in ASEAN' },
          { label: 'Vietnam', value: 32, formattedValue: '+32% YoY', color: '#06B6D4', description: 'Rapid near-shore & onshore expansion' },
          { label: 'Taiwan', value: 29, formattedValue: '+29% YoY', color: '#3B82F6', description: 'Established major offshore wind hub' },
          { label: 'Japan', value: 24, formattedValue: '+24% YoY', color: '#8B5CF6', description: 'Expanding deep-water floating wind farms' }
        ]
      }
    ],
    contentSections: [
      {
        heading: '1. The Global Wind Energy Surge and Workforce Deficit',
        paragraphs: [
          'The renewable energy landscape is experiencing an unprecedented transformation. As international commitments accelerate toward 2030 climate milestones, wind energy developers across Asia and the Pacific are deploying turbines at a historic pace.',
          'However, the rapid expansion of wind turbine installations has encountered a severe bottleneck: a shortage of properly trained, certified high-risk technicians. According to the Global Wind Energy Council (GWEC), over 570,000 additional wind technicians will be required globally within the next five years to construct, operate, and maintain expanding onshore and offshore fleets.'
        ],
        callout: {
          type: 'stat',
          title: 'Critical Workforce Metric',
          text: 'In the ASEAN region alone, wind turbine technician job openings are outpacing qualified candidate availability by a ratio of nearly 3 to 1.'
        }
      },
      {
        heading: '2. Why Global Wind Organisation (GWO) Standards Are Non-Negotiable',
        paragraphs: [
          'In the past, safety requirements in the energy sector varied from company to company, creating confusion and inconsistent safety outcomes. The Global Wind Organisation (GWO)—founded by leading turbine manufacturers like Vestas, Siemens Gamesa, and Ørsted—solved this by creating universally recognized safety training standards.',
          'Today, turbine manufacturers and project operators enforce a strict "No GWO, No Site Access" policy. Without a valid WINDA ID proving completion of GWO Basic Safety Training (BST), technicians cannot set foot on commercial turbine platforms.'
        ],
        listItems: [
          'Universal Safety Recognition: Avoid duplicate training when moving between different wind farm operators.',
          'WINDA ID Verification: Transparent online database allowing employers worldwide to verify certificates instantaneously.',
          'High Practical Competency: Emphasis on realistic scenario-based training inside purpose-built nacelles and climb towers.'
        ]
      },
      {
        heading: '3. Essential Certification Pathways: BST, BTT & ART',
        paragraphs: [
          'Entering the wind industry requires a structured certification pathway tailored to your technical focus and career goals:',
          'The foundational milestone is GWO Basic Safety Training (BST), covering Working at Heights, First Aid, Manual Handling, and Fire Awareness. For technicians intending to perform mechanical, electrical, and hydraulic servicing, GWO Basic Technical Training (BTT) is essential.',
          'For seasoned technicians looking to qualify as rescue leads and emergency team responders, GWO Advanced Rescue Training (ART) provides the critical skills needed to rescue incapacitated colleagues from complex enclosed nacelle and hub spaces.'
        ],
        callout: {
          type: 'tip',
          title: 'Career Fast-Track Tip',
          text: 'Completing the combined BST + BTT package allows engineers and technical graduates to transition directly into entry-level turbine service roles with zero delays.'
        }
      },
      {
        heading: '4. Career Trajectory & Global Mobility for Filipino Technicians',
        paragraphs: [
          'Filipino electrical engineers, mechanical technicians, and industrial safety professionals are in exceptionally high demand globally due to their strong technical foundation and operational adaptability.',
          'SKYLAR EDUCATION ASIA provides certified training in Angeles City, Pampanga, allowing local professionals to achieve world-class GWO credentials right in the Philippines and qualify for lucrative domestic and overseas wind projects.'
        ]
      }
    ],
    relatedCourseIds: ['gwo-bst', 'gwo-btt', 'gwo-art']
  },
  {
    id: 'b2',
    slug: 'wind-turbine-safety-mistakes',
    title: 'Top Mistakes to Avoid in Wind Turbine Safety and Maintenance',
    excerpt: 'Learn about common safety pitfalls in wind turbine maintenance and how technicians can avoid high-risk incidents through proactive protocols.',
    date: 'Jan 15, 2026',
    category: 'SAFETY & OPERATIONS',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200',
    readTime: '7 min read',
    author: {
      name: 'Mike Ross',
      role: 'Lead High-Risk & Rescue Instructor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      bio: '10+ years in industrial rope rescue, turbine maintenance protocols, and confined space safety management.'
    },
    tags: ['Turbine Safety', 'LOTO Protocol', 'Maintenance Best Practices', 'Hazard Control', 'Risk Mitigation'],
    keyTakeaways: [
      'Over 65% of recorded maintenance safety incidents stem from procedural shortcuts and failure to verify zero energy state.',
      'Micro-climate gusts at nacelle height can exceed ground wind speeds by up to 45%, requiring continuous anemometer monitoring.',
      '100% tie-off compliance and dual lanyard discipline eliminate the risk of accidental detachment during climb transfers.',
      'A structured pre-climb 7-point check prevents equipment failure before technicians ever leave the turbine base.'
    ],
    stats: [
      { label: '68%', value: 'Preventable Incidents', sublabel: 'Linked to procedural shortcuts' },
      { label: '15 min', value: 'Golden Window', sublabel: 'For critical suspension trauma intervention' },
      { label: '100%', value: 'Zero Energy Audit', sublabel: 'Required before touching mechanical/electrical systems' }
    ],
    charts: [
      {
        title: 'Primary Causes of Wind Turbine Maintenance Incidents',
        subtitle: 'Analysis of global safety audit reports in renewable power generation',
        type: 'bar',
        data: [
          { label: 'Procedural Shortcuts', value: 34, formattedValue: '34% of cases', color: '#EF4444', description: 'Skipping steps under time pressure' },
          { label: 'Inadequate LOTO', value: 26, formattedValue: '26% of cases', color: '#F59E0B', description: 'Residual mechanical/hydraulic energy' },
          { label: 'Improper Anchor / PPE', value: 22, formattedValue: '22% of cases', color: '#3B82F6', description: 'Incorrect harness adjustment or anchor point' },
          { label: 'Weather / Gust Factor', value: 18, formattedValue: '18% of cases', color: '#10B981', description: 'Sudden high winds exceeding operating limits' }
        ]
      }
    ],
    contentSections: [
      {
        heading: '1. Inadequate Lockout/Tagout (LOTO) and Stored Energy Isolation',
        paragraphs: [
          'Working inside a modern multi-megawatt wind turbine nacelle involves managing massive mechanical, electrical, and hydraulic forces. One of the most catastrophic mistakes in turbine maintenance is assuming a system is de-energized without performing a formal zero-energy verification.',
          'Technicians must isolate all electrical breakers, lock rotor locks mechanically, bleed hydraulic accumulator pressure, and secure individual safety padlocks. Never rely on automated or software-level interlocks alone.'
        ],
        callout: {
          type: 'warning',
          title: 'Critical Safety Directive',
          text: 'Always test before touch. Verify with an approved, calibrated voltage detector that zero electrical potential exists across all conductors before commencing work.'
        }
      },
      {
        heading: '2. Misjudging Micro-Climate & Nacelle Wind Gust Dynamics',
        paragraphs: [
          'Ground-level conditions can be deceptive. A calm 12 km/h breeze at ground level can translate into aggressive 40+ km/h turbulent gusts at hub heights exceeding 100 meters.',
          'Opening roof hatches, performing hub entries, or conducting external blade inspections during unpredicted wind shifts creates severe impact and entrapment hazards. Real-time telemetry monitoring and strict wind speed cut-off thresholds are essential.'
        ]
      },
      {
        heading: '3. Anchor Point Selection & 100% Tie-Off Violations',
        paragraphs: [
          'Transitioning between vertical ladder climb assists, fall arrest rails, and nacelle work platforms is a high-risk transition zone. The most dangerous seconds occur when a technician unclips one lanyard before securing the second.',
          'Technicians must strictly maintain 100% tie-off using dual-leg twin lanyards or guided type fall arresters. Connect only to certified anchor points rated to at least 15 kN—never attach to electrical conduits, cable trays, or unrated piping.'
        ]
      },
      {
        heading: '4. The 7-Point Pre-Climb Safety Protocol',
        paragraphs: [
          'Before ascending the internal tower ladder, every team must complete and cross-verify the 7-Point Pre-Climb Checklist:'
        ],
        listItems: [
          '1. Harness Inspection: Inspect webbing, stitching, D-rings, and adjust leg and chest straps for snug fit.',
          '2. Fall Arrester Check: Verify smooth functioning and positive locking of the guided fall arrest slider.',
          '3. Communication Test: Confirm multi-channel two-way radio and emergency mobile contact with ground control.',
          '4. Environmental Audit: Verify wind speed, lightning forecast, and ambient tower temperature parameters.',
          '5. Rescue Kit Readiness: Verify presence and seal integrity of the emergency descender rescue kit.',
          '6. Tool Security: Ensure all hand tools are tethered with certified tool lanyards.',
          '7. Buddy Cross-Check: Visually inspect your partner’s harness connections and helmet chin strap.'
        ]
      }
    ],
    relatedCourseIds: ['gwo-bst', 'gwo-art']
  },
  {
    id: 'b3',
    slug: 'work-at-height-hazards-controls',
    title: 'Work at Height Hazards and Control Measures for Safety Compliance',
    excerpt: 'Essential insights into managing working at height hazards to ensure safety and regulatory compliance on industrial and wind energy sites.',
    date: 'Dec 05, 2025',
    category: 'SAFETY COMPLIANCE',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200',
    readTime: '8 min read',
    author: {
      name: 'David Vance',
      role: 'Renewable Energy & High-Altitude Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: '7+ years training industrial workers across high-risk construction, rope access, and wind turbine blade operations.'
    },
    tags: ['Working at Height', 'Fall Protection', 'Harness Safety', 'Suspension Trauma', 'OSHA & GWO'],
    keyTakeaways: [
      'Falls from height remain the leading cause of severe injury in heavy construction and industrial maintenance.',
      'The Hierarchy of Fall Protection requires prioritizing Elimination and Passive Prevention before relying on Personal Fall Arrest Systems.',
      'Total Fall Clearance Distance must account for lanyard length, deceleration distance, harness stretch, worker height, and safety margin.',
      'Suspension trauma can become life-threatening in as little as 10 to 15 minutes; prompt casualty rescue capability is legally mandatory.'
    ],
    stats: [
      { label: '15 kN', value: 'Anchor Strength', sublabel: 'Minimum certified rating per person' },
      { label: '4.5 m+', value: 'Clearance Envelope', sublabel: 'Required for standard shock-absorbing lanyards' },
      { label: '99.4%', value: 'Safety Efficacy', sublabel: 'When Hierarchy of Controls is strictly enforced' }
    ],
    charts: [
      {
        title: 'Hierarchy of Height Safety Controls Effectiveness Index',
        subtitle: 'Risk elimination index comparing passive vs active fall protection systems',
        type: 'bar',
        data: [
          { label: '1. Elimination', value: 100, formattedValue: '100% Risk Removed', color: '#10B981', description: 'Design work to be executed at ground level' },
          { label: '2. Passive Fall Prevention', value: 90, formattedValue: '90% Protection', color: '#06B6D4', description: 'Guardrails, solid platforms, scaffolds' },
          { label: '3. Fall Restraint System', value: 80, formattedValue: '80% Protection', color: '#3B82F6', description: 'Restricts user from physically reaching fall edge' },
          { label: '4. Personal Fall Arrest', value: 65, formattedValue: '65% Protection', color: '#F59E0B', description: 'Arrests fall in progress (requires rescue plan)' }
        ]
      }
    ],
    contentSections: [
      {
        heading: '1. Understanding the Hierarchy of Height Safety Controls',
        paragraphs: [
          'Working at height is inherently dangerous, but catastrophic outcomes are entirely preventable when structured hazard control principles are followed.',
          'Before issuing personal protective equipment (PPE), safety managers must apply the Hierarchy of Fall Protection. Always ask first: Can this work be performed from the ground? If not, can collective guardrails or elevated work platforms be used before resorting to individual fall arrest gear?'
        ],
        callout: {
          type: 'tip',
          title: 'Hierarchy Priority Rule',
          text: 'Fall arrest should always be your last line of defense—never your first choice. Preventing the fall from occurring is exponentially safer than stopping a fall mid-air.'
        }
      },
      {
        heading: '2. Calculating Fall Clearance Distance & Deceleration Dynamics',
        paragraphs: [
          'A common misconception is that wearing a harness and lanyard guarantees safety at any height. In reality, shock-absorbing lanyards require substantial vertical clearance to deploy safely.',
          'To calculate Total Fall Clearance Distance (TFCD), you must sum: Lanyard Length (typically 1.8m to 2.0m) + Energy Absorber Deployment (up to 1.75m) + Harness Stretch and D-Ring Slide (approx. 0.5m) + Worker Height to D-ring (1.5m) + Safety Margin (1.0m). This means a standard lanyard often requires at least 6.0 to 6.75 meters of clear space below the anchor point!'
        ]
      },
      {
        heading: '3. Harness Suspension Trauma: The Hidden Lethal Risk',
        paragraphs: [
          'When a worker falls and is arrested in mid-air, the danger is far from over. Being suspended motionless in an upright harness causes harness suspension trauma (orthostatic intolerance). Gravity pools venous blood in the lower legs, starving the brain and heart of oxygen within minutes.',
          'Suspension relief straps (stirrups) must be fitted to all safety harnesses to allow suspended workers to step up, relieving pressure on femoral arteries and activating leg muscle pumps while waiting for rescue.'
        ]
      },
      {
        heading: '4. Establishing a Rapid Site-Specific Emergency Rescue Plan',
        paragraphs: [
          'Calling public emergency services (e.g. 911) is insufficient as a standalone height rescue plan—response times are too slow for suspended casualties. Every job site must have pre-rigged rescue descent equipment and certified GWO ART rescue personnel on-site ready to execute rescue within 10 minutes.'
        ]
      }
    ],
    relatedCourseIds: ['gwo-bst', 'gwo-art']
  },
  {
    id: 'b4',
    slug: 'dropped-object-prevention-protocols',
    title: 'Dropped Object Prevention: Protecting Lives and Infrastructure',
    excerpt: 'Understanding the critical importance of dropped object prevention protocols (DROPS) in high-altitude turbine work zones and industrial construction.',
    date: 'Nov 18, 2025',
    category: 'SAFETY & OPERATIONS',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
    readTime: '6 min read',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead GWO Training Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Specialist in dropped object risk mitigation, tool lanyard engineering, and high-altitude turbine safety protocols.'
    },
    tags: ['Dropped Objects', 'DROPS Standard', 'Tool Tethering', 'Exclusion Zones', 'Turbine Safety'],
    keyTakeaways: [
      'A small 2 kg wrench dropped from a 60-meter turbine hub impacts with over 1,170 Joules of kinetic energy—exceeding the protective threshold of standard hard hats.',
      'The DROPS (Dropped Object Prevention Scheme) standard establishes reliable primary and secondary tool retention requirements.',
      'Exclusion zone boundaries below high-altitude work areas must be dynamic, taking wind drift and deflection trajectories into account.',
      '100% positive tool inventory logging before and after every climb ensures no equipment is left behind in vibrating machinery spaces.'
    ],
    stats: [
      { label: '588 Joules', value: 'Lethal Impact', sublabel: 'From just 1.2 kg dropped from 50 meters' },
      { label: '100%', value: 'Tool Tethering', sublabel: 'Mandatory on all elevated turbine platforms' },
      { label: '35 m', value: 'Exclusion Radius', sublabel: 'Base safety perimeter below active work zones' }
    ],
    charts: [
      {
        title: 'Dropped Object Kinetic Impact Energy vs Fall Height (1.5kg Tool)',
        subtitle: 'Demonstrating how impact force escalates dangerously with altitude (Joules of Energy)',
        type: 'bar',
        data: [
          { label: '10m Drop', value: 147, formattedValue: '147 Joules', color: '#10B981', description: 'Severe injury potential' },
          { label: '30m Drop', value: 441, formattedValue: '441 Joules', color: '#F59E0B', description: 'Hard hat penetration risk' },
          { label: '60m Drop', value: 882, formattedValue: '882 Joules', color: '#EF4444', description: 'Lethal force threshold' },
          { label: '100m Drop', value: 1470, formattedValue: '1,470 Joules', color: '#991B1B', description: 'Catastrophic infrastructure impact' }
        ]
      }
    ],
    contentSections: [
      {
        heading: '1. The Physics of Dropped Objects: Why Small Tools Turn Deadly',
        paragraphs: [
          'On a wind turbine or industrial lattice tower, altitude transforms everyday hand tools into deadly ballistic projectiles.',
          'Consider a standard 1.5 kg steel wrench. Dropped from a nacelle platform at 80 meters, gravitational acceleration causes the wrench to reach a terminal velocity exceeding 130 km/h in less than 4 seconds, striking the ground or personnel below with over 1,100 Joules of kinetic force. Standard hard hats are typically rated for impact energies under 50 Joules—meaning protective equipment cannot compensate for a high-altitude dropped object.'
        ],
        callout: {
          type: 'warning',
          title: 'Physics Reality Check',
          text: 'Even a lightweight item like a tape measure or bolt dropped from 60 meters can penetrate heavy industrial safety helmets.'
        }
      },
      {
        heading: '2. Primary vs Secondary Tool Retention Systems (DROPS Standard)',
        paragraphs: [
          'Under the international DROPS (Dropped Object Prevention Scheme) guidelines, relying solely on a technician’s hand grip is considered an unacceptable single point of failure.',
          'A proper dropped object prevention protocol mandates engineered primary and secondary retention systems:'
        ],
        listItems: [
          'Tool Lanyards & Tethers: Shock-absorbing tethers connected directly to wristbands, belt anchor points, or tool buckets.',
          'Enclosed Tool Holsters: Pouches with positive latching closures or hook-and-loop security flaps.',
          'Lanyard Weight Limits: Strict adherence to manufacturer load limits (never attach heavy tools to body-worn wrist lanyards).'
        ]
      },
      {
        heading: '3. Dynamic Exclusion Zones & Barricading Protocols',
        paragraphs: [
          'When objects fall from elevated structures, crosswinds and deflection off tower walls cause them to bounce outward. An object dropped from 80 meters in a 25 km/h wind can land 20 to 30 meters away from the turbine base center point.',
          'Safety coordinators must establish wide, physical exclusion zones marked with high-visibility barricades and warning signage. No ground personnel may enter the exclusion perimeter while elevated work is active.'
        ]
      },
      {
        heading: '4. Pre-Task Tool Audit & Positive Inventory Reconciliation',
        paragraphs: [
          'Before ascending the tower, technicians must complete a written Tool Inventory Log. Upon task completion, every item must be physically verified and checked off at the base before declaring the job site clear.',
          'This prevents tools and fasteners from being inadvertently left behind inside moving turbine hubs or nacelle fan enclosures, where vibration could later dislodge them into high-speed machinery.'
        ]
      }
    ],
    relatedCourseIds: ['gwo-bst', 'gwo-btt']
  }
];