
import { Course, Review, Student, InstituteSettings, Trainer, Session, CorporateClient, MigrationLog, SitePage, AdminUser, Role, SystemModule, PageSection, ThemeSettings, PaymentRecord, SchoolSection, SupportTicket, AuditLog } from '../types';
import { COURSES as SEED_COURSES, LOCATIONS } from '../constants';
import { supabaseClient } from './supabaseClient';

// Intercept localStorage.setItem to sync with Supabase in the background
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = (key: string, value: string) => {
  originalSetItem(key, value);
  if (key.startsWith('apex_')) {
    try {
      const parsed = JSON.parse(value);
      supabaseClient.upsert(key, parsed).catch(err => {
        console.error(`Failed to sync key ${key} to Supabase:`, err);
      });
    } catch (e) {
      // Ignore parse errors (non-JSON strings)
    }
  }
};


// Keys
const SAVED_KEY = 'apex_saved_courses_v1';
const RECENT_KEY = 'apex_recent_courses_v1';
const REVIEWS_KEY = 'apex_course_reviews_v1';
const COURSES_KEY = 'apex_courses_data_v3';
const STUDENTS_KEY = 'apex_students_data_v1';
const SETTINGS_KEY = 'apex_settings_data_v1';
const TRAINERS_KEY = 'apex_trainers_data_v1';
const CLIENTS_KEY = 'apex_clients_data_v1';
const MIGRATION_KEY = 'apex_migration_logs_v1';
const SESSIONS_KEY = 'apex_sessions_data_v1';
const SITE_PAGES_KEY = 'apex_site_pages_data_v8';
const CART_KEY = 'apex_cart_data_v1';
const ADMIN_USERS_KEY = 'apex_admin_users_v1';
const ROLES_KEY = 'apex_roles_data_v1';
const MODULES_KEY = 'apex_modules_data_v1';
const THEME_KEY = 'apex_theme_settings_v1';
const PAYMENTS_KEY = 'apex_payments_data_v1';
const SECTIONS_KEY = 'apex_sections_data_v1';
const TICKETS_KEY = 'apex_tickets_data_v1';
const AUDIT_LOGS_KEY = 'apex_audit_logs_v1';

// --- Cart Management ---
export const getCart = (): string[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (courseId: string) => {
  const cart = getCart();
  if (!cart.includes(courseId)) {
    const newCart = [...cart, courseId];
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const removeFromCart = (courseId: string) => {
  const cart = getCart();
  const newCart = cart.filter(id => id !== courseId);
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const isInCart = (courseId: string): boolean => {
  return getCart().includes(courseId);
};

export const getCourses = (): Course[] => {
  const stored = localStorage.getItem(COURSES_KEY);
  if (!stored) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(SEED_COURSES));
    return SEED_COURSES;
  }
  const parsed = JSON.parse(stored) as Course[];
  return parsed.map(c => {
    const seed = SEED_COURSES.find(s => s.id === c.id);
    if (!seed) return c;
    return {
      ...seed,
      ...c,
      courseBenefits: c.courseBenefits || seed.courseBenefits,
      isThisCourseForMe: c.isThisCourseForMe || seed.isThisCourseForMe,
      careerOpportunities: c.careerOpportunities || seed.careerOpportunities,
      durationOfTraining: c.durationOfTraining || seed.durationOfTraining,
      whereDelivered: c.whereDelivered || seed.whereDelivered,
      accreditedUnitsRich: c.accreditedUnitsRich || seed.accreditedUnitsRich,
      entryRequirementsRich: c.entryRequirementsRich || seed.entryRequirementsRich,
      lln: c.lln || seed.lln,
      assessment: c.assessment || seed.assessment,
      certificationRecord: c.certificationRecord || seed.certificationRecord,
      validityPeriod: c.validityPeriod || seed.validityPeriod,
      whatToBringRich: c.whatToBringRich || seed.whatToBringRich,
      costOfTraining: c.costOfTraining || seed.costOfTraining,
      paymentOptions: c.paymentOptions || seed.paymentOptions,
    };
  });
};

export const getCourseById = (id: string): Course | undefined => {
  return getCourses().find(c => c.id === id);
};

export const saveCourse = (course: Course) => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === course.id);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.push(course);
  }
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const deleteCourse = (id: string) => {
  const courses = getCourses().filter(c => c.id !== id);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

// --- Student Management ---
export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STUDENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveStudent = (student: Student) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const deleteStudent = (id: string) => {
  const students = getStudents().filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

// --- Settings ---
const DEFAULT_SETTINGS: InstituteSettings = {
  instituteName: "Skylar Education Asia Inc.",
  contactEmail: "info@skylareducation.asia",
  contactPhone: "+63 45 123 4567",
  address: "Lot 2 Liwayway St., Angeles City, Pampanga",
  rtoId: "45000",
  operatingHours: "Mon-Fri 8am-5pm",
  siteAnnouncement: "",
  enrollmentOpen: true,
  // New Default Branding & Extra Settings
  lightLogoUrl: "",
  darkLogoUrl: "",
  faviconUrl: "",
  defaultDarkMode: false,
  brandColor: "#041024",
  themePreset: "navy",
  taxId: "ABN 84 920 184 721",
  supportContactName: "Safety Admin Team",
  supportHours: "Mon-Fri 8:00 AM - 5:00 PM (AEST)",
  tuitionCurrency: "AUD",
  classSizeLimit: 20,
  passingScore: 80
};

export const getSettings = (): InstituteSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: InstituteSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('themeUpdated'));
};

