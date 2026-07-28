import { Course, Category, Review, Student, InstituteSettings, Trainer, Session, CorporateClient, MigrationLog, SitePage, AdminUser, Role, SystemModule, PageSection, ThemeSettings, PaymentRecord, SchoolSection, SupportTicket, AuditLog, CourseInquiry, SmtpSettings, EmailLog, Testimonial, GoogleReviewSettings } from '../types';
import { COURSES as SEED_COURSES, LOCATIONS, SEED_CATEGORIES, TESTIMONIALS as SEED_TESTIMONIALS } from '../constants';
import { firebaseClient } from './firebaseClient';

// Intercept localStorage.setItem to sync with Firebase in the background
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = (key: string, value: string) => {
  originalSetItem(key, value);
  if (key.startsWith('apex_')) {
    try {
      const parsed = JSON.parse(value);
      firebaseClient.upsert(key, { value: parsed }).catch(() => {});
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
const SETTINGS_KEY = 'apex_settings_data_v2';
const TRAINERS_KEY = 'apex_trainers_data_v1';
const CLIENTS_KEY = 'apex_clients_data_v1';
const MIGRATION_KEY = 'apex_migration_logs_v1';
const SESSIONS_KEY = 'apex_sessions_data_v1';
const SITE_PAGES_KEY = 'apex_site_pages_data_v10';
const CART_KEY = 'apex_cart_data_v1';
const ADMIN_USERS_KEY = 'apex_admin_users_v1';
const ROLES_KEY = 'apex_roles_data_v1';
const MODULES_KEY = 'apex_modules_data_v1';
const THEME_KEY = 'apex_theme_settings_v1';
const PAYMENTS_KEY = 'apex_payments_data_v1';
const SECTIONS_KEY = 'apex_sections_data_v1';
const TICKETS_KEY = 'apex_tickets_data_v1';
const AUDIT_LOGS_KEY = 'apex_audit_logs_v1';
const CATEGORIES_KEY = 'apex_categories_data_v1';

// Correct casing map: normalized key => proper display name
const CATEGORY_NAME_CORRECTIONS: Record<string, string> = {
  'gwo bst (basic safety training)': 'GWO BST (Basic Safety Training)',
  'gwo art (advanced rescue training)': 'GWO ART (Advanced Rescue Training)',
  'gwo-btt (basic technical training)': 'GWO-BTT (Basic Technical Training)',
  'gwo btt (basic technical training)': 'GWO-BTT (Basic Technical Training)',
  // sub-categories
  'bst - initial': 'BST – Initial',
  'bst-r': 'BST-R',
  'bst - refresher': 'BST – Refresher',
  'art - initial': 'ART – Initial',
  'art - refresher': 'ART – Refresher',
  'btt - initial': 'BTT – Initial',
  'btt - refresher': 'BTT – Refresher',
};

// --- Category Management ---
export const getCategories = (): Category[] => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    return SEED_CATEGORIES;
  }
  const categories: Category[] = JSON.parse(stored);
  // Apply name corrections and persist if anything changed
  let changed = false;
  const corrected = categories.map(cat => {
    const key = cat.name.toLowerCase().trim();
    if (CATEGORY_NAME_CORRECTIONS[key] && cat.name !== CATEGORY_NAME_CORRECTIONS[key]) {
      changed = true;
      return { ...cat, name: CATEGORY_NAME_CORRECTIONS[key] };
    }
    return cat;
  });
  if (changed) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(corrected));
  }
  return corrected;
};

