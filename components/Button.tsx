
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 rounded-xl focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#FFC107] text-[#041024] font-bold hover:bg-[#e5ac06] shadow-lg hover:shadow-amber-500/20 border border-amber-400/40 focus:ring-amber-400/30 hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-accent to-yellow-400 text-secondary hover:to-accent shadow-lg hover:shadow-accent/40 border border-transparent focus:ring-accent/30 hover:-translate-y-0.5",
    outline: "bg-white/90 dark:bg-slate-800/90 border border-gray-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold hover:border-amber-400 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-700/80 focus:ring-amber-400/20 shadow-sm hover:shadow-md",
    ghost: "text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:shadow-sm",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/30 focus:ring-red-500/30",
    glass: "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-secondary shadow-lg hover:shadow-white/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
