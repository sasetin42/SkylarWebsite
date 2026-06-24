
import React, { useState, useEffect } from 'react';
import { Layers, Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { getSections, saveSection, getCourses } from '../../services/storageService';
import { SchoolSection, Course } from '../../types';

export const SectionManager: React.FC = () => {
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<SchoolSection>>({});

  useEffect(() => {
    setSections(getSections());
    setCourses(getCourses());
  }, []);

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.name && formData.courseId) {
          saveSection({
              ...formData,
              id: formData.id || `sec_${Date.now()}`,
              enrolledCount: formData.enrolledCount || 0
          } as SchoolSection);
          setSections(getSections());
          setIsEditing(false);
          setFormData({});
      }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Class & Section Management</h2>
            <p className="text-gray-500 dark:text-gray-400">Configure capacities and assign grade levels.</p>
            </div>
            <Button onClick={() => { setFormData({}); setIsEditing(true); }} className="shadow-lg">
            <Plus size={16} className="mr-2" /> Add Section
            </Button>
        </div>

        {isEditing && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Configure Section</h3>
                <form onSubmit={handleSave} className="grid md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Name</label>
                        <input id="section-name" name="sectionName" autocomplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. GWO-A1" required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course/Grade</label>
                        <select id="section-course" name="sectionCourse" autocomplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.courseId || ''} onChange={e => setFormData({...formData, courseId: e.target.value})} required>
                            <option value="">Select Course...</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
                        <input type="number" id="section-capacity" name="sectionCapacity" autocomplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} required/>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button type="submit" className="w-full">Save</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                </form>
            </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map(sec => {
                const course = courses.find(c => c.id === sec.courseId);
                const percentage = (sec.enrolledCount / sec.capacity) * 100;
                
                return (
                    <div key={sec.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Layers size={24} />
                            </div>
                            <button onClick={() => { setFormData(sec); setIsEditing(true); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-secondary dark:text-white mb-1">{sec.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 truncate">{course?.title}</p>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                                <span>Enrollment</span>
                                <span>{sec.enrolledCount} / {sec.capacity}</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${percentage}%`}}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
