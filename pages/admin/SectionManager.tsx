import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/Button';
import { getSections, saveSection, deleteSection, getCourses } from '../../services/storageService';
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

  const handleDelete = (id: string, name: string) => {
      if (window.confirm(`Are you sure you want to delete section "${name}"? This action cannot be undone.`)) {
          deleteSection(id);
          setSections(getSections());
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
                        <input id="section-name" name="sectionName" autoComplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. GWO-A1" required/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course/Grade</label>
                        <select id="section-course" name="sectionCourse" autoComplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.courseId || ''} onChange={e => setFormData({...formData, courseId: e.target.value})} required>
                            <option value="">Select Course...</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
                        <input type="number" id="section-capacity" name="sectionCapacity" autoComplete="off" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} required/>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button type="submit" className="w-full">Save</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                </form>
            </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="py-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Section Details</th>
                            <th className="py-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Assigned Course</th>
                            <th className="py-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Enrollment Status</th>
                            <th className="py-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Availability</th>
                            <th className="py-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sections.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <Layers size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                                        <p className="font-semibold text-gray-500">No sections found.</p>
                                        <p className="text-sm">Click "Add Section" to create one.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : sections.map(sec => {
                            const course = courses.find(c => c.id === sec.courseId);
                            const percentage = Math.min((sec.enrolledCount / sec.capacity) * 100, 100);
                            
                            let statusBadge = { text: 'OPEN', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
                            if (percentage >= 100) statusBadge = { text: 'FULL', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
                            else if (percentage >= 80) statusBadge = { text: 'NEAR CAPACITY', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' };

                            return (
                                <tr key={sec.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <Layers size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{sec.name}</h3>
                                                <span className="text-xs text-gray-400">ID: {sec.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="max-w-[250px]">
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate" title={course?.title}>{course?.title || 'Unknown Course'}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="w-full max-w-[200px] space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
                                                <span>{sec.enrolledCount} Students</span>
                                                <span>{sec.capacity} Max</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                    style={{width: `${percentage}%`}}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${statusBadge.color}`}>
                                            {statusBadge.text}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => { setFormData(sec); setIsEditing(true); }} 
                                                className="p-2 text-gray-400 hover:text-primary dark:hover:text-blue-400 bg-gray-50 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/30 rounded-lg transition-colors focus:outline-none"
                                                title="Edit Section"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sec.id, sec.name)} 
                                                className="p-2 text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 dark:bg-gray-800 dark:hover:bg-rose-900/30 rounded-lg transition-colors focus:outline-none"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
