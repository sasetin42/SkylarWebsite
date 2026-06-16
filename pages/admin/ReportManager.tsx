
import React from 'react';
import { PieChart, BarChart, Download } from 'lucide-react';
import { Button } from '../../components/Button';

export const ReportManager: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400">Financial, enrollment, and demographic insights.</p>
        </div>
        <Button variant="outline" className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"><Download size={16} className="mr-2"/> Export All</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-800 dark:text-white text-lg"><BarChart className="text-primary dark:text-blue-400"/> Monthly Revenue</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
                {[45, 60, 35, 80, 55, 90].map((h, i) => (
                    <div key={i} className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-t-xl relative group hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <div className="absolute bottom-0 w-full bg-primary dark:bg-blue-500 rounded-t-xl transition-all duration-500 shadow-sm" style={{height: `${h}%`}}></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">${h}k</div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-800 dark:text-white text-lg"><PieChart className="text-accent"/> Course Popularity</h3>
            <div className="space-y-6">
                {[
                    { label: 'GWO Basic Safety', val: 75, color: 'bg-blue-500' },
                    { label: 'High Risk Work', val: 50, color: 'bg-orange-500' },
                    { label: 'First Aid', val: 25, color: 'bg-green-500' },
                    { label: 'Electrical', val: 15, color: 'bg-purple-500' },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-mono">{item.val}% Cap</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full ${item.color} shadow-sm`} style={{width: `${item.val}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};
