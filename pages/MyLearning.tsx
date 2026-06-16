
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CourseCard } from '../components/CourseCard';
import { getSavedCourseIds, getRecentCourseIds, getCourses } from '../services/storageService';
import { Course } from '../types';
import { BookOpen, History, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const MyLearning: React.FC = () => {
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Hydrate data
    const allCourses = getCourses();
    const savedIds = getSavedCourseIds();
    const recentIds = getRecentCourseIds();

    setSavedCourses(allCourses.filter(c => savedIds.includes(c.id)));
    // Preserve order for recent
    const recent = recentIds.map(id => allCourses.find(c => c.id === id)).filter(Boolean) as Course[];
    setRecentCourses(recent);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Breadcrumbs />
      
      <div className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-gray-300">Track your favorite courses and history.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-16">
        
        {/* Saved Courses Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="text-red-500 w-6 h-6 fill-current" />
            <h2 className="text-2xl font-bold text-secondary">Saved Courses</h2>
          </div>
          
          {savedCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-500 mb-4">You haven't saved any courses yet.</p>
              <Link to="/courses"><Button>Browse Courses</Button></Link>
            </div>
          )}
        </section>

        {/* Recently Viewed Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <History className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-secondary">Recently Viewed</h2>
          </div>
          
          {recentCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCourses.map(course => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <img src={course.image} alt={course.title} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="p-4">
                      <div className="text-xs font-bold text-accent uppercase mb-1">{course.category}</div>
                      <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No viewing history yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};
