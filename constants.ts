import { Course, CourseCategory, Location, Testimonial, BlogPost } from './types';

export const LOGO_URL = "/skylar-logo.svg";

export const COURSES: Course[] = [
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
    upcomingDates: ['Mar 05, 2025', 'Mar 19, 2025']
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
    upcomingDates: ['Mar 07, 2025', 'Mar 21, 2025']
  },
  {
    id: 'gwo-bst-initial',
    title: 'GWO Basic Safety Training (BST) Initial',
    category: CourseCategory.GWO,
    shortDescription: 'A comprehensive training program designed specifically for individuals working in the global wind energy industry.',
    fullDescription: 'The Global Wind Organisation Basic Safety Training (BST) Initial is a comprehensive training program designed specifically for individuals working in the global wind energy industry. Learn from experienced trainers in realistic scenarios.',
    price: 2205,
    duration: '5 Days',
    level: 'Available',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    upcomingDates: ['Mar 03, 2025', 'Mar 17, 2025', 'Mar 31, 2025']
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
    upcomingDates: ['Feb 26, 2025', 'Mar 12, 2025']
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
    upcomingDates: []
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
];

export const LOCATIONS: Location[] = [
  {
    id: 'ph-facility',
    name: 'Skylar Education Asia - Pampanga Facility',
    address: 'Lot 2 Liwayway St., Cor Habagat, Bagumbayan, Brgy. Cutcut, Angeles City, Pampanga',
    phone: '+63 45 123 4567',
    email: 'info@skylareducation.asia',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    coordinates: { lat: 15.14, lng: 120.59 },
    state: 'VIC' // Keeping type compatibility for code reuse, but content is Philippines
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Jerome Villareal',
    role: 'Wind Turbine Technician',
    content: 'The GWO training at Skylar was exceptional. The simulators are exactly like what we use offshore. Highly recommend for anyone needing GWO certification.',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 't2',
    name: 'Sarah Chen',
    role: 'Safety Officer',
    content: 'Excellent facilities and knowledgeable trainers. The hands-on approach really helped me understand the material. Highly recommended for industrial safety training.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Skylar Education Expands to Asia',
    excerpt: 'Skylar Education Pty Ltd (Australia) has expanded to the Philippines through Skylar Education Asia Inc., bringing world-class GWO training to the region.',
    date: 'Feb 10, 2025',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'The Importance of GWO Standards',
    excerpt: 'Why Global Wind Organisation standards are crucial for safety in the renewable energy sector.',
    date: 'Jan 15, 2025',
    category: 'Industry News',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
  }
];