
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Download, Plus, MoreHorizontal, 
  CheckCircle, XCircle, AlertCircle, Edit2, Trash2, X, Loader
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getStudents, saveStudent, deleteStudent, getCourses } from '../../services/storageService';
import { Student, Course } from '../../types';

export const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Edit/Create State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setStudents(getStudents());
    setCourses(getCourses());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName) {
      setIsSaving(true);
      
      // Simulate API call
      setTimeout(() => {
        saveStudent({
            ...formData,
            id: formData.id || `s_${Date.now()}`,
            status: formData.status || 'Active',
            progress: formData.progress || 0,
            enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0]
        } as Student);
        
        setStudents(getStudents());
        setIsEditing(false);
        setFormData({});
        setIsSaving(false);
      }, 800);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      deleteStudent(id);
      setStudents(getStudents());
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesText = 
      student.firstName.toLowerCase().includes(filterText.toLowerCase()) || 
      student.lastName.toLowerCase().includes(filterText.toLowerCase()) ||
      student.email.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesText && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-secondary dark:text-white">Student Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage enrollments, GWO certifications, and USI records.</p>
        </div>
        <Button onClick={() => { setFormData({}); setIsEditing(true); }} className="shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus size={18} className="mr-2" /> Add New Student
        </Button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-xl text-secondary dark:text-white">{formData.id ? 'Edit Student Details' : 'Register New Student'}</h3>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={24} className="text-gray-400"/></button>
           </div>
           
           <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                  <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Personal Info</h4>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                      <input id="student-first-name" name="firstName" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                      <input id="student-last-name" name="lastName" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input id="student-email" name="email" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input id="student-phone" name="phone" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
              </div>

              <div className="space-y-4">
                  <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Enrollment Data</h4>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">USI (Optional)</label>
                      <input id="student-usi" name="usi" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.usi || ''} onChange={e => setFormData({...formData, usi: e.target.value})} placeholder="10-digit USI" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">WINDA ID (Optional)</label>
                      <input id="student-winda-id" name="windaId" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.windaId || ''} onChange={e => setFormData({...formData, windaId: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enrolled Course</label>
                      <select id="student-enrolled-course" name="enrolledCourseId" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.enrolledCourseId || ''} onChange={e => setFormData({...formData, enrolledCourseId: e.target.value})} required>
                          <option value="">Select Course...</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                      <select id="student-status" name="status" autocomplete="off" className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white transition-all" value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                          <option>Active</option>
                          <option>Pending</option>
                          <option>Completed</option>
                          <option>Withdrawn</option>
                      </select>
                  </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)} className="w-32 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200">Cancel</Button>
                  <Button type="submit" disabled={isSaving} className="w-48 shadow-lg">
                    {isSaving ? <><Loader className="animate-spin mr-2" size={16}/> Saving...</> : 'Save Student'}
                  </Button>
              </div>
           </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                id="student-search"
                name="studentSearch"
                autocomplete="off"
                placeholder="Search students..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                id="student-status-filter"
                name="statusFilter"
                autocomplete="off"
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 font-bold text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-all flex-1 md:flex-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <Button variant="outline" className="shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <Download size={18} className="mr-2" /> Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-8 py-5">Student Name</th>
                  <th className="px-8 py-5">Course Info</th>
                  <th className="px-8 py-5">Identities</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                            {student.firstName[0]}
                         </div>
                         <div>
                            <div className="font-bold text-gray-900 dark:text-white text-base">{student.firstName} {student.lastName}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{student.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            {courses.find(c => c.id === student.enrolledCourseId)?.category || 'General'}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {courses.find(c => c.id === student.enrolledCourseId)?.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        {student.windaId && <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit text-gray-600 dark:text-gray-300">WINDA: {student.windaId}</div>}
                        <div className={`text-xs font-bold flex items-center gap-1 ${student.usi ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                            {student.usi ? <><CheckCircle size={12}/> USI Verified</> : <><AlertCircle size={12}/> USI Missing</>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                        student.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30' :
                        student.status === 'Completed' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30' :
                        'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900 shadow-sm"><Edit2 size={18}/></button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900 shadow-sm"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                <Users size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">No students found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
