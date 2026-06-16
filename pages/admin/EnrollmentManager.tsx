
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, Filter, CheckCircle, XCircle, 
  Eye, FileText, Calendar, Clock, User, Mail, FolderOpen,
  ArrowRight, Users, Bell
} from 'lucide-react';
import { Button } from '../../components/Button';
import { getStudents, getCourses, saveStudent, getSections, addAuditLog } from '../../services/storageService';
import { Student, Course, SchoolSection } from '../../types';

export const EnrollmentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Action States
  const [assignSectionId, setAssignSectionId] = useState('');

  useEffect(() => {
    setStudents(getStudents());
    setCourses(getCourses());
    setSections(getSections());
  }, []);

  const handleStatusChange = (student: Student, newStatus: 'Active' | 'Rejected' | 'Waitlisted') => {
    let updatedStudent = { ...student, status: newStatus };
    
    // Assign Section on approval
    if (newStatus === 'Active' && assignSectionId) {
        updatedStudent.sectionId = assignSectionId;
    }

    saveStudent(updatedStudent);
    setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
    addAuditLog('Enrollment Status Change', `Changed status of ${student.firstName} to ${newStatus}`, 'Enrollment');
    setSelectedStudent(null);
    setAssignSectionId('');
  };

  const handleSendReminder = (student: Student) => {
      alert(`Reminder sent to ${student.email} regarding missing documents.`);
      addAuditLog('Notification Sent', `Sent document reminder to ${student.firstName}`, 'Enrollment');
  };

  const filteredEnrollments = students.filter(s => {
    const matchesText = 
      s.firstName.toLowerCase().includes(filterText.toLowerCase()) || 
      s.lastName.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const getRequirementsStatus = (student: Student) => {
      const requiredDocs = ['Identity', 'Medical']; // simplified rule
      const uploadedTypes = student.documents?.map(d => d.type) || [];
      const missing = requiredDocs.filter(r => !uploadedTypes.includes(r as any));
      
      if (!student.usi) missing.push('USI');
      
      return {
          complete: missing.length === 0,
          missing
      };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Enrollment Processing</h2>
          <p className="text-gray-500 dark:text-gray-400">Review applications, verify documents, and assign classes.</p>
        </div>
        <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
            {['All', 'Pending', 'Waitlisted', 'Active', 'Rejected'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                        statusFilter === status 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* List View */}
         <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search applicants..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white"
                    />
                </div>
                <Button variant="outline" size="sm" onClick={() => { setFilterText(''); setStatusFilter('All'); }}>
                    <Filter size={16} className="mr-2"/> Clear
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Applicant</th>
                            <th className="px-6 py-4">Course</th>
                            <th className="px-6 py-4">Requirements</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredEnrollments.map(student => {
                            const course = courses.find(c => c.id === student.enrolledCourseId);
                            const reqStatus = getRequirementsStatus(student);
                            return (
                                <tr key={student.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedStudent(student)}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                        <span className="line-clamp-1">{course?.title || 'Unknown Course'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {reqStatus.complete ? (
                                            <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><CheckCircle size={12}/> Complete</span>
                                        ) : (
                                            <span className="text-orange-500 flex items-center gap-1 text-xs font-bold" title={`Missing: ${reqStatus.missing.join(', ')}`}>
                                                <FolderOpen size={12}/> {reqStatus.missing.length} Missing
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            student.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                            student.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            student.status === 'Waitlisted' ? 'bg-purple-100 text-purple-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full">
                                            <Eye size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredEnrollments.length === 0 && (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No enrollments found.</p>
                    </div>
                )}
            </div>
         </div>

         {/* Details Panel */}
         <div className="lg:col-span-1">
            {selectedStudent ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4 overflow-hidden animate-fade-in-up">
                    <div className="bg-primary p-6 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="text-white/70 hover:text-white"><XCircle size={24}/></button>
                        </div>
                        <h3 className="text-2xl font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                        <p className="text-blue-200">{courses.find(c => c.id === selectedStudent.enrolledCourseId)?.title}</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <User className="text-gray-400" size={18} />
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase">Student ID</span>
                                    {selectedStudent.id}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Calendar className="text-gray-400" size={18} />
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase">Submitted Date</span>
                                    {selectedStudent.enrollmentDate}
                                </div>
                            </div>
                            
                            {/* Requirements Checklist */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-3">Requirements Checklist</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">USI Verified</span>
                                        {selectedStudent.usi ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-500"/>}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Identity Docs</span>
                                        {selectedStudent.documents?.some(d => d.type === 'Identity') ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-500"/>}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Medical Clearance</span>
                                        {selectedStudent.documents?.some(d => d.type === 'Medical') ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-500"/>}
                                    </div>
                                </div>
                                {!getRequirementsStatus(selectedStudent).complete && (
                                    <Button onClick={() => handleSendReminder(selectedStudent)} variant="outline" size="sm" className="w-full mt-4 flex items-center justify-center gap-2">
                                        <Bell size={14}/> Send Reminder
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-4">Application Actions</h4>
                            {selectedStudent.status === 'Pending' || selectedStudent.status === 'Waitlisted' ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign Section (Optional)</label>
                                        <select 
                                            className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={assignSectionId}
                                            onChange={(e) => setAssignSectionId(e.target.value)}
                                        >
                                            <option value="">-- No Section --</option>
                                            {sections.filter(s => s.courseId === selectedStudent.enrolledCourseId).map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.enrolledCount}/{s.capacity})</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={() => handleStatusChange(selectedStudent, 'Active')} className="bg-green-600 hover:bg-green-700 shadow-md">
                                            <CheckCircle size={16} className="mr-2"/> Approve
                                        </Button>
                                        <Button onClick={() => handleStatusChange(selectedStudent, 'Rejected')} className="bg-red-600 hover:bg-red-700 shadow-md">
                                            <XCircle size={16} className="mr-2"/> Reject
                                        </Button>
                                    </div>
                                    {selectedStudent.status !== 'Waitlisted' && (
                                        <Button onClick={() => handleStatusChange(selectedStudent, 'Waitlisted')} variant="secondary" className="w-full">
                                            <Clock size={16} className="mr-2"/> Move to Waitlist
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className={`text-center p-3 rounded-lg font-bold ${
                                    selectedStudent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    Application {selectedStudent.status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                    <User size={48} className="mb-4 opacity-20" />
                    <p>Select an enrollment application to view details and take action.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
