
import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { getTrainers } from '../../services/storageService';

export const ComplianceManager: React.FC = () => {
  const trainers = getTrainers();
  const expiringTrainers = trainers.filter(t => t.isActive); // Mock logic for demo

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
         <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Compliance & RTO Standards</h2>
         <p className="text-gray-500 dark:text-gray-400">Monitor audit requirements, trainer qualifications, and regulatory alerts.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-l-4 border-l-red-500 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400"><AlertTriangle size={24}/></div>
                <span className="text-4xl font-bold text-gray-800 dark:text-white">2</span>
            </div>
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Critical Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Requires immediate attention</p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-l-4 border-l-orange-500 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400"><FileText size={24}/></div>
                <span className="text-4xl font-bold text-gray-800 dark:text-white">5</span>
            </div>
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Expiring Certs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Within next 30 days</p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-l-4 border-l-green-500 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><CheckCircle size={24}/></div>
                <span className="text-4xl font-bold text-gray-800 dark:text-white">100%</span>
            </div>
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Audit Readiness</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ASQA standards met</p>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
         <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white">Trainer Qualifications Matrix</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Trainer Name</th>
                        <th className="px-4 py-3">TAE40116</th>
                        <th className="px-4 py-3">Vocational Competency</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {trainers.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200">{t.firstName} {t.lastName}</td>
                            <td className="px-4 py-4 text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={16}/> Verified</td>
                            <td className="px-4 py-4 text-green-600 dark:text-green-400"><span className="flex items-center gap-1"><CheckCircle size={16}/> Verified</span></td>
                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400">Updated Jan 2025</td>
                            <td className="px-4 py-4"><span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">Compliant</span></td>
                        </tr>
                    ))}
                    {/* Mock some issues */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                         <td className="px-4 py-4 font-medium text-gray-800 dark:text-gray-200">Robert Baratheon</td>
                         <td className="px-4 py-4 text-red-500 dark:text-red-400 font-bold flex items-center gap-1"><AlertTriangle size={16}/> Expired Dec 2024</td>
                         <td className="px-4 py-4 text-green-600 dark:text-green-400"><span className="flex items-center gap-1"><CheckCircle size={16}/> Verified</span></td>
                         <td className="px-4 py-4 text-gray-500 dark:text-gray-400">Updated Jun 2024</td>
                         <td className="px-4 py-4"><span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold border border-red-200 dark:border-red-800">Non-Compliant</span></td>
                    </tr>
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