// --- Trainers ---
export const getTrainers = (): Trainer[] => {
  const stored = localStorage.getItem(TRAINERS_KEY);
  if (!stored) {
      // Seed trainers
      const seedTrainers = [
          { id: 't1', firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.j@skylar.edu', specialties: [], qualifications: ['TAE40116'], isActive: true },
          { id: 't2', firstName: 'Mike', lastName: 'Ross', email: 'mike.r@skylar.edu', specialties: [], qualifications: ['TAE40116'], isActive: true }
      ];
      localStorage.setItem(TRAINERS_KEY, JSON.stringify(seedTrainers));
      return seedTrainers;
  }
  return JSON.parse(stored);
};

// --- Sessions ---
export const getSessions = (): Session[] => {
  const stored = localStorage.getItem(SESSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveSession = (session: Session) => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const deleteSession = (id: string) => {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// --- Corporate Clients ---
export const getCorporateClients = (): CorporateClient[] => {
  const stored = localStorage.getItem(CLIENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCorporateClient = (client: CorporateClient) => {
  const clients = getCorporateClients();
  const index = clients.findIndex(c => c.id === client.id);
  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const deleteCorporateClient = (id: string) => {
  const clients = getCorporateClients().filter(c => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

// --- Site Pages (CMS) ---
const SEED_PAGES: SitePage[] = [
  { 
    id: 'home', 
    name: 'Home Page', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: 'SAFETY TRAINING SPECIALISTS',
                description: "Australia's premier provider of GWO, High Risk Work, and Industrial Safety training.",
                buttonText: "View All Courses",
                buttonLink: "/courses",
                image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
                items: [
                    { 
                        title: "SAFETY TRAINING SPECIALISTS", 
                        description: "Australia's premier provider of GWO, High Risk Work, and Industrial Safety training.", 
                        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "View All Courses",
                        buttonLink: "/courses"
                    },
                    { 
                        title: "GWO Global Standards", 
                        description: "Internationally recognised safety training for the wind energy sector.", 
                        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "View GWO Courses",
                        buttonLink: "/courses?category=GWO"
                    },
                    { 
                        title: "High Risk Work Licensing", 
                        description: "Get licensed for Dogging, Rigging, and Forklift operations with expert trainers.", 
                        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "View Construction",
                        buttonLink: "/courses?category=Construction"
                    }
                ]
            }
        },
        {
            id: 'accreditation',
            label: 'Accreditation Bar',
            type: 'features',
            data: {
                heading: "Nationally Recognised & Trusted By Industry Leaders",
                items: [
                    { title: "NRT", description: "Nationally Recognised Training", icon: "Award" },
                    { title: "GWO", description: "Global Wind Organisation", icon: "Fan" },
                    { title: "WorkSafe", description: "WorkSafe Approved", icon: "ShieldCheck" }
                ]
            }
        },
        {
            id: 'courses_intro',
            label: 'Featured Courses Intro',
            type: 'content',
            data: {
                heading: "Start Your Career",
                subheading: "Popular Programs",
                description: "Explore our most in-demand courses designed to get you job-ready for the wind and construction industries."
            }
        },
        {
            id: 'cta',
            label: 'Call to Action',
            type: 'cta',
            data: {
                heading: "Ready to Upskill?",
                subheading: "Book your spot today. Classes fill up fast.",
                buttonText: "Enroll Now",
                buttonLink: "/courses"
            }
        }
    ] 
  },
  { 
    id: 'about', 
    name: 'About Us', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "About Skylar Education",
                description: "We are dedicated to providing world-class safety training for the renewable energy and construction sectors.",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'safety_excellence',
            label: 'Safety Excellence',
            type: 'content',
            data: {
                heading: "Empowering Safety Excellence in Wind Energy",
                subheading: "TAILORED SAFETY TRAINING FOR THE WIND INDUSTRY",
                description: "Skylar Education is a dedicated Registered Training Organisation (RTO 21647) specialising in wind safety training across Australia. With a focus on the Global Wind Organisation's (GWO) safety standards, we offer both initial and refresher courses designed to elevate the skills and safety practices of professionals in the wind energy sector.\n\nOur training centres are strategically located in key regions, providing accessible, top-tier education to ensure industry compliance and enhance career opportunities.",
                image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200"
                // partners removed per request
            }
        },
        {
            id: 'mission_vision_credentials',
            label: 'Mission, Vision & Credentials',
            type: 'features',
            data: {
                items: [
                    { 
                        title: "Our Mission", 
                        description: "To empower the renewable energy industry through world-class training, workforce development, and operational competency.", 
                        icon: "Target" 
                    },
                    { 
                        title: "Our Vision", 
                        description: "To become Asia-Pacific’s leading provider of wind energy and high-risk industry workforce training.", 
                        icon: "Eye" 
                    },
                    { 
                        title: "Our Credentials", 
                        description: "• Industry-Relevant Accreditation\n• Nationally Recognised (RTO 21647)\n• Experienced Instructors\n• Flexibility in Training Delivery", 
                        icon: "Award" 
                    }
                ]
            }
        },
        {
            id: 'partner_excellence',
            label: 'Partner Excellence',
            type: 'content',
            data: {
                heading: "Your Partner in Professional Wind Safety Training",
                subheading: "Excellence in Safety Training",
                description: "Choose Skylar Education for comprehensive, practical training that meets global standards. Our programs are meticulously designed to ensure that every participant gains the skills necessary for safety and efficiency in the wind sector.\n\nWith state-of-the-art facilities, a curriculum that covers essential safety modules, and a track record of successful certifications, Skylar Education stands out as your best choice for advancing in the wind energy field.",
                image: "/wind-turbine-worker.png"
            }
        },
        {
            id: 'team',
            label: 'Our Team',
            type: 'team',
            data: {
                heading: "Our Expert Trainers",
                description: "Meet the professionals who will guide you through your training.",
                items: [
                    { 
                        title: "Sarah Jenkins", 
                        description: "Senior Trainer | GWO Specialist", 
                        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                        specialties: "GWO BST, Work at Height, First Aid",
                        experience: "8 Years"
                    },
                    { 
                        title: "Mike Ross", 
                        description: "Lead Instructor | High Risk Work", 
                        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
                        specialties: "Confined Spaces, Rigging/Slinging, Rescue",
                        experience: "10 Years"
                    },
                    { 
                        title: "David Vance", 
                        description: "Wind Energy & Safety Expert", 
                        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
                        specialties: "Blade Repair, GWO ART, Electrical Safety",
                        experience: "7 Years"
                    }
                ]
            }
        },
        {
            id: 'gwo_hero',
            label: 'GWO Hero',
            type: 'hero',
            data: {
                heading: "GWO Certification",
                subheading: "GLOBAL STANDARDS FOR WIND SAFETY",
                description: "Recognised worldwide, GWO training ensures you have the essential safety skills for the wind energy industry.",
                image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1920" 
            }
        },
        {
            id: 'gwo_intro',
            label: 'Introduction to GWO',
            type: 'content',
            data: {
                heading: "Introduction to GWO Certification",
                subheading: "GWO Certification and its Importance",
                description: "The Global Wind Organisation (GWO) was established to enhance the safety and training of individuals working in the wind energy sector. As the renewable energy field expands, having a skilled and informed workforce is very important.\n\nGWO Certification offers a structured way to attain the necessary skills, promoting safety and efficiency across the industry.",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/GWO_Global_Wind_Organisation_logo.png/800px-GWO_Global_Wind_Organisation_logo.png" 
            }
        },
        {
            id: 'gwo_overview',
            label: 'Overview of GWO',
            type: 'content',
            data: {
                heading: "Overview of GWO",
                subheading: "STANDARDS IN RENEWABLE ENERGY WORKFORCE",
                description: "GWO is an industry-driven initiative that focuses on standardising safety training for wind turbine technicians. The organisation produces guidelines and protocols for training programmes, ensuring that they meet international standards.\n\nAccording to GWO member surveys, standardization provides clear benefits such as establishing contractual expectations, improving safety, and enabling more efficient labor sourcing.",
                // Image removed to allow chart rendering via custom logic in SectionRenderer
                image: "" 
            }
        },
        {
            id: 'gwo_coo_message',
            label: 'COO Message',
            type: 'content',
            data: {
                heading: "Pramono Edens - COO",
                description: "GWO Certification is your pathway to a successful and rewarding career in the renewable energy sector. At Skylar Education, we empower individuals to build a stable future for themselves and their families while contributing to a greener, more sustainable world. By achieving GWO Certification, you’re not just advancing your career—you’re making a lasting impact on your life, your loved ones, and the planet.",
                image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800"
            }
        },
        {
            id: 'gwo_productivity',
            label: 'Workforce Productivity',
            type: 'content',
            data: {
                heading: "Importance of Certification in the Wind Industry",
                subheading: "IMPROVED WORKFORCE PRODUCTIVITY",
                description: "✓ Safety certification by recognized bodies like GWO is essential in the industry.\n✓ Certification boosts the credibility of technicians.\n✓ It assures employers that their teams have proper training.\n✓ GWO certification is more than just an entry requirement; it sets a standard for safety and operational excellence.\n✓ The following sections will explore the benefits of GWO certification."
            }
        },
        {
            id: 'gwo_next_step',
            label: 'Next Step CTA',
            type: 'content',
            data: {
                heading: "Take the Next Step Towards a Brighter Future in Renewable Energy!",
                subheading: "EXCELLENCE IN SAFETY TRAINING",
                description: "Discover how GWO Certification can unlock new career opportunities, boost your technical proficiency, and make you an asset in the growing wind energy industry. Don’t wait to elevate your career—learn more about the certification process and how it can set you apart in the renewable energy sector.",
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200", 
                buttonText: "Find Out More Today",
                buttonLink: "/contact"
            }
        },
        {
            id: 'gwo_technical_safety',
            label: 'Technical Proficiency and Safety',
            type: 'features',
            data: {
                heading: "Technical Proficiency and Safety",
                items: [
                    {
                        title: "Meeting GWO Standards",
                        description: "The GWO standards establish a foundation for technical proficiency. By adhering to these standards, technicians are well-prepared to meet the demands of their roles. This rigorous training methodology ensures that workers are not only competent but also confident in their skills.",
                        icon: "Award"
                    },
                    {
                        title: "Ensuring Technician Safety",
                        description: "Safety is a top priority in the wind industry. Through GWO certification, technicians learn essential safety practices that minimise risks and maximise operational efficiency. This focus on safety not only protects workers but also helps to sustain the integrity of wind energy projects.",
                        icon: "ShieldCheck"
                    }
                ]
            }
        }
    ] 
  },
  { 
    id: 'courses', 
    name: 'Courses', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Slider',
            type: 'features',
            data: {
                items: [
                    { title: "Our Courses", description: "Browse our extensive range of accredited qualifications.", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920" },
                    { title: "GWO Certified Training", description: "World-class safety training for wind energy.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1920" }
                ]
            }
        },
        {
            id: 'intro',
            label: 'Intro Text',
            type: 'content',
            data: {
                heading: "Industry Accredited Training",
                description: "Choose from our comprehensive list of courses below."
            }
        },
        {
            id: 'cta',
            label: 'Bottom CTA',
            type: 'cta',
            data: {
                heading: "Need Custom Training?",
                subheading: "We offer tailored corporate packages for large groups.",
                buttonText: "Contact Us",
                buttonLink: "/contact"
            }
        }
    ] 
  },
  { 
    id: 'locations', 
    name: 'Locations', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: 'Our Campuses',
                description: 'Modern training facilities located centrally for your convenience.',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920'
            }
        },
        {
            id: 'ai_section',
            label: 'AI Helper Text',
            type: 'content',
            data: {
                heading: "Explore the Area",
                description: "Moving to study? Use our AI assistant to find amenities like libraries, cafes, or public transport near our campuses."
            }
        }
    ] 
  },
  { 
    id: 'contact', 
    name: 'Contact', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: 'Contact Skylar Education',
                description: 'Whether you need to book a group session or verify a certificate, our team is ready to assist.',
                image: 'https://images.unsplash.com/photo-1423666639041-f142fcb944b0?auto=format&fit=crop&q=80&w=1920'
            }
        },
        {
            id: 'info',
            label: 'Contact Info',
            type: 'features',
            data: {
                heading: 'Contact Information',
                items: [
                    { title: "Head Office", description: "Lot 2 Liwayway St., Angeles City, Pampanga", icon: "MapPin" },
                    { title: "Phone", description: "+63 45 123 4567", icon: "Phone" },
                    { title: "Email", description: "info@skylareducation.asia", icon: "Mail" }
                ]
            }
        },
        {
            id: 'hours',
            label: 'Office Hours',
            type: 'content',
            data: {
                heading: 'Office Hours',
                items: [
                    { title: "Monday - Friday", description: "8:00 AM - 5:00 PM" },
                    { title: "Saturday", description: "9:00 AM - 1:00 PM" },
                    { title: "Sunday", description: "Closed" }
                ]
            }
        }
    ] 
  },
  { 
    id: 'faq', 
    name: 'FAQ', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Frequently Asked Questions",
                description: "Find answers to common questions about our courses and enrollment.",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'faq_list',
            label: 'Questions',
            type: 'accordion',
            data: {
                heading: "General Questions",
                items: [
                    { title: "How do I enroll?", description: "You can enroll online via our course pages or contact our admin team." },
                    { title: "What is a USI?", description: "A Unique Student Identifier (USI) is a reference number made up of 10 numbers and letters that creates a secure online record of your recognised training and qualifications." },
                    { title: "Do you offer refunds?", description: "Yes, please refer to our Refund Policy page for full details regarding cancellations and withdrawals." }
                ]
            }
        }
    ] 
  },
  { 
    id: 'student-info', 
    name: 'Student Info', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: 'Your Hub for Success',
                description: 'Access your learning portal, download key resources, and find support for your academic journey.',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920'
            }
        },
        {
            id: 'quick_links',
            label: 'Quick Access Links',
            type: 'features',
            data: {
                items: [
                    { title: "Student Portal", description: "LMS Login", icon: "BookOpen" },
                    { title: "Timetables", description: "Class Schedules", icon: "Calendar" },
                    { title: "Support", description: "Get Help", icon: "LifeBuoy" },
                    { title: "Library", description: "Resources", icon: "Globe" }
                ]
            }
        },
        {
            id: 'support',
            label: 'Support Services',
            type: 'features',
            data: {
                heading: 'Student Support',
                items: [
                    { title: "Academic Support", description: "One-on-one tutoring and study skills workshops.", icon: "GraduationCap" },
                    { title: "Career Advice", description: "Resume reviews and job placement assistance.", icon: "Briefcase" }
                ]
            }
        },
        {
            id: 'policies',
            label: 'Key Policies',
            type: 'content',
            data: {
                heading: 'Key Policies',
                items: [
                    { title: "Refund Policy", description: "Guidelines on fee refunds and withdrawals." },
                    { title: "Privacy Notice", description: "How we handle your personal data." },
                    { title: "Complaints", description: "Procedures for submitting feedback or grievances." }
                ]
            }
        },
        {
            id: 'ai_chat',
            label: 'AI Chat Intro',
            type: 'content',
            data: {
                heading: "Still have questions?",
                description: "Our virtual assistant can help you find answers about policies, dates, and enrollment instantly."
            }
        }
    ] 
  },
  { 
    id: 'news', 
    name: 'News & Articles', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "News & Articles",
                description: "Stay updated with the latest industry trends, safety standards, and institute announcements.",
                image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'featured',
            label: 'Featured Header',
            type: 'content',
            data: {
                heading: "Latest Updates",
                subheading: "FROM THE BLOG"
            }
        },
        {
            id: 'cta',
            label: 'Newsletter CTA',
            type: 'cta',
            data: {
                heading: "Stay in the Loop",
                subheading: "Subscribe to our newsletter for the latest course updates and industry news.",
                buttonText: "Subscribe Now",
                buttonLink: "#subscribe"
            }
        }
    ] 
  },
  { 
    id: 'online-enrolments', 
    name: 'Online Enrolments', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Enrol Anytime, Anywhere",
                description: "Secure, fast, and accessible 24/7 from any device.",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'content',
            label: 'Portal Info',
            type: 'content',
            data: {
                heading: "Online Enrollment Portal",
                description: "Please select a course to begin the online enrollment process."
            }
        }
    ] 
  },
  { 
    id: 'refund-policy', 
    name: 'Refund Policy', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Refund Policy & Procedure",
                description: "Our commitment to fair trading and transparent financial processes for all students.",
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'details',
            label: 'Overview Details',
            type: 'content',
            data: {
                heading: "Overview",
                description: "We strive to provide high-quality training and education to our students. We understand that sometimes circumstances change, and you may need to cancel or withdraw from your course. Our refund policy aims to provide a fair and transparent process for students who choose to withdraw from their course."
            }
        },
        {
            id: 'policy_accordions',
            label: 'Policy Items Accordion',
            type: 'accordion',
            data: {
                heading: "Details & Guidelines",
                items: [
                    {
                        title: "TUITION FEES",
                        description: `If you choose to withdraw from a face-to-face course, we will provide you with a full refund of any tuition fees paid if you notify us in writing at least 10 business days before the course commencement date.

If you withdraw 5 business days or less prior to the commencement of a program you will be entitled to a refund of up to 50% of the course fees paid.

If you withdraw within 24 hours of the course commencing, you will not be entitled to a refund.

No refund will be provided if you withdraw after the course commencement date.`
                    },
                    {
                        title: "REFUND PROCESSING",
                        description: `Approved refund will be implemented within 10 business days. Refunds will be made to the bank account or credit card used for the initial payment. Please note that any non-refundable fees or charges associated with your payment method will not be refunded.

We reserve the right to amend this refund policy from time to time. If we do, we will notify you by email and update the policy on our website.`
                    }
                ]
            }
        }
    ] 
  },
  { 
    id: 'privacy-notice', 
    name: 'Privacy Notice', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Privacy Notice",
                description: "How we protect and manage your personal information in accordance with National VET standards.",
                image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'policies',
            label: 'Policy Overview',
            type: 'content',
            data: {
                heading: "Privacy Policy Overview",
                description: "We value your privacy and are committed to protecting your personal information. Under the VET Quality Framework, we collect and store student data securely for national reporting obligations."
            }
        },
        {
            id: 'privacy_accordions',
            label: 'Compliance Accordions',
            type: 'accordion',
            data: {
                heading: "Federal & State Disclosures",
                items: [
                    {
                        title: "HOW WE USE YOUR PERSONAL INFORMATION",
                        description: "We use your personal information to enable us to deliver VET courses to you, and otherwise, as needed, to comply with our obligations as an RTO."
                    },
                    {
                        title: "HOW WE DISCLOSE YOUR PERSONAL INFORMATION",
                        description: "We are required by law (under the National Vocational Education and Training Regulator Act 2011 (Cth) (NVETR Act)) to disclose the personal information we collect about you to the National VET Data Collection kept by the National Centre for Vocational Education Research Ltd (NCVER). The NCVER is responsible for collecting, managing, analysing and communicating research and statistics about the Australian VET sector.\n\nWe are also authorised by law (under the NVETR Act) to disclose your personal information to the relevant state or territory training authority."
                    },
                    {
                        title: "HOW THE NCVER AND OTHER BODIES HANDLE YOUR PERSONAL INFORMATION",
                        description: `The NCVER will collect, hold, use and disclose your personal information in accordance with the law, including the Privacy Act 1988 (Cth) (Privacy Act) and the NVETR Act. Your personal information may be used and disclosed by NCVER for purposes that include populating authenticated VET transcripts; administration of VET; facilitation of statistics and research relating to education, including surveys and data linkage; and understanding the VET market.

The NCVER is authorised to disclose information to the Australian Government Department of Education, Skills and Employment (DESE), Commonwealth authorities, State and Territory authorities (other than registered training organisations) that deal with matters relating to VET and VET regulators for the purposes of those bodies, including to enable:

-administration of VET, including program administration, regulation, monitoring and evaluation
-facilitation of statistics and research relating to education, including surveys and data linkage
-understanding how the VET market operates, for policy, workforce planning and consumer information.

The NCVER may also disclose personal information to persons engaged by NCVER to conduct research on NCVER’s behalf.

The NCVER does not intend to disclose your personal information to any overseas recipients.

For more information about how the NCVER will handle your personal information please refer to the NCVER’s Privacy Policy at www.ncver.edu.au/privacy.

If you would like to seek access to or correct your information, in the first instance, please contact Skylar Education using the contact details listed below.

DESE is authorised by law, including the Privacy Act and the NVETR Act, to collect, use and disclose your personal information to fulfil specified functions and activities. For more information about how the DESE will handle your personal information, please refer to the DESE VET Privacy Notice at https://www.dese.gov.au/national-vet-data/vet-privacy-notice

Please refer to the additional State or Territory Authority Privacy Notice included in this application process should this be relevant to your application.`
                    },
                    {
                        title: "SURVEYS",
                        description: "You may receive a student survey which may be run by a government department or an NCVER employee, agent, third-party contractor or another authorised agency. Please note you may opt out of the survey at the time of being contacted."
                    },
                    {
                        title: "CONTACT INFORMATION",
                        description: `At any time, you may contact us to:

o request access to your personal information
o correct your personal information
o make a complaint about how your personal information has been handled
o ask a question about this Privacy Notice`
                    }
                ]
            }
        }
    ] 
  },
  { 
    id: 'complaints', 
    name: 'Complaints', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Complaints & Appeals",
                description: "We value your feedback and are committed to resolving issues fairly and transparently.",
                image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'content',
            label: 'Process Description',
            type: 'content',
            data: {
                heading: "Complaints Process",
                description: "If you are dissatisfied with a service offered or treatment received by Skylar Education, then you have the right to lodge a complaint. In the event that you are dissatisfied with the outcome with your complaint, then you have the right to lodge an appeal. Please refer to the Complaints and Appeals Policy that is given to you upon enrolment via the student handbook."
            }
        }
    ] 
  },
  { 
    id: 'usi', 
    name: 'USI Info', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "Unique Student Identifier (USI)",
                description: "Your Key to Unlocking Opportunities in Vocational Education.",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'intro',
            label: 'USI Introduction',
            type: 'content',
            data: {
                heading: "Unique Student Identifier",
                description: `Every year almost four million Australians build and sharpen their skills by undertaking nationally recognised training. All students doing nationally recognised training need to have a Unique Student Identifier (USI). This includes students doing Vocational Education Training (VET) when they are still at school (VET for secondary students).

From 1 January 2015 it is a requirement of the Federal Government that all students undertaking nationally recognised training will need to obtain a Unique Student Identifier (USI). This involves an easy online application. See the USI website for additional information.`
            }
        },
        {
            id: 'usi_accordions',
            label: 'USI Guide Accordions',
            type: 'accordion',
            data: {
                heading: "USI Help & Guides",
                items: [
                    {
                        title: "WHAT IS A USI",
                        description: "A Unique Student Identifier (USI) is a reference number that gives each student in Australia a unique identity for their educational achievements. It is a requirement for anyone studying a nationally recognised training course in Australia. The USI creates an online record of a student’s qualifications and achievements, allowing them to access their training records and transcripts from one central location. It also makes it easier for employers and educational institutions to verify a student’s qualifications and track their progress throughout their education and career. Creating a USI is free and can be done via the USI website."
                    },
                    {
                        title: "ALREADY HAVE A USI?",
                        description: "There are 4 ways to find your USI:\n\n1. Email address: Enter the email address saved on your USI account and click 'Submit' on the USI website. An email will be sent containing your USI details.\n\n2. Mobile number: Enter the mobile number saved on your USI account and your date of birth, and you will receive an SMS containing your USI.\n\n3. Personal details: Supply your name, date of birth, gender, and town of birth, then answer your check questions to display your USI on-screen."
                    }
                ]
            }
        }
    ] 
  },
];

