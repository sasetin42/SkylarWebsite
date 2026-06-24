
import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Plus, Search, FileText } from 'lucide-react';
import { Button } from '../../components/Button';
import { getPayments, savePayment, getStudents } from '../../services/storageService';
import { PaymentRecord, Student } from '../../types';

export const FinanceManager: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<PaymentRecord>>({});

  useEffect(() => {
    setPayments(getPayments());
    setStudents(getStudents());
  }, []);

  const handleRecordPayment = (e: React.FormEvent) => {
      e.preventDefault();
      if(newPayment.amount && newPayment.studentId) {
          savePayment({
              ...newPayment,
              id: `pay_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              status: 'Completed',
              invoiceId: `INV-${Date.now().toString().slice(-6)}`
          } as PaymentRecord);
          setPayments(getPayments());
          setIsModalOpen(false);
          setNewPayment({});
      }
  };

  const getStudentName = (id: string) => {
      const s = students.find(stu => stu.id === id);
      return s ? `${s.firstName} ${s.lastName}` : 'Unknown Student';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Finance & Billing</h2>
          <p className="text-gray-500 dark:text-gray-400">Track tuition payments and generate receipts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg">
          <Plus size={16} className="mr-2" /> Record Payment
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Total Revenue (YTD)</h3>
              <p className="text-3xl font-heading font-bold text-green-600">$1,240,500</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Outstanding Balance</h3>
              <p className="text-3xl font-heading font-bold text-red-500">$45,200</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Recent Transactions</h3>
              <p className="text-3xl font-heading font-bold text-blue-500">{payments.length}</p>
          </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Transaction History</h3>
            <Button variant="outline" size="sm"><Download size={16} className="mr-2"/> Export CSV</Button>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-bold uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{pay.date}</td>
                        <td className="px-6 py-4 font-mono text-xs">{pay.invoiceId}</td>
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{getStudentName(pay.studentId)}</td>
                        <td className="px-6 py-4">{pay.type}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${pay.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{pay.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-blue-600 hover:underline text-xs font-bold flex items-center justify-end gap-1">
                                <FileText size={14}/> Receipt
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-pop-in">
                  <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Record New Payment</h3>
                  <form onSubmit={handleRecordPayment} className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Student</label>
                          <select 
                            id="finance-student"
                            name="financeStudent"
                            autocomplete="off"
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            onChange={e => setNewPayment({...newPayment, studentId: e.target.value})}
                            required
                          >
                              <option value="">Select Student...</option>
                              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Amount ($)</label>
                          <input 
                            type="number" 
                            id="finance-amount"
                            name="financeAmount"
                            autocomplete="off"
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            onChange={e => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                            required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Type</label>
                          <select 
                            id="finance-type"
                            name="financeType"
                            autocomplete="off"
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            onChange={e => setNewPayment({...newPayment, type: e.target.value as any})}
                            required
                          >
                              <option value="Tuition">Tuition</option>
                              <option value="Material Fee">Material Fee</option>
                              <option value="Deposit">Deposit</option>
                          </select>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                          <Button type="submit">Save Payment</Button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