export const saveCategory = (category: Category) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const deleteCategory = (id: string) => {
  const categories = getCategories().filter(c => c.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

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
      gwoModulesRich: c.gwoModulesRich || seed.gwoModulesRich,
      entryRequirementsRich: c.entryRequirementsRich || seed.entryRequirementsRich,
      languageRequirements: c.languageRequirements || seed.languageRequirements,
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
  instituteName: "SKYLAR EDUCATION ASIA",
  contactEmail: "info@skylareducation.asia",
  contactPhone: "+63 45 123 4567",
  address: "Lot 2 Liwayway St., Angeles City, Pampanga",
  
  operatingHours: "Mon-Fri 8am-5pm",
  siteAnnouncement: "",
  enrollmentOpen: true,
  // New Default Branding & Extra Settings
  lightLogoUrl: "",
  darkLogoUrl: "",
  loadingLogoUrl: "",
  faviconUrl: "",
  collapsedLogoUrl: "",
  uncollapsedLogoUrl: "",
  defaultDarkMode: false,
  brandColor: "#041024",
  themePreset: "navy",
  accentColor: "#ffc107",
  borderRadius: 12,
  sidebarTheme: "dark",
  taxId: "TIN / Reg No: SK-PH-2026-001",
  supportContactName: "Safety Admin Team",
  supportHours: "Mon-Fri 8:00 AM - 5:00 PM (PST)",
  tuitionCurrency: "PHP",
  classSizeLimit: 20,
  passingScore: 80,
  fontFamily: "Outfit",
  animationSpeed: "smooth",
  layoutStyle: "wide",
  customCss: ""
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
            label: 'Hero Slider',
            type: 'hero',
            data: {
                heading: 'SKYLAR EDUCATION ASIA: Leading GWO Wind Safety Training',
                description: 'Internationally certified training provider delivering GWO and industrial safety courses across key locations.',
                buttonText: 'Browse Courses',
                buttonLink: '/courses',
                image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1920',
                items: [
                    { 
                        title: "SKYLAR EDUCATION ASIA: Leading GWO Wind Safety Training", 
                        description: "Leading safety training and services for a sustainable future. GWO certified, internationally recognised, multiple locations.", 
                        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "Browse Courses",
                        buttonLink: "/courses"
                    },
                    { 
                        title: "New Course! GWO Basic Technical Training (BTT)", 
                        description: "Gain essential technical knowledge, practical skills, and safety awareness required for onshore and offshore wind turbines.", 
                        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "View GWO BTT Course",
                        buttonLink: "/courses/gwo-btt"
                    },
                    { 
                        title: "International Safety & GWO Certifications", 
                        description: "Certified wind energy, high-risk work, and industrial safety training delivered by international rescue professionals.", 
                        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920",
                        buttonText: "Contact Us",
                        buttonLink: "/contact"
                    }
                ]
            }
        },
        {
            id: 'training_programs',
            label: 'Explore Training Programs',
            type: 'training-programs',
            data: {
                subheading: 'SPECIALIZED PATHWAYS',
                heading: 'Explore Our Training Programs',
                items: [
                    { 
                        title: 'Global Wind Organisation', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    },
                    { 
                        title: 'Construction & High Risk Work', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    },
                    { 
                        title: 'Specialised Rescue', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    }
                ]
            }
        },
        {
            id: 'accreditation',
            label: 'Accreditation Bar',
            type: 'features',
            data: {
                heading: "Excellence in Safety Training - Industry-Leading Skills & Support",
                items: [
                    
                    { title: "International GWO Standards", description: "Training aligned with Internationally Recognised Global Wind Organisation (GWO) standards.", icon: "Fan" },
                    { title: "Wind Industry Specialists", description: "Delivered by certified wind energy professionals with real-world field experience in onshore and offshore operations.", icon: "Users" },
                    { title: "Flexible Delivery", description: "Offers nationwide and on-site training options for wind projects.", icon: "ShieldCheck" }
                ]
            }
        },
        {
            id: 'about_intro',
            label: 'Tailored Safety Training',
            type: 'content',
            data: {
                heading: "Leading Safety Training and Services for a Sustainable Future",
                subheading: "Tailored Safety Training for Diverse Industries",
                description: "SKYLAR EDUCATION ASIA exists to lift the bar on safety training. By tailoring programs to each industry, we help clients meet and exceed standards while creating cultures where every worker goes home safe. Discover how SKYLAR EDUCATION ASIA provides customised, high-quality training and safety services that prioritise injury-free work environments and meet your unique needs.",
                buttonText: "More About Us",
                buttonLink: "/about",
                image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=1200"
            }
        },
        {
            id: 'courses_intro',
            label: 'Featured Courses Intro',
            type: 'content',
            data: {
                heading: "Elevate Your Safety Skills",
                subheading: "Popular Programs",
                description: "Explore our most in-demand safety programs designed to get you job-ready for the wind and high-risk industries."
            }
        },
        {
            id: 'enrolment_steps',
            label: 'Enrolment Steps',
            type: 'features',
            data: {
                heading: "Easy 4-Step Enrolment - Learning Begins Here",
                description: "Begin your learning adventure with SKYLAR EDUCATION ASIA through our streamlined 4-step enrollment process. Designed for ease and simplicity, our portal guides you smoothly from sign-up to start.",
                items: [
                    { title: "Browse Courses Online", description: "Explore our extensive course listings and select the best option for your career goals.", icon: "Search" },
                    { title: "Inquire Now", description: "Submit your inquiry with your preferred date, location, and group details.", icon: "Calendar" },
                    { title: "Complete Enrolment Form", description: "Fill out the online enrolment form with your details to secure your spot.", icon: "FileText" },
                    { title: "Receive Confirmation", description: "Get immediate confirmation and all the course details in your inbox.", icon: "CheckCircle" }
                ]
            }
        },
        {
            id: 'why_choose_us',
            label: 'Why Choose Us',
            type: 'features',
            data: {
                subheading: 'WHY CHOOSE US',
                heading: 'Why Train With SKYLAR EDUCATION ASIA?',
                description: 'We don\'t just tick boxes. We provide immersive, scenario-based training that prepares you for the real world. Our facilities replicate actual site conditions to ensure maximum readiness.',
                image: '/why-train-skylar.png',
                items: [
                    { 
                        title: 'Industry Specialist Trainers', 
                        description: 'Learn directly from certified wind energy and high-risk safety experts with extensive hands-on operational field experience.', 
                        icon: 'HardHat' 
                    },
                    { 
                        title: 'Industry-Specific Training Facilities', 
                        description: 'Purpose-built training environments replicating real-world wind industry work conditions.', 
                        icon: 'Target' 
                    },
                    { 
                        title: 'Internationally Recognised Qualifications', 
                        description: 'Gain GWO qualifications and safety certifications that are globally recognised and accepted across wind energy projects worldwide.', 
                        icon: 'Award' 
                    }
                ]
            }
        },
        {
            id: 'stats',
            label: 'Operational Highlights',
            type: 'features',
            data: {
                heading: "Operational Highlights",
                description: "SKYLAR EDUCATION ASIA provides certified, GWO-aligned safety training with flexible delivery options across the Philippines and client sites.",
                items: [
                    { title: "1", subtitle: "Training Centre", description: "Angeles City, Pampanga", icon: "MapPin" },
                    { title: "Nationwide", subtitle: "Training Delivery", description: "Client Site Delivery Available", icon: "Globe" },
                    { title: "International", subtitle: "Training Standards", description: "GWO-Aligned Training", icon: "Award" }
                ]
            }
        },
        {
            id: 'cta',
            label: 'Call to Action',
            type: 'cta',
            data: {
                heading: "Ready to Advance Your Career?",
                subheading: "Upskill with SKYLAR EDUCATION ASIA today. Book your spot now - classes fill up quickly.",
                buttonText: "Browse Courses Now",
                buttonLink: "/courses",
                badgeTitle: "Internationally Recognised",
                badgeDescription: "All GWO and safety training qualifications are aligned with internationally recognised standards."
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
                heading: "About SKYLAR EDUCATION ASIA",
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
                description: "SKYLAR EDUCATION ASIA is an internationally certified training provider specialising in wind safety training in the Philippines and across Asia. With a focus on the Global Wind Organisation's (GWO) safety standards, we offer both initial and refresher courses designed to elevate the skills and safety practices of professionals in the wind energy sector.\n\nOur training centres are strategically located in key regions, providing accessible, top-tier education to ensure industry compliance and enhance career opportunities.",
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
                        description: "• Industry-Relevant Accreditation\n• Experienced Instructors\n• Flexibility in Training Delivery", 
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
                description: "Choose SKYLAR EDUCATION ASIA for comprehensive, practical training that meets global standards. Our programs are meticulously designed to ensure that every participant gains the skills necessary for safety and efficiency in the wind sector.\n\nWith state-of-the-art facilities, a curriculum that covers essential safety modules, and a track record of successful certifications, SKYLAR EDUCATION ASIA stands out as your best choice for advancing in the wind energy field.",
                image: "/angeles-training-centre.jpg"
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
                description: "GWO Certification is your pathway to a successful and rewarding career in the renewable energy sector. At SKYLAR EDUCATION ASIA, we empower individuals to build a stable future for themselves and their families while contributing to a greener, more sustainable world. By achieving GWO Certification, you’re not just advancing your career—you’re making a lasting impact on your life, your loved ones, and the planet.",
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
                heading: 'Our Training Centre & Delivery Options',
                description: 'SKYLAR EDUCATION ASIA operates one permanent, state-of-the-art training centre in Angeles City, Pampanga, alongside flexible nationwide client-site training delivery across the Philippines.',
                image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920'
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
                heading: 'Contact SKYLAR EDUCATION ASIA',
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
                    { title: "What is a WINDA ID?", description: "A WINDA ID is your personal registration ID created on the Global Wind Organisation (GWO) WINDA portal to track and authenticate your international safety certifications." },
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
                description: "How we protect and manage your personal information in accordance with Global GWO Standards and Philippine Data Privacy Laws.",
                image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'policies',
            label: 'Policy Overview',
            type: 'content',
            data: {
                heading: "Privacy Policy Overview",
                description: "We value your privacy and are committed to protecting your personal information. Under Global GWO standards and Philippine privacy laws, we collect and store student data securely for certification verification and training administration."
            }
        },
        {
            id: 'privacy_accordions',
            label: 'Compliance Accordions',
            type: 'accordion',
            data: {
                heading: "International Data Privacy & GWO Verification",
                items: [
                    {
                        title: "HOW WE USE YOUR PERSONAL INFORMATION",
                        description: "We use your personal information to enable us to deliver safety training courses to you, issue course certificates, and fulfill our verification obligations as a certified Global Wind Organisation (GWO) training provider."
                    },
                    {
                        title: "GWO WINDA DATABASE DISCLOSURES",
                        description: "Upon successful completion of any GWO course module, your course records and personal identifiers are registered directly with the GWO WINDA global database (winda.gwo.org) to allow global wind energy employers to verify your qualifications."
                    },
                    {
                        title: "DATA PROTECTION & PRIVACY RIGHTS",
                        description: `SKYLAR EDUCATION ASIA handles all student personal data in strict compliance with applicable international data privacy standards and Republic Act No. 10173 (Data Privacy Act of 2012). Your personal data will not be sold or shared with unauthorized third parties.

Your course completion records are maintained securely to facilitate license verification, employer queries, and training refresher reminders.`
                    },
                    {
                        title: "SURVEYS & FEEDBACK",
                        description: "You may receive optional course evaluation surveys from GWO or SKYLAR EDUCATION ASIA to help maintain top quality training standards. Participation is voluntary."
                    },
                    {
                        title: "CONTACT INFORMATION",
                        description: `At any time, you may contact us to:

o request access to your personal training records
o correct your personal details or WINDA ID
o make an inquiry about our privacy policy`
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
                description: "If you are dissatisfied with a service offered or treatment received by SKYLAR EDUCATION ASIA, then you have the right to lodge a complaint. In the event that you are dissatisfied with the outcome with your complaint, then you have the right to lodge an appeal. Please refer to the Complaints and Appeals Policy that is given to you upon enrolment via the student handbook."
            }
        }
    ] 
  },
  { 
    id: 'usi', 
    name: 'WINDA Registration', 
    lastUpdated: new Date().toISOString(), 
    sections: [
        {
            id: 'hero',
            label: 'Hero Section',
            type: 'hero',
            data: {
                heading: "GWO WINDA Registration Guide",
                description: "Your Global Identity for Certified Wind Industry Safety Training.",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1920"
            }
        },
        {
            id: 'intro',
            label: 'WINDA Introduction',
            type: 'content',
            data: {
                heading: "Global Wind Organisation (WINDA) ID",
                description: `All delegates completing GWO safety training courses are required to register for a WINDA ID prior to course completion. WINDA is the global database operated by the Global Wind Organisation.

Your WINDA ID creates a permanent, verified record of your completed GWO safety training modules that can be accessed and verified by wind energy employers worldwide.`
            }
        },
        {
            id: 'usi_accordions',
            label: 'WINDA Guide Accordions',
            type: 'accordion',
            data: {
                heading: "WINDA Help & Registration Guide",
                items: [
                    {
                        title: "WHAT IS A WINDA ID",
                        description: "A WINDA ID is a unique global identification number assigned to each delegate in the GWO database. It stores all your GWO training achievements, allowing employers, turbine manufacturers, and site operators to verify your safety certifications anywhere in the world."
                    },
                    {
                        title: "HOW TO GET A WINDA ID",
                        description: "1. Visit the official WINDA portal at winda.gwo.org.\n2. Click 'Register as Delegate' and complete the registration form with your valid email address.\n3. Verify your account via email and log in to retrieve your WINDA ID.\n4. Provide your WINDA ID to SKYLAR EDUCATION ASIA before or during your training course."
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
    if (p.id === 'home') {
      if (!p.sections.some(s => s.id === 'training_programs' || s.type === 'training-programs')) {
        const defaultTrainingSection: PageSection = {
            id: 'training_programs',
            label: 'Explore Training Programs',
            type: 'training-programs',
            data: {
                subheading: 'SPECIALIZED PATHWAYS',
                heading: 'Explore Our Training Programs',
                items: [
                    { 
                        title: 'Global Wind Organisation', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    },
                    { 
                        title: 'Construction & High Risk Work', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    },
                    { 
                        title: 'Specialised Rescue', 
                        description: 'Explore Pathway', 
                        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
                        buttonLink: '/courses'
                    }
                ]
            }
        };
        p.sections.splice(1, 0, defaultTrainingSection);
        migrated = true;
      }
      if (!p.sections.some(s => s.id === 'why_choose_us')) {
        const defaultWhyChooseSection: PageSection = {
            id: 'why_choose_us',
            label: 'Why Choose Us',
            type: 'features',
            data: {
                subheading: 'WHY CHOOSE US',
                heading: 'Why Train With SKYLAR EDUCATION ASIA?',
                description: 'We don\'t just tick boxes. We provide immersive, scenario-based training that prepares you for the real world. Our facilities replicate actual site conditions to ensure maximum readiness.',
                image: '/why-train-skylar.png',
                items: [
                    { 
                        title: 'Industry Specialist Trainers', 
                        description: 'Learn directly from certified wind energy and high-risk safety experts with extensive hands-on operational field experience.', 
                        icon: 'HardHat' 
                    },
                    { 
                        title: 'Industry-Specific Training Facilities', 
                        description: 'Purpose-built training environments replicating real-world wind industry work conditions.', 
                        icon: 'Target' 
                    },
                    { 
                        title: 'Internationally Recognised Qualifications', 
                        description: 'Gain GWO qualifications and safety certifications that are globally recognised and accepted across wind energy projects worldwide.', 
                        icon: 'Award' 
                    }
                ]
            }
        };
        p.sections.push(defaultWhyChooseSection);
        migrated = true;
      }
      p.sections.forEach(s => {
        if (s.id === 'why_choose_us' && s.data.items) {
          s.data.items.forEach((item: any) => {
            if (item.title === 'Industry Experienced Trainers') {
              item.title = 'Industry Specialist Trainers';
              item.description = 'Learn directly from certified wind energy and high-risk safety experts with extensive hands-on operational field experience.';
              migrated = true;
            }
            if (item.title === 'State-of-the-Art Facilities' || item.title === 'Industry-Specific Training Facilities') {
              item.title = 'Industry-Specific Training Facilities';
              item.description = 'Purpose-built training environments replicating real-world wind industry work conditions.';
              migrated = true;
            }
            if (item.title === 'Internationally Recognised' || item.title === 'Internationally Recognised Qualifications') {
              item.title = 'Internationally Recognised Qualifications';
              item.description = 'Gain GWO qualifications and safety certifications that are globally recognised and accepted across wind energy projects worldwide.';
              migrated = true;
            }
          });
        }
        if (s.id === 'enrolment_steps' && s.data.items) {
          s.data.items.forEach((item: any) => {
            if (item.title === 'Choose a Date' || item.title === 'Inquire Now') {
              item.title = 'Inquire Now';
              item.description = 'Submit your inquiry with your preferred date, location, and group details.';
              migrated = true;
            }
          });
        }
        if (s.id === 'accreditation' && s.data.items) {
          s.data.items.forEach((item: any) => {
            if (item.title === 'Experienced Instructors') {
              item.title = 'Wind Industry Specialists';
              item.description = 'Delivered by certified wind energy professionals with real-world field experience in onshore and offshore operations.';
              migrated = true;
            }
            if (item.title === 'GWO Standard Alignment' || item.title === 'International GWO Standards') {
              item.title = 'International GWO Standards';
              item.description = 'Training aligned with Internationally Recognised Global Wind Organisation (GWO) standards.';
              migrated = true;
            }
          });
        }
        if (s.id === 'stats') {
          s.data.heading = "Operational Highlights";
          s.data.description = "SKYLAR EDUCATION ASIA provides certified, GWO-aligned safety training with flexible delivery options across the Philippines and client sites.";
          s.data.items = [
            { title: "1", subtitle: "Training Centre", description: "Angeles City, Pampanga", icon: "MapPin" },
            { title: "Nationwide", subtitle: "Training Delivery", description: "Client Site Delivery Available", icon: "Globe" },
            { title: "International", subtitle: "Training Standards", description: "GWO-Aligned Training", icon: "Award" }
          ];
          migrated = true;
        }
      });
    }
    if (p.id === 'locations') {
      p.sections.forEach(s => {
        if (s.id === 'hero' && (s.data.image?.includes('photo-1486406146926') || s.data.image?.includes('photo-1486325212027'))) {
          s.data.image = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920";
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
          { id: 'iKbxm6RedwQ7l7piWwZkYT6XnR13', name: 'Super Admin', email: 'admin@gmail.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
          { id: 'admin1', name: 'System Admin', email: 'admin@skylareducation.asia', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
          { id: 'admin2', name: 'Super Admin', email: 'admin@skylar.com.ph', role: 'Super Admin', status: 'Active', lastActive: 'Just now' }
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
  }
  // Enforce Maven Pro font always
  theme.fontHeading = "'Maven Pro', sans-serif";
  theme.fontSans = "'Maven Pro', sans-serif";
  return theme;
};

export const saveThemeSettings = (theme: ThemeSettings) => {
  theme.fontHeading = "'Maven Pro', sans-serif";
  theme.fontSans = "'Maven Pro', sans-serif";
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

export const deleteSection = (id: string) => {
    const sections = getSections().filter(s => s.id !== id);
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

// --- Firebase Initialization & Seeding ---
export const initializeFirebase = async (): Promise<void> => {
  try {
    const data = await firebaseClient.getAll();
    const dbKeys = new Set(Object.keys(data));
    
    // 1. Populate what we got from Firebase
    Object.entries(data).forEach(([key, item]: [string, any]) => {
      if (item.value) {
        localStorage.setItem(key, JSON.stringify(item.value));
      }
    });

    // 2. Seed default values in Firebase if they are missing
    if (!dbKeys.has(COURSES_KEY)) {
      const courses = getCourses();
      await firebaseClient.upsert(COURSES_KEY, { value: courses });
    }
    if (!dbKeys.has(SITE_PAGES_KEY)) {
      const pages = getSitePages();
      await firebaseClient.upsert(SITE_PAGES_KEY, { value: pages });
    }
    if (!dbKeys.has(TRAINERS_KEY)) {
      const trainers = getTrainers();
      await firebaseClient.upsert(TRAINERS_KEY, { value: trainers });
    }
    if (!dbKeys.has(ROLES_KEY)) {
      const roles = getRoles();
      await firebaseClient.upsert(ROLES_KEY, { value: roles });
    }
    if (!dbKeys.has(ADMIN_USERS_KEY)) {
      const admins = getAdminUsers();
      await firebaseClient.upsert(ADMIN_USERS_KEY, { value: admins });
    }
    if (!dbKeys.has(THEME_KEY)) {
      const theme = getThemeSettings();
      await firebaseClient.upsert(THEME_KEY, { value: theme });
    }
    if (!dbKeys.has(SETTINGS_KEY)) {
      const settings = getSettings();
      await firebaseClient.upsert(SETTINGS_KEY, { value: settings });
    }

    // 3. Real-Time Live Data Sync Listener
    firebaseClient.subscribeToCollection('data', (items) => {
      items.forEach((item) => {
        if (item.id && item.value) {
          localStorage.setItem(item.id, JSON.stringify(item.value));
        }
      });
      window.dispatchEvent(new Event('themeUpdated'));
      window.dispatchEvent(new Event('cartUpdated'));
    });
  } catch (error) {
    // Firebase unavailable — app runs entirely from localStorage
  }
};

const INQUIRIES_KEY = 'apex_inquiries_data_v1';
const SMTP_KEY = 'apex_smtp_settings_v1';
const EMAIL_LOGS_KEY = 'apex_email_logs_v1';

// --- Inquiries Management ---
export const getInquiries = (): CourseInquiry[] => {
  const stored = localStorage.getItem(INQUIRIES_KEY);
  if (!stored) {
    const seed: CourseInquiry[] = [
      {
        id: 'inq-1',
        referenceCode: 'INQ-2026-9481',
        studentName: 'Juan Dela Cruz',
        email: 'juan.delacruz@example.ph',
        phone: '+63 917 123 4567',
        company: 'Philippine Wind Energy Corp',
        courseId: 'gwo-bst',
        courseTitle: 'GWO Basic Safety Training (BST)',
        location: 'Pampanga Facility',
        preferredDate: '2026-08-15',
        participantsCount: '5 participants',
        message: 'Requesting quotation for corporate group BST initial certification.',
        status: 'New',
        notes: 'Priority corporate inquiry.',
        createdAt: '2026-07-28T10:30:00Z',
        updatedAt: '2026-07-28T10:30:00Z'
      },
      {
        id: 'inq-2',
        referenceCode: 'INQ-2026-8320',
        studentName: 'Maria Santos',
        email: 'maria.santos@techwind.com',
        phone: '+63 918 987 6543',
        company: 'TechWind Renewables',
        courseId: 'gwo-art',
        courseTitle: 'GWO Advanced Rescue Training (ART)',
        location: 'Manila Safety Center',
        preferredDate: '2026-08-20',
        participantsCount: '2 participants',
        message: 'Checking availability for ART refresher module.',
        status: 'Contacted',
        notes: 'Called customer on July 28. Quotation sent via email.',
        createdAt: '2026-07-27T14:15:00Z',
        updatedAt: '2026-07-28T09:00:00Z'
      }
    ];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

export const saveInquiry = (inquiry: CourseInquiry) => {
  const inquiries = getInquiries();
  const index = inquiries.findIndex(i => i.id === inquiry.id);
  if (index >= 0) {
    inquiries[index] = inquiry;
  } else {
    inquiries.unshift(inquiry);
  }
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  window.dispatchEvent(new Event('inquiriesUpdated'));
};

export const updateInquiryStatus = (id: string, status: CourseInquiry['status'], notes?: string) => {
  const inquiries = getInquiries();
  const inquiry = inquiries.find(i => i.id === id);
  if (inquiry) {
    inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;
    inquiry.updatedAt = new Date().toISOString();
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new Event('inquiriesUpdated'));
  }
};

export const deleteInquiry = (id: string) => {
  const inquiries = getInquiries().filter(i => i.id !== id);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  window.dispatchEvent(new Event('inquiriesUpdated'));
};

// --- SMTP & Email Log Management ---
export const getSmtpSettings = (): SmtpSettings => {
  const stored = localStorage.getItem(SMTP_KEY);
  if (!stored) {
    const seed: SmtpSettings = {
      host: 'smtp.gmail.com',
      port: 587,
      username: 'smtp@skylaredasia.ph',
      password: '••••••••••••',
      fromEmail: 'inquiries@skylaredasia.ph',
      fromName: 'SKYLAR EDUCATION ASIA Admissions',
      enableSsl: true,
      enableNotifications: true,
      adminNotificationEmail: 'admissions@skylaredasia.ph'
    };
    localStorage.setItem(SMTP_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

export const saveSmtpSettings = (settings: SmtpSettings) => {
  localStorage.setItem(SMTP_KEY, JSON.stringify(settings));
};

export const getEmailLogs = (): EmailLog[] => {
  const stored = localStorage.getItem(EMAIL_LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addEmailLog = (log: EmailLog) => {
  const logs = getEmailLogs();
  logs.unshift(log);
  localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
};

// --- Testimonials & Google Reviews Management ---
const TESTIMONIALS_KEY = 'apex_testimonials_data_v1';
const GOOGLE_SETTINGS_KEY = 'apex_google_review_settings_v1';

export const getTestimonials = (): Testimonial[] => {
  const stored = localStorage.getItem(TESTIMONIALS_KEY);
  if (!stored) {
    const seed: Testimonial[] = [
      {
        id: 't-g1',
        name: 'Jerome Villareal',
        role: 'Offshore Wind Field Specialist',
        content: 'Completed the GWO Basic Safety Training at Angeles City centre. Facilities are top tier and instructors have actual offshore turbine experience. Highly recommended!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        source: 'Google',
        status: 'Approved',
        isFeatured: true,
        date: '2026-07-20',
        googleReviewId: 'g-rev-101',
        locationName: 'SKYLAR EDUCATION ASIA - Angeles City'
      },
      {
        id: 't-g2',
        name: 'Capt. Eduardo Santos',
        role: 'Marine Operations Manager',
        content: 'Enrolled our corporate team for GWO ART & Working at Heights. Seamless booking and world-class safety modules.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        source: 'Google',
        status: 'Approved',
        isFeatured: true,
        date: '2026-07-15',
        googleReviewId: 'g-rev-102',
        locationName: 'Angeles City Training Centre'
      },
      {
        id: 't1',
        name: 'James Wilson',
        role: 'Wind Turbine Technician',
        content: 'The GWO training at SKYLAR EDUCATION ASIA was exceptional. The simulators are exactly like what we use offshore.',
        avatar: 'https://i.pravatar.cc/150?img=11',
        rating: 5,
        source: 'Google',
        status: 'Approved',
        isFeatured: true,
        date: '2026-07-02'
      },
      {
        id: 't2',
        name: 'Sarah Chen',
        role: 'Safety Officer',
        content: 'Excellent facilities and knowledgeable trainers. Highly recommended for industrial safety training.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        source: 'Google',
        status: 'Approved',
        isFeatured: true,
        date: '2026-06-28'
      },
      {
        id: 't3',
        name: 'Michael Rodriguez',
        role: 'Site Supervisor',
        content: 'The hands-on approach really helped our team understand the critical safety procedures effectively.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        source: 'Website',
        status: 'Approved',
        isFeatured: false,
        date: '2026-06-15'
      },
      {
        id: 't4',
        name: 'Emma Thompson',
        role: 'Renewable Energy Engineer',
        content: 'A world-class training center. The instruction quality is on par with the best international standards.',
        avatar: 'https://i.pravatar.cc/150?img=9',
        rating: 5,
        source: 'Website',
        status: 'Approved',
        isFeatured: true,
        date: '2026-05-30'
      }
    ];
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

export const saveTestimonial = (testimonial: Testimonial) => {
  const list = getTestimonials();
  const index = list.findIndex(t => t.id === testimonial.id);
  if (index >= 0) {
    list[index] = testimonial;
  } else {
    list.unshift(testimonial);
  }
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('testimonialsUpdated'));
};

export const deleteTestimonial = (id: string) => {
  const list = getTestimonials().filter(t => t.id !== id);
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('testimonialsUpdated'));
};

export const toggleTestimonialStatus = (id: string) => {
  const list = getTestimonials();
  const item = list.find(t => t.id === id);
  if (item) {
    item.status = item.status === 'Approved' ? 'Hidden' : 'Approved';
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('testimonialsUpdated'));
  }
};

export const toggleTestimonialFeatured = (id: string) => {
  const list = getTestimonials();
  const item = list.find(t => t.id === id);
  if (item) {
    item.isFeatured = !item.isFeatured;
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('testimonialsUpdated'));
  }
};

export const getGoogleReviewSettings = (): GoogleReviewSettings => {
  const stored = localStorage.getItem(GOOGLE_SETTINGS_KEY);
  if (!stored) {
    const seed: GoogleReviewSettings = {
      apiKey: '',
      placeId: 'ChIJzX4...SKYLAR_PH_PLACE_ID',
      autoSync: true,
      minimumRating: 4,
      lastSyncedAt: new Date().toISOString()
    };
    localStorage.setItem(GOOGLE_SETTINGS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

export const saveGoogleReviewSettings = (settings: GoogleReviewSettings) => {
  localStorage.setItem(GOOGLE_SETTINGS_KEY, JSON.stringify(settings));
};

export const syncGoogleReviews = async (): Promise<{ count: number; message: string }> => {
  const settings = getGoogleReviewSettings();
  const currentList = getTestimonials();
  
  // Simulated Google Places API sync with high rating filter
  const googleSeedReviews: Testimonial[] = [
    {
      id: `g_synced_${Date.now()}_1`,
      name: 'Ramon Garcia',
      role: 'Renewable Plant Technician',
      content: '5-star GWO training in Pampanga! Practical simulations for Working at Heights and First Aid were thoroughly executed by instructor Mark.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      source: 'Google',
      status: 'Approved',
      isFeatured: true,
      date: new Date().toISOString().split('T')[0],
      googleReviewId: `g_place_${Date.now()}_1`,
      locationName: 'Angeles City Training Centre'
    },
    {
      id: `g_synced_${Date.now()}_2`,
      name: 'Liezel De Guzman',
      role: 'HSE Coordinator',
      content: 'Enrolled 8 delegates for GWO Manual Handling and Fire Awareness. Very smooth administrative process and prompt response time.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      source: 'Google',
      status: 'Approved',
      isFeatured: true,
      date: new Date().toISOString().split('T')[0],
      googleReviewId: `g_place_${Date.now()}_2`,
      locationName: 'SKYLAR EDUCATION ASIA'
    }
  ];

  let addedCount = 0;
  googleSeedReviews.forEach(rev => {
    if (!currentList.some(t => t.name === rev.name || (t.googleReviewId && t.googleReviewId === rev.googleReviewId))) {
      currentList.unshift(rev);
      addedCount++;
    }
  });

  settings.lastSyncedAt = new Date().toISOString();
  saveGoogleReviewSettings(settings);
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(currentList));
  window.dispatchEvent(new Event('testimonialsUpdated'));

  return {
    count: addedCount,
    message: addedCount > 0 ? `Successfully synced ${addedCount} new Google Reviews!` : 'Google Reviews up to date.'
  };
};