export const getSitePages = (): SitePage[] => {
  const stored = localStorage.getItem(SITE_PAGES_KEY);
  if (!stored) {
    localStorage.setItem(SITE_PAGES_KEY, JSON.stringify(SEED_PAGES));
    return SEED_PAGES;
  }
  const pages: SitePage[] = JSON.parse(stored);
  let migrated = false;
  pages.forEach(p => {
    if (p.id === 'about') {
      p.sections.forEach(s => {
        if (s.id === 'safety_excellence' && s.data.image?.includes('photo-1516937941344-00b4e0337589')) {
          s.data.image = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200";
          migrated = true;
        }
        if (s.id === 'mission_vision_credentials' && s.data.items) {
          s.data.items.forEach(item => {
            if (item.title === 'Our Mission' && !item.description.includes('empower the renewable energy')) {
              item.description = "To empower the renewable energy industry through world-class training, workforce development, and operational competency.";
              migrated = true;
            }
            if (item.title === 'Our Vision' && !item.description.includes('Asia-Pacific’s leading provider')) {
              item.description = "To become Asia-Pacific’s leading provider of wind energy and high-risk industry workforce training.";
              migrated = true;
            }
          });
        }
        if (s.id === 'team' && (!s.data.items || s.data.items.length < 3 || !s.data.items[0].specialties)) {
          s.data.items = [
            { 
                title: "Sarah Jenkins", 
                description: "Senior Trainer | GWO Specialist", 
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                specialties: "GWO BST, Work at Height, First Aid",
                experience: "8 Years"
            },
            { 
                title: "Mike Ross", 
                description: "Lead Instructor | High Risk Work", 
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
                specialties: "Confined Spaces, Rigging/Slinging, Rescue",
                experience: "10 Years"
            },
            { 
                title: "David Vance", 
                description: "Wind Energy & Safety Expert", 
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
                specialties: "Blade Repair, GWO ART, Electrical Safety",
                experience: "7 Years"
            }
          ];
          migrated = true;
        }
      });
    }
  });
  if (migrated) {
    localStorage.setItem(SITE_PAGES_KEY, JSON.stringify(pages));
  }
  return pages;
};

