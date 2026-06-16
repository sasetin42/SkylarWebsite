
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { LOGO_URL } from '../../constants';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@skylareducation.asia');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@skylareducation.asia' && password === 'admin') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@skylareducation.asia / admin');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 font-sans">
      {/* Left Column: Enhanced Background Image with Overlay */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background Image — industrial/safety training */}
        <img
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920"
          alt="Safety Training Facility"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-secondary/80 to-slate-900/70 z-10" />
        {/* Accent color glow from bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-accent/20 rounded-full blur-[120px] z-10" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 z-10 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content */}
        <div className="relative z-30 flex flex-col justify-between p-14 h-full text-white">
          {/* Back to Home */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity w-fit group">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors border border-white/10">
              <ArrowLeft size={18} />
            </div>
            <span className="font-semibold text-sm tracking-wide text-white/80 group-hover:text-white transition-colors">Back to Home</span>
          </Link>

          {/* Main Content */}
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8 w-fit hover:opacity-90 transition-opacity" title="Return Home">
              <img
                src={LOGO_URL}
                alt="Skylar Education"
                className="h-14 w-auto"
              />
              <div>
                <p className="font-heading font-bold text-xl leading-none text-white">Skylar</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Education Asia</p>
              </div>
            </Link>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-accent/20 border border-accent/30 rounded-lg">
                <ShieldCheck className="text-accent" size={20} />
              </div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest">Admin Portal</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl xl:text-5xl font-bold mb-5 leading-tight">
              Managing<br />
              <span className="text-accent">Excellence</span> in<br />
              Safety Training.
            </h2>

            {/* Sub-description */}
            <p className="text-gray-300 text-base max-w-sm leading-relaxed border-l-4 border-accent pl-5">
              Skylar Education Asia Inc. Admin Portal. Managing course operations, student records, and compliance for the Philippines.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Students Trained</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">GWO</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Certified Courses</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-accent">ISO</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">9001 Certified</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/30">
            &copy; 2026 Skylar Education Asia Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Column: Glassmorphism Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden bg-slate-900">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile: Back to Home */}
          <Link to="/" className="lg:hidden flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-8 w-fit">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Subtle Gradient Border Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-2 font-heading">Welcome Back</h3>
              <p className="text-slate-400">Please sign in to your admin account</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-8 text-center backdrop-blur-sm animate-fade-in flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-accent transition-colors w-5 h-5" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-600 shadow-inner"
                    placeholder="admin@skylareducation.asia"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-accent transition-colors w-5 h-5" />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-white placeholder-slate-600 shadow-inner"
                    placeholder="•••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-400 cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" className="mr-2 w-4 h-4 rounded bg-slate-800 border-white/10 text-accent focus:ring-offset-slate-900 focus:ring-accent" />
                  Remember me
                </label>
                <a href="#" className="text-accent hover:text-yellow-300 transition-colors font-medium">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-accent to-yellow-500 hover:to-yellow-400 text-secondary font-bold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all transform hover:-translate-y-1 active:scale-95 text-lg tracking-wide"
              >
                Sign In to Dashboard
              </button>
            </form>
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-slate-500 text-xs">
              Protected by reCAPTCHA and Subject to the{' '}
              <Link
                to="/privacy-policy"
                className="text-slate-400 hover:text-accent underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link
                to="/terms-of-service"
                className="text-slate-400 hover:text-accent underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};