import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-surface">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
        <Compass size={80} className="text-primary relative z-10" />
      </div>
      <h1 className="text-6xl font-heading font-bold text-secondary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home size={18} /> Home
          </Button>
        </Link>
        <Link to="/courses">
            <Button className="flex items-center gap-2">
                <ArrowLeft size={18} /> View Courses
            </Button>
        </Link>
      </div>
    </div>
  );
};