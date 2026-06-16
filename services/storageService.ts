
import { Course, Review, Student, InstituteSettings, Trainer, Session, CorporateClient, MigrationLog, SitePage, AdminUser, Role, SystemModule, PageSection, ThemeSettings, PaymentRecord, SchoolSection, SupportTicket, AuditLog } from '../types';
import { COURSES as SEED_COURSES, LOCATIONS } from '../constants';

// Keys
const SAVED_KEY = 'apex_saved_courses_v1';
const RECENT_KEY = 'apex_recent_courses_v1';
const REVIEWS_KEY = 'apex_course_reviews_v1';
const COURSES_KEY = 'apex_courses_data_v1';
const STUDENTS_KEY = 'apex_students_data_v1';
const SETTINGS_KEY = 'apex_settings_data_v1';
const TRAINERS_KEY = 'apex_trainers_data_v1';
const CLIENTS_KEY = 'apex_clients_data_v1';
const MIGRATION_KEY = 'apex_migration_logs_v1';
const SESSIONS_KEY = 'apex_sessions_data_v1';
const SITE_PAGES_KEY = 'apex_site_pages_data_v2';
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

// --- Course Management ---
export const getCourses = (): Course[] => {
  const stored = localStorage.getItem(COURSES_KEY);
  if (!stored) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(SEED_COURSES));
    return SEED_COURSES;
  }
  return JSON.parse(stored);
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
  enrollmentOpen: true
};

export const getSettings = (): InstituteSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: InstituteSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
                image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920"
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
                image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200"
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
                        description: "To provide industry-leading safety training that equips wind energy professionals with the knowledge and skills to perform their roles safely and effectively, contributing to a safer work environment.", 
                        icon: "Target" 
                    },
                    { 
                        title: "Our Vision", 
                        description: "To be the leading provider of wind safety training in Australia, renowned for our commitment to quality, safety, and professional development.", 
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
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200"
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
                    { title: "Sarah Jenkins", description: "Senior Trainer | GWO Specialist", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
                    { title: "Mike Ross", description: "Lead Instructor | High Risk Work", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" }
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
                    { title: "Our Courses", description: "Browse our extensive range of accredited qualifications.", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920" },
                    { title: "GWO Certified Training", description: "World-class safety training for wind energy.", image: "https://images.unsplash.com/photo-1515658323427-8554106ec904?auto=format&fit=crop&q=80&w=1920" }
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
  { id: 'online-enrolments', name: 'Online Enrolments', lastUpdated: new Date().toISOString(), sections: [] },
  { id: 'refund-policy', name: 'Refund Policy', lastUpdated: new Date().toISOString(), sections: [] },
  { id: 'privacy-notice', name: 'Privacy Notice', lastUpdated: new Date().toISOString(), sections: [] },
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
  { id: 'usi', name: 'USI Info', lastUpdated: new Date().toISOString(), sections: [] },
];

export const getSitePages = (): SitePage[] => {
  const stored = localStorage.getItem(SITE_PAGES_KEY);
  if (!stored) {
    localStorage.setItem(SITE_PAGES_KEY, JSON.stringify(SEED_PAGES));
    return SEED_PAGES;
  }
  return JSON.parse(stored);
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
          { id: 'admin1', name: 'Admin User', email: 'admin@skylareducation.asia', role: 'Super Admin', status: 'Active', lastActive: 'Just now' }
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
            { id: 'r1', name: 'Super Admin', description: 'Full access', usersCount: 1 },
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
