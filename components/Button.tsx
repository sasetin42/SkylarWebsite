
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
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 rounded-xl focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-900 text-white hover:to-primary shadow-lg hover:shadow-primary/40 border border-transparent focus:ring-primary/30 hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-accent to-yellow-400 text-secondary hover:to-accent shadow-lg hover:shadow-accent/40 border border-transparent focus:ring-accent/30 hover:-translate-y-0.5",
    outline: "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-gray-50 focus:ring-gray-200 shadow-sm hover:shadow-md",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-100/50 hover:shadow-sm",
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
