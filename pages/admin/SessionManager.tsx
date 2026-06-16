
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, User, Plus, Trash2, X 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getSessions, saveSession, deleteSession, getCourses, getTrainers } from '../../services/storageService';
import { Session, Course, Trainer } from '../../types';
import { LOCATIONS } from '../../constants';

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Session>>({});

  useEffect(() => {
    setSessions(getSessions());
    setCourses(getCourses());
    setTrainers(getTrainers());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.courseId && formData.startDate) {
        saveSession({ 
            ...formData, 
            id: formData.id || `sess_${Date.now()}`,
            enrolledStudentIds: formData.enrolledStudentIds || []
        } as Session);
        setSessions(getSessions());
        setIsEditing(false);
        setFormData({});
    }
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Cancel this session?')) {
          deleteSession(id);
          setSessions(getSessions());
      }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Session Schedule</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage upcoming training classes and trainer allocation.</p>
        </div>
        <Button onClick={() => { setFormData({}); setIsEditing(true); }} className="shadow-lg hover:shadow-xl">
          <Plus size={16} className="mr-2" /> Schedule Class
        </Button>
      </div>

      {isEditing ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Schedule New Session</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Course</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.courseId || ''} onChange={e => setFormData({...formData, courseId: e.target.value})} required>
                        <option value="">Select Course...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Trainer</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.trainerId || ''} onChange={e => setFormData({...formData, trainerId: e.target.value})} required>
                        <option value="">Select Trainer...</option>
                        {trainers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Location</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.locationId || ''} onChange={e => setFormData({...formData, locationId: e.target.value})} required>
                        <option value="">Select Location...</option>
                        {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Capacity</label>
                    <input type="number" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.capacity || 10} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Start Date</label>
                    <input type="date" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">End Date</label>
                    <input type="date" className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Status</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm" value={formData.status || 'Scheduled'} onChange={e => setFormData({...formData, status: e.target.value as any})} required>
                        <option>Scheduled</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit">Save Session</Button>
                </div>
             </form>
          </div>
      ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Trainer</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Enrollment</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {sessions.map(sess => {
                        const course = courses.find(c => c.id === sess.courseId);
                        const trainer = trainers.find(t => t.id === sess.trainerId);
                        const loc = LOCATIONS.find(l => l.id === sess.locationId);
                        return (
                            <tr key={sess.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{course?.title || 'Unknown Course'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {trainer?.firstName[0]}
                                        </div>
                                        {trainer?.firstName} {trainer?.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2"><Calendar size={14}/> {sess.startDate}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                                     <div className="flex items-center gap-2"><MapPin size={14}/> {loc?.state || 'Unknown'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{width: `${(sess.enrolledStudentIds.length / sess.capacity) * 100}%`}}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{sess.enrolledStudentIds.length}/{sess.capacity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(sess.id)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
             </table>
             {sessions.length === 0 && <div className="p-12 text-center text-gray-500 dark:text-gray-400">No sessions scheduled.</div>}
          </div>
      )}
    </div>
  );
};