export const getPageContent = (id: string): SitePage | undefined => {
  return getSitePages().find(p => p.id === id);
};

export const savePageContent = (page: SitePage) => {
  const pages = getSitePages();
  const index = pages.findIndex(p => p.id === page.id);
  if (index >= 0) {
    pages[index] = { ...page, lastUpdated: new Date().toISOString() };
    localStorage.setItem(SITE_PAGES_KEY, JSON.stringify(pages));
  }
};

// --- Migration Logs ---
export const addMigrationLog = (log: MigrationLog) => {
  const logs = getMigrationLogs();
  logs.unshift(log);
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(logs));
};

export const getMigrationLogs = (): MigrationLog[] => {
  const stored = localStorage.getItem(MIGRATION_KEY);
  return stored ? JSON.parse(stored) : [];
};

// --- User Experience (Saved/Recent) ---
export const getSavedCourseIds = (): string[] => {
  const stored = localStorage.getItem(SAVED_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const isCourseSaved = (id: string): boolean => {
  return getSavedCourseIds().includes(id);
};

export const toggleSavedCourse = (id: string): boolean => {
  let saved = getSavedCourseIds();
  const exists = saved.includes(id);
  if (exists) {
    saved = saved.filter(c => c !== id);
  } else {
    saved.push(id);
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  return !exists;
};

export const getRecentCourseIds = (): string[] => {
  const stored = localStorage.getItem(RECENT_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToRecentCourses = (id: string) => {
  let recent = getRecentCourseIds();
  recent = [id, ...recent.filter(c => c !== id)].slice(0, 10);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
};

// --- Reviews ---
export const getCourseReviews = (courseId: string): Review[] => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  const reviews: Review[] = stored ? JSON.parse(stored) : [];
  return reviews.filter(r => r.courseId === courseId);
};

export const addReview = (review: Review) => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  const reviews: Review[] = stored ? JSON.parse(stored) : [];
  reviews.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

// --- Admin Users ---
export const getAdminUsers = (): AdminUser[] => {
  const stored = localStorage.getItem(ADMIN_USERS_KEY);
  if (!stored) {
      const defaultAdmins: AdminUser[] = [
          { id: 'admin1', name: 'Admin User', email: 'admin@skylareducation.asia', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
          { id: 'e90e43c6-e13c-4a0f-a058-3f8fbc73666b', name: 'Super Admin', email: 'admin@skylar.com.ph', role: 'Super Admin', status: 'Active', lastActive: 'Just now' }
      ];
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdmins));
      return defaultAdmins;
  }
  return JSON.parse(stored);
};

export const saveAdminUser = (user: AdminUser) => {
    const users = getAdminUsers();
    const index = users.findIndex(u => u.id === user.id);
    if(index >= 0) users[index] = user;
    else users.push(user);
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
};

export const deleteAdminUser = (id: string) => {
    const users = getAdminUsers().filter(u => u.id !== id);
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
};

// --- Roles ---
export const getRoles = (): Role[] => {
    const stored = localStorage.getItem(ROLES_KEY);
    if (!stored) {
        const defaultRoles = [
            { id: 'r1', name: 'Super Admin', description: 'Full access', usersCount: 2 },
            { id: 'r2', name: 'Instructor', description: 'Manage courses and sessions', usersCount: 2 }
        ];
        localStorage.setItem(ROLES_KEY, JSON.stringify(defaultRoles));
        return defaultRoles;
    }
    return JSON.parse(stored);
};

// --- Modules ---
export const getModules = (): SystemModule[] => {
    const stored = localStorage.getItem(MODULES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const toggleModule = (id: string) => {
    const modules = getModules();
    const mod = modules.find(m => m.id === id);
    if (mod) {
        mod.enabled = !mod.enabled;
        localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
    }
};

// --- Audit Logs ---
export const getAuditLogs = (): AuditLog[] => {
    const stored = localStorage.getItem(AUDIT_LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addAuditLog = (action: string, details: string, module: string) => {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        adminName: 'Current User', // Placeholder
        action, details, module
    };
    logs.unshift(newLog);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100))); // Keep last 100
};

// --- Theme ---
export const getThemeSettings = (): ThemeSettings => {
  const stored = localStorage.getItem(THEME_KEY);
  let theme: ThemeSettings;
  
  if (!stored) {
    theme = {
      colorPrimary: '#041024',
      colorSecondary: '#041024',
      colorAccent: '#FFC107',
      colorSurface: '#F4F7FB',
      fontSans: "'Maven Pro', sans-serif",
      fontHeading: "'Maven Pro', sans-serif",
      borderRadius: 12,
      baseFontSize: 15
    };
  } else {
    theme = JSON.parse(stored);
    if (typeof theme.baseFontSize === 'undefined') theme.baseFontSize = 15;
    if (theme.fontHeading && (theme.fontHeading.includes('Poppins') || theme.fontHeading.includes('Inter'))) {
      theme.fontHeading = "'Maven Pro', sans-serif";
    }
    if (theme.fontSans && (theme.fontSans.includes('Inter') || theme.fontSans.includes('Poppins'))) {
      theme.fontSans = "'Maven Pro', sans-serif";
    }
  }
  return theme;
};

export const saveThemeSettings = (theme: ThemeSettings) => {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  window.dispatchEvent(new Event('themeUpdated'));
};

// --- Finance ---
export const getPayments = (): PaymentRecord[] => {
    const stored = localStorage.getItem(PAYMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const savePayment = (payment: PaymentRecord) => {
    const payments = getPayments();
    payments.unshift(payment);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
};

// --- Sections ---
export const getSections = (): SchoolSection[] => {
    const stored = localStorage.getItem(SECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveSection = (section: SchoolSection) => {
    const sections = getSections();
    const index = sections.findIndex(s => s.id === section.id);
    if (index >= 0) sections[index] = section;
    else sections.push(section);
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
};

// --- Support ---
export const getTickets = (): SupportTicket[] => {
    const stored = localStorage.getItem(TICKETS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveTicket = (ticket: SupportTicket) => {
    const tickets = getTickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) tickets[index] = ticket;
    else tickets.push(ticket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
};

// --- Supabase Initialization & Seeding ---
export const initializeSupabase = async (): Promise<void> => {
  try {
    const data = await supabaseClient.getAll();
    const dbKeys = new Set(data.map(item => item.key));
    
    // 1. Populate what we got from Supabase
    data.forEach(item => {
      localStorage.setItem(item.key, JSON.stringify(item.value));
    });

    // 2. Seed default values in Supabase if they are missing
    if (!dbKeys.has(COURSES_KEY)) {
      const courses = getCourses();
      await supabaseClient.upsert(COURSES_KEY, courses);
    }
    if (!dbKeys.has(SITE_PAGES_KEY)) {
      const pages = getSitePages();
      await supabaseClient.upsert(SITE_PAGES_KEY, pages);
    }
    if (!dbKeys.has(TRAINERS_KEY)) {
      const trainers = getTrainers();
      await supabaseClient.upsert(TRAINERS_KEY, trainers);
    }
    if (!dbKeys.has(ROLES_KEY)) {
      const roles = getRoles();
      await supabaseClient.upsert(ROLES_KEY, roles);
    }
    if (!dbKeys.has(ADMIN_USERS_KEY)) {
      const admins = getAdminUsers();
      await supabaseClient.upsert(ADMIN_USERS_KEY, admins);
    }
    if (!dbKeys.has(THEME_KEY)) {
      const theme = getThemeSettings();
      await supabaseClient.upsert(THEME_KEY, theme);
    }
    if (!dbKeys.has(SETTINGS_KEY)) {
      const settings = getSettings();
      await supabaseClient.upsert(SETTINGS_KEY, settings);
    }
  } catch (error) {
    console.error('Failed to initialize data from Supabase:', error);
  }
};

