import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle, CornerDownRight, Send, X } from 'lucide-react';
import { getTickets, saveTicket, getStudents } from '../../services/storageService';
import { SupportTicket, Student } from '../../types';
import { Button } from '../../components/Button';

export const SupportManager: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setTickets(getTickets());
    setStudents(getStudents());
  }, []);

  const handleStatusUpdate = (ticket: SupportTicket, status: 'Resolved' | 'In Progress') => {
      saveTicket({ ...ticket, status, lastUpdated: new Date().toISOString().split('T')[0] });
      setTickets(getTickets());
  };

  const handleSendFeedback = (ticket: SupportTicket) => {
      if (!replyText.trim()) return;
      saveTicket({ 
          ...ticket, 
          adminReply: replyText, 
          status: 'Resolved', 
          lastUpdated: new Date().toISOString().split('T')[0] 
      });
      setReplyText('');
      setReplyTicketId(null);
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
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Student Support & Inquiries</h2>
          <p className="text-gray-500 dark:text-gray-400">View, manage, and directly reply to training campus inquiries.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {tickets.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No active tickets or inquiries.</div>
              ) : (
                  tickets.map(ticket => (
                      <div key={ticket.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/35 transition-colors flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase ${
                                      ticket.priority === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                                      'bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}>
                                      {ticket.priority} Priority
                                  </span>
                                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase ${
                                      ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                      ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                                      'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                      {ticket.status}
                                  </span>
                                  <span className="text-xs text-gray-400 font-medium">{ticket.dateCreated}</span>
                              </div>
                              
                              <div>
                                  <h3 className="font-extrabold text-lg text-secondary dark:text-white leading-snug mb-1">{ticket.subject}</h3>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm italic bg-slate-50 dark:bg-gray-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                      "{ticket.message}"
                                  </p>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold">
                                      {getStudentName(ticket.studentId)[0]}
                                  </div>
                                  <span>{getStudentName(ticket.studentId)}</span>
                              </div>

                              {/* Display Admin Reply if exists */}
                              {ticket.adminReply && (
                                  <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 rounded-2xl text-xs md:text-sm text-emerald-800 dark:text-emerald-300">
                                      <CornerDownRight size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                                      <div>
                                          <span className="block font-extrabold text-[10px] uppercase tracking-wider text-emerald-600 mb-1">Admin Feedback Sent</span>
                                          <p className="font-semibold">"{ticket.adminReply}"</p>
                                      </div>
                                  </div>
                              )}

                              {/* Expandable Reply Dialog */}
                              {replyTicketId === ticket.id && (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 animate-scale-in">
                                      <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Direct Message / Response</span>
                                          <button onClick={() => setReplyTicketId(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={14} /></button>
                                      </div>
                                      <textarea
                                          rows={3}
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          placeholder="Type your reply or feedback query to the student..."
                                          className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-xl p-3 text-sm focus:border-primary outline-none resize-none"
                                      />
                                      <div className="flex gap-2 justify-end">
                                          <Button size="sm" variant="outline" onClick={() => setReplyTicketId(null)}>Cancel</Button>
                                          <Button size="sm" onClick={() => handleSendFeedback(ticket)} className="bg-primary flex items-center gap-1.5">
                                              <span>Send Feedback</span>
                                              <Send size={12} />
                                          </Button>
                                      </div>
                                  </div>
                              )}
                          </div>
                          
                          <div className="flex flex-col gap-2 justify-center border-l border-gray-100 dark:border-gray-700 pl-0 md:pl-6 shrink-0">
                              {ticket.status === 'Resolved' ? (
                                  <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-extrabold px-4 py-2 bg-emerald-50 rounded-xl text-xs uppercase tracking-wider border border-emerald-100">
                                      <CheckCircle size={14} /> Resolved
                                  </div>
                              ) : (
                                  <>
                                    <Button size="sm" onClick={() => handleStatusUpdate(ticket, 'Resolved')} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-36 font-bold text-xs uppercase tracking-wider">
                                        Mark Resolved
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => {
                                            setReplyTicketId(ticket.id);
                                            setReplyText(ticket.adminReply || '');
                                        }} 
                                        className="w-full md:w-36 font-bold text-xs uppercase tracking-wider"
                                    >
                                        Reply / Feedback
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
