
import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getTickets, saveTicket, getStudents } from '../../services/storageService';
import { SupportTicket, Student } from '../../types';
import { Button } from '../../components/Button';

export const SupportManager: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setTickets(getTickets());
    setStudents(getStudents());
  }, []);

  const handleStatusUpdate = (ticket: SupportTicket, status: 'Resolved' | 'In Progress') => {
      saveTicket({ ...ticket, status, lastUpdated: new Date().toISOString().split('T')[0] });
      setTickets(getTickets());
  };

  const getStudentName = (id: string) => {
      if (id && id.startsWith('guest|')) {
          const parts = id.split('|');
          return `${parts[1]} (${parts[2]}) [Guest]`;
      }
      const s = students.find(stu => stu.id === id);
      return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Student Support</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage inquiries and internal notes.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {tickets.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No active tickets.</div>
              ) : (
                  tickets.map(ticket => (
                      <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                      ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                                      'bg-blue-100 text-blue-700'
                                  }`}>
                                      {ticket.priority}
                                  </span>
                                  <span className="text-xs text-gray-500">{ticket.dateCreated}</span>
                              </div>
                              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{ticket.subject}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">"{ticket.message}"</p>
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                      {getStudentName(ticket.studentId)[0]}
                                  </div>
                                  {getStudentName(ticket.studentId)}
                              </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 justify-center border-l border-gray-100 dark:border-gray-700 pl-0 md:pl-6">
                              {ticket.status === 'Resolved' ? (
                                  <div className="flex items-center gap-2 text-green-600 font-bold px-4 py-2 bg-green-50 rounded-lg">
                                      <CheckCircle size={18} /> Resolved
                                  </div>
                              ) : (
                                  <>
                                    <Button size="sm" onClick={() => handleStatusUpdate(ticket, 'Resolved')} className="bg-green-600 hover:bg-green-700 w-full md:w-32">
                                        Mark Resolved
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(ticket, 'In Progress')} className="w-full md:w-32">
                                        Reply
                                    </Button>
                                  </>
                              )}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};
