
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { About } from './pages/About';
import { GWOBenefits } from './pages/GWOBenefits';
import { Team } from './pages/Team';
import { Locations } from './pages/Locations';
import { LocationDetail } from './pages/LocationDetail';
import { StudentInfo } from './pages/StudentInfo';
import { OnlineEnrolments } from './pages/OnlineEnrolments';
import { USIInfo } from './pages/USIInfo';
import { RefundPolicy } from './pages/RefundPolicy';
import { PrivacyNotice } from './pages/PrivacyNotice';
import { Complaints } from './pages/Complaints';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { TermsOfService } from './pages/TermsOfService';
import { GeminiChat } from './components/GeminiChat';
import { MyLearning } from './pages/MyLearning';
import { Checkout } from './pages/Checkout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DataMigration } from './pages/admin/DataMigration';
import { StudentManager } from './pages/admin/StudentManager';
import { CourseManager } from './pages/admin/CourseManager';
import { CorporateManager } from './pages/admin/CorporateManager';
import { SessionManager } from './pages/admin/SessionManager';
import { ComplianceManager } from './pages/admin/ComplianceManager';
import { ReportManager } from './pages/admin/ReportManager';
import { SettingsManager } from './pages/admin/SettingsManager';
import { WebsiteManager } from './pages/admin/WebsiteManager';
import { EnrollmentManager } from './pages/admin/EnrollmentManager';
import { FinanceManager } from './pages/admin/FinanceManager'; // New
import { SectionManager } from './pages/admin/SectionManager'; // New
import { SupportManager } from './pages/admin/SupportManager'; // New
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './pages/NotFound';
import { getThemeSettings, getPageContent, initializeSupabase } from './services/storageService';
import { ThemeSettings } from './types';

// Helper to map route paths to CMS Page IDs
const getPageIdFromPath = (path: string): string => {
  const p = path.toLowerCase();
  if (p === '/' || p === '') return 'home';
  if (p.startsWith('/about')) return 'about';
  if (p.startsWith('/courses')) return 'courses';
  if (p.startsWith('/locations')) return 'locations';
  if (p.startsWith('/news')) return 'news';
  if (p.startsWith('/student-info')) return 'student-info';
  if (p.startsWith('/contact')) return 'contact';
  if (p.startsWith('/faq')) return 'faq';
  return 'home'; // Default fallback
};

const ThemeEngine: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const applyTheme = () => {
      // 1. Get Global Theme
      const globalTheme = getThemeSettings();
      
      // 2. Determine Current Page & Check for Overrides
      const pageId = getPageIdFromPath(location.pathname);
      const pageContent = getPageContent(pageId);
      
      // 3. Merge: Page Overrides take precedence
      const activeTheme: ThemeSettings = {
        ...globalTheme,
        ...(pageContent?.themeOverrides || {})
      };

      // 4. Apply to DOM
      const root = document.documentElement;
      root.style.setProperty('--color-primary', activeTheme.colorPrimary);
      root.style.setProperty('--color-secondary', activeTheme.colorSecondary);
      root.style.setProperty('--color-accent', activeTheme.colorAccent);
      root.style.setProperty('--color-surface', activeTheme.colorSurface);
      root.style.setProperty('--font-sans', activeTheme.fontSans);
      root.style.setProperty('--font-heading', activeTheme.fontHeading);
      root.style.setProperty('--radius-base', `${activeTheme.borderRadius}px`);
      root.style.setProperty('--font-size-base', `${activeTheme.baseFontSize}px`);
    };

    applyTheme();

    // Re-apply if admin settings change
    window.addEventListener('themeUpdated', applyTheme);
    return () => window.removeEventListener('themeUpdated', applyTheme);
  }, [location.pathname]);

  return null; // Logic only component
};

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const p = location.pathname;

  // Pages that manage their own top-padding internally (have premium hero sections with pt-[80px])
  const hasSelfPaddedHero = 
    p === '/' ||
    p.startsWith('/courses') ||
    p.startsWith('/about') ||
    p.startsWith('/news') ||
    p.startsWith('/contact') ||
    p.startsWith('/faq') ||
    p.startsWith('/locations') ||
    p.startsWith('/gwo-benefits') ||
    p.startsWith('/team');

  return (
    <div className="flex flex-col min-h-screen">
      <ThemeEngine />
      <Navbar />
      <main id="main-content" className={`flex-grow ${hasSelfPaddedHero ? '' : 'pt-[80px]'}`}>
        <Outlet />
      </main>
      <Footer />
      <GeminiChat />
      <ScrollToTop />
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeSupabase();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
        // Apply theme immediately after data load
        window.dispatchEvent(new Event('themeUpdated'));
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b1e36',
        color: '#ffffff',
        fontFamily: "'Maven Pro', sans-serif"
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#FFC107',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: '#f4f7fb', margin: 0 }}>
          SKYLAR EDUCATION ASIA
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#8fa0b5', marginTop: '8px' }}>
          Connecting to database...
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="font-sans text-gray-900">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/gwo-benefits" element={<GWOBenefits />} />
              <Route path="/about/team" element={<Team />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:id" element={<LocationDetail />} />
              <Route path="/news" element={<Blog />} />
              <Route path="/student-info" element={<StudentInfo />} />
              <Route path="/student-info/online-enrolments" element={<OnlineEnrolments />} />
              <Route path="/student-info/refund-policy" element={<RefundPolicy />} />
              <Route path="/student-info/privacy-notice" element={<PrivacyNotice />} />
              <Route path="/student-info/usi" element={<USIInfo />} />
              <Route path="/student-info/complaints" element={<Complaints />} />
              <Route path="/student-info/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyNotice />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes - No Navbar/Footer */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              {/* Nested Admin Routes */}
              <Route path="content" element={<WebsiteManager />} />
              <Route path="enrollments" element={<EnrollmentManager />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="courses" element={<CourseManager />} />
              <Route path="migration" element={<DataMigration />} />
              <Route path="corporate" element={<CorporateManager />} />
              <Route path="sessions" element={<SessionManager />} />
              <Route path="compliance" element={<ComplianceManager />} />
              <Route path="reports" element={<ReportManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="finance" element={<FinanceManager />} />
              <Route path="classes" element={<SectionManager />} />
              <Route path="support" element={<SupportManager />} />
              <Route path="*" element={<div className="p-8 text-gray-500">Module under construction</div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
