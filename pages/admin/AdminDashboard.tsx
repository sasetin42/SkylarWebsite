import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { 
  Users, BookOpen, DollarSign, TrendingUp, 
  Settings, LogOut, LayoutDashboard, FileText, Bell, 
  Database, Briefcase, Calendar, Moon, Sun, ShieldCheck,
  LayoutTemplate, ClipboardList, Search, Menu, MessageSquare
} from 'lucide-react';
import { getStudents, getCourses, getSettings } from '../../services/storageService';
import { LOGO_URL } from '../../constants';

// Type for Outlet context
type DashboardContextType = {
  isDarkMode: boolean;
};

export function useDashboardContext() {
  return useOutletContext<DashboardContextType>();
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Mock Notifications Data with Links
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'New student enrollment',
      description: 'Juan Dela Cruz - GWO Basic Safety',
      type: 'info',
      link: '/admin/dashboard/enrollments',
      isRead: false
    },
    {
      id: 'n2',
      title: 'Compliance Audit Warning',
      description: 'Trainer certs expiring',
      type: 'warning',
      link: '/admin/dashboard/compliance',
      isRead: false
    }
  ]);

  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener('themeUpdated', handleUpdate);
    return () => window.removeEventListener('themeUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  // Handle auto-closing sidebar on mobile route change
  useEffect(() => {
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  const handleNotificationClick = (link: string) => {
    setNotificationOpen(false);
    navigate(link);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/dashboard/enrollments', icon: ClipboardList, label: 'Enrollments' },
    { path: '/admin/dashboard/students', icon: Users, label: 'Students' },
    { path: '/admin/dashboard/classes', icon: Users, label: 'Classes & Sections' }, 
    { path: '/admin/dashboard/courses', icon: BookOpen, label: 'Courses' },
    { path: '/admin/dashboard/sessions', icon: Calendar, label: 'Sessions' },
    { path: '/admin/dashboard/finance', icon: DollarSign, label: 'Finance & Billing' }, 
    { path: '/admin/dashboard/corporate', icon: Briefcase, label: 'Corporate' },
    { path: '/admin/dashboard/support', icon: MessageSquare, label: 'Support & Tickets' }, 
    { path: '/admin/dashboard/compliance', icon: ShieldCheck, label: 'Compliance' },
    { path: '/admin/dashboard/content', icon: LayoutTemplate, label: 'Website Content' },
    { path: '/admin/dashboard/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isOverview = location.pathname === '/admin/dashboard';

  // Apply 'dark' class to a wrapper to enable Tailwind dark mode for children
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen flex transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setSidebarOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed md:relative z-30 h-full transition-all duration-300 ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'} bg-secondary dark:bg-gray-800 text-white shadow-2xl flex flex-col border-r border-white/5 dark:border-gray-700`}
        >
          <div className={`flex items-center transition-all duration-300 border-b border-white/10 dark:border-gray-700 ${sidebarOpen ? 'justify-start pl-8 pr-6 py-6' : 'justify-center p-4'}`}>
            <img 
              src={sidebarOpen ? (settings.lightLogoUrl || settings.darkLogoUrl || LOGO_URL) : (settings.faviconUrl || settings.lightLogoUrl || settings.darkLogoUrl || LOGO_URL)} 
              alt="Logo" 
              className={`transition-all duration-300 ${sidebarOpen ? 'h-11 w-auto max-w-full' : 'h-8 w-8 object-contain'} ${
                !(sidebarOpen ? settings.lightLogoUrl : (settings.faviconUrl || settings.lightLogoUrl))
                  ? 'brightness-0 invert'
                  : ''
              }`} 
            />
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {menuItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                title={!sidebarOpen ? item.label : ''}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={22} className={`shrink-0 ${location.pathname === item.path ? 'text-accent' : ''}`} /> 
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                  {item.label}
                </span>
                {location.pathname === item.path && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,193,7,0.8)]"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 dark:border-gray-700">
            <button 
              onClick={handleLogout} 
              className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut size={22} />
              <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'}`}>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-100 dark:bg-gray-900 transition-colors duration-300 w-full">
          
          {/* Top Header */}
          <header className="mx-4 md:mx-6 mt-4 md:mt-6 mb-2 rounded-2xl shadow-sm border border-white/50 dark:border-gray-700 px-4 md:px-6 py-4 flex justify-between items-center z-20 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md transition-colors duration-300">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                <Menu size={20} />
              </button>
              <h2 className="text-lg md:text-xl font-bold capitalize text-gray-800 dark:text-white font-heading truncate max-w-[150px] md:max-w-none">
                  {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 border border-transparent focus-within:border-primary/50 dark:focus-within:border-accent/50 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all shadow-inner">
                  <Search size={16} className="text-gray-400 dark:text-gray-500" />
                  <input 
                      type="text" 
                      id="admin-search"
                      name="adminSearch"
                      autocomplete="off"
                      placeholder="Quick search..." 
                      className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                  />
              </div>

              <div className="flex items-center gap-3">
                  <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className="p-2.5 rounded-full transition-all bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-yellow-400 shadow-sm"
                  title="Toggle Dark Mode"
                  >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  <div className="relative">
                  <button 
                      className="p-2.5 rounded-full transition-all bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 shadow-sm"
                      onClick={() => setNotificationOpen(!notificationOpen)}
                  >
                      <Bell size={18} className={notificationOpen ? 'text-primary dark:text-accent' : ''} />
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
                  </button>
                  {notificationOpen && (
                      <div className="absolute right-0 mt-4 w-80 rounded-2xl shadow-xl border p-0 z-50 overflow-hidden animate-fade-in-down bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Notifications</h4>
                      </div>
                      <ul className="max-h-64 overflow-y-auto">
                          {notifications.map(notification => (
                            <li 
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification.link)}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors"
                            >
                              <div className="flex gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                  <div>
                                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.title}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.description}</p>
                                  </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                      </div>
                  )}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white dark:border-gray-700 ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                      A
                  </div>
              </div>
            </div>
          </header>

          {/* Content Viewport */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 custom-scrollbar">
            {isOverview ? (
              <DashboardOverview />
            ) : (
              <div className="animate-fade-in-up">
                  <Outlet context={{ isDarkMode }} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const students = getStudents();
  const courses = getCourses();

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : color === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                    {trend} <TrendingUp size={12} className="ml-1" />
                </span>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-heading font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={students.length} icon={Users} color="blue" trend="+12%" />
        <StatCard label="Active Courses" value={courses.filter(c => c.level !== 'Coming Soon').length} icon={BookOpen} color="orange" />
        <StatCard label="Revenue (YTD)" value="$1.2M" icon={DollarSign} color="green" trend="+8.5%" />
        <StatCard label="Course Completion" value="94%" icon={TrendingUp} color="purple" trend="+2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 p-8 rounded-3xl shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white">Enrollment Activity</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-2 min-w-[500px]">
                {[35, 55, 40, 70, 50, 85, 60, 90, 75, 65, 80, 95].map((h, i) => (
                    <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-xl relative group">
                        <div 
                            className="absolute bottom-0 w-full bg-primary dark:bg-accent rounded-t-xl transition-all duration-700 ease-out group-hover:bg-accent dark:group-hover:bg-white" 
                            style={{height: `${h}%`}}
                        ></div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                            {h} Students
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider min-w-[500px]">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
        </div>

        {/* Side Widget */}
        <div className="p-8 rounded-3xl shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 dark:text-white"><ShieldCheck size={20} className="text-red-500"/> Compliance & Alerts</h3>
            <div className="space-y-4">
               <Link to="/admin/dashboard/compliance" className="block p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-red-700 dark:text-red-400 text-sm">Trainer Qualifications</span>
                    <span className="text-xs bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">High</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-300 mb-3">Pending certifications for new trainers.</p>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline">Review Details</span>
               </Link>

               <Link to="/admin/dashboard/enrollments" className="block p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">Pending Enrollments</span>
                    <span className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Info</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">5 New applications require review.</p>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline">View Enrollments</span>
               </Link>
            </div>
        </div>
      </div>
    </div>
  );
};