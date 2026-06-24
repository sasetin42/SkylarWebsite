
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
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
import { getThemeSettings, getPageContent, initializeSupabase, getSettings } from './services/storageService';
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
      // 1. Get Global Theme and Institute Settings
      const globalTheme = getThemeSettings();
      const settings = getSettings();
      
      // 2. Determine Current Page & Check for Overrides
      const pageId = getPageIdFromPath(location.pathname);
      const pageContent = getPageContent(pageId);
      
      // 3. Merge: Page Overrides take precedence
      const activeTheme: ThemeSettings = {
        ...globalTheme,
        ...(pageContent?.themeOverrides || {})
      };

      // Apply primary brand color override from settings if present
      if (settings.brandColor) {
        activeTheme.colorPrimary = settings.brandColor;
      }
      if (settings.accentColor) {
        activeTheme.colorAccent = settings.accentColor;
      }
      if (settings.borderRadius !== undefined) {
        activeTheme.borderRadius = settings.borderRadius;
      }

      // Apply Font Customization
      if (settings.fontFamily) {
        if (settings.fontFamily === 'Outfit') {
          activeTheme.fontSans = "'Outfit', sans-serif";
          activeTheme.fontHeading = "'Outfit', sans-serif";
        } else if (settings.fontFamily === 'Poppins') {
          activeTheme.fontSans = "'Poppins', sans-serif";
          activeTheme.fontHeading = "'Poppins', sans-serif";
        } else if (settings.fontFamily === 'Montserrat') {
          activeTheme.fontSans = "'Montserrat', sans-serif";
          activeTheme.fontHeading = "'Montserrat', sans-serif";
        } else if (settings.fontFamily === 'System') {
          activeTheme.fontSans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          activeTheme.fontHeading = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        }
      }

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

      // Apply custom user CSS
      let styleTag = document.getElementById('dynamic-css-overrides') as HTMLStyleElement;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-css-overrides';
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = settings.customCss || '';

      // 5. Update Favicon dynamically (completely replace elements to force browser tab refresh)
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(el => el.parentNode?.removeChild(el));

      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.faviconUrl || '/favicon.ico';
      document.head.appendChild(link);
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
    const settings = getSettings();
    const logoSrc = settings.loadingLogoUrl || settings.lightLogoUrl || "/skylar-logo.svg";
    const hasCustomLogo = !!(settings.loadingLogoUrl || settings.lightLogoUrl);

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#192436',
        color: '#ffffff',
        fontFamily: "'Maven Pro', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 193, 7, 0.05)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          background: 'rgba(11, 30, 54, 0.5)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}></div>

        {/* Content Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          textAlign: 'center',
          padding: '20px'
        }}>
          {/* Logo with optional white filter */}
          <img
            src={logoSrc}
            alt="Skylar Education"
            style={{
              height: '56px',
              width: 'auto',
              marginBottom: '24px',
              filter: hasCustomLogo ? 'none' : 'brightness(0) invert(1)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />

          {/* Spinner */}
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.08)',
            borderTopColor: '#FFC107',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '24px'
          }}></div>

          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            color: '#ffffff',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            Skylar Education Asia
          </h2>
          
          <p style={{
            fontSize: '0.85rem',
            color: '#8fa0b5',
            marginTop: '10px',
            letterSpacing: '0.05em'
          }}>
            Connecting to database...
          </p>
        </div>

        {/* Legal/Detail Footer */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.3)',
          letterSpacing: '0.05em',
          textAlign: 'center',
          width: '100%'
        }}>
          RTO #45000 &nbsp;|&nbsp; ISO 9001 Certified
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .7; }
          }
        `}</style>
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
