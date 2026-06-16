
import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, CheckCircle, AlertTriangle, 
  Database, ArrowRight, Save, RotateCcw, Download 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { addMigrationLog, saveStudent } from '../../services/storageService';
import { MigrationLog, Student } from '../../types';

interface CsvRow {
  [key: string]: string;
}

export const DataMigration: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Map/Preview, 3: Complete
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [logs, setLogs] = useState<MigrationLog[]>([]);
  
  // Field Mapping State
  const [mapping, setMapping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    usi: '',
    windaId: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Simulate CSV parsing
      setTimeout(() => {
        // Mock data that "came from the file"
        const mockParsed: CsvRow[] = [
          { full_name: 'Robert Stark', email_addr: 'robb@winterfell.com', phone_num: '0400111222', legacy_id: 'OLD_001', gwo_id: '' },
          { full_name: 'Jon Snow', email_addr: 'jon@wall.com', phone_num: '0400333444', legacy_id: 'OLD_002', gwo_id: 'WINDA-999' },
          { full_name: 'Arya Stark', email_addr: 'arya@braavos.com', phone_num: '0400555666', legacy_id: 'OLD_003', gwo_id: '' },
        ];
        setParsedData(mockParsed);
        setStep(2);
      }, 1000);
    }
  };

  const executeImport = () => {
    // Process the data based on mapping
    let successCount = 0;
    const errors: string[] = [];

    parsedData.forEach((row, idx) => {
      try {
        // Simple logic to split full name if mapped
        let first = '', last = '';
        if (mapping.firstName === 'full_name' && row.full_name) {
          const parts = row.full_name.split(' ');
          first = parts[0];
          last = parts.slice(1).join(' ');
        }

        const newStudent: Student = {
          id: `migrated_${Date.now()}_${idx}`,
          firstName: first || 'Unknown',
          lastName: last || 'Unknown',
          email: row[mapping.email] || '',
          phone: row[mapping.phone] || '',
          usi: row[mapping.usi] || undefined,
          windaId: row[mapping.windaId] || undefined,
          status: 'Active',
          progress: 0,
          enrollmentDate: new Date().toISOString().split('T')[0],
          enrolledCourseId: 'legacy_course'
        };

        saveStudent(newStudent);
        successCount++;
      } catch (e) {
        errors.push(`Row ${idx + 1}: Failed to save.`);
      }
    });

    const log: MigrationLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      type: 'Students',
      status: errors.length === 0 ? 'Success' : 'Partial',
      recordsProcessed: successCount,
      errors: errors,
      fileName: file?.name || 'unknown.csv'
    };

    addMigrationLog(log);
    setLogs(prev => [log, ...prev]);
    setStep(3);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">Data Migration Tool</h2>
            <p className="text-gray-500 dark:text-gray-400">Import legacy data from the old website to the new system.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => window.open('/template.csv')}><Download size={16} className="mr-2"/> Download Template</Button>
            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"><RotateCcw size={16} className="mr-2"/> Rollback Last Import</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Progress Stepper */}
        <div className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center shadow-sm">1</div>
              <span>Upload</span>
            </div>
            <div className="w-24 h-0.5 bg-gray-200 dark:bg-gray-600"></div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center shadow-sm">2</div>
              <span>Map Fields</span>
            </div>
            <div className="w-24 h-0.5 bg-gray-200 dark:bg-gray-600"></div>
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center shadow-sm">3</div>
              <span>Result</span>
            </div>
          </div>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-gray-50/30 dark:bg-transparent">
              <UploadCloud size={64} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Drag & Drop Legacy Files Here</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Supports CSV, JSON, and XML exports from old SQL databases.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.json"
                onChange={handleFileUpload}
              />
              <Button onClick={() => fileInputRef.current?.click()} className="shadow-lg hover:shadow-xl">
                Select File
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-6 rounded-xl flex items-start gap-4 border border-blue-100 dark:border-blue-900/50">
                <Database size={24} className="mt-0.5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-bold text-lg">File Loaded: {file?.name}</p>
                  <p className="text-sm opacity-80">We detected {parsedData.length} records. Please map the columns below to proceed.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-2 text-gray-800 dark:text-white">Field Mapping</h4>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4 items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">New System Field</label>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">CSV Header</label>
                    </div>
                    {/* Mapping Rows */}
                    {[
                        { label: 'First Name', key: 'firstName' },
                        { label: 'Email Address', key: 'email' },
                        { label: 'Phone', key: 'phone' },
                        { label: 'WINDA ID (GWO)', key: 'windaId' }
                    ].map((field) => (
                        <div key={field.key} className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{field.label}</span>
                            <select 
                                className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary/50"
                                onChange={(e) => setMapping({...mapping, [field.key]: e.target.value})}
                            >
                                <option value="">-- Select --</option>
                                {Object.keys(parsedData[0] || {}).map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                   <h4 className="font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-2 text-gray-800 dark:text-white">Data Preview</h4>
                   <div className="bg-gray-900 text-gray-300 p-6 rounded-xl text-xs font-mono overflow-auto max-h-80 shadow-inner border border-gray-700">
                      <pre>{JSON.stringify(parsedData.slice(0, 3), null, 2)}</pre>
                   </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-gray-700">
                 <Button onClick={executeImport} className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30">
                    <Save size={16} className="mr-2" /> Start Import Process
                 </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 dark:text-green-400 shadow-lg">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Import Successful</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">Data has been migrated to the new Student database.</p>
              <div className="flex justify-center gap-6">
                 <Button variant="outline" className="py-3 px-6" onClick={() => { setStep(1); setFile(null); }}>Import More Data</Button>
                 <Button className="py-3 px-6 shadow-lg" onClick={() => window.location.href = '/admin/students'}>View Students <ArrowRight size={16} className="ml-2"/></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Migration History */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
           <h3 className="font-bold text-xl text-gray-800 dark:text-white">Migration Logs</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
            <tr>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">File Name</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4">Records</th>
              <th className="px-8 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
             {logs.length === 0 ? (
               <tr><td colSpan={5} className="px-8 py-6 text-center text-gray-400">No migration history found.</td></tr>
             ) : (
               logs.map(log => (
                 <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                   <td className="px-8 py-4 text-gray-700 dark:text-gray-300">{log.date}</td>
                   <td className="px-8 py-4 text-gray-700 dark:text-gray-300 font-medium">{log.fileName}</td>
                   <td className="px-8 py-4 text-gray-600 dark:text-gray-400">{log.type}</td>
                   <td className="px-8 py-4 font-mono text-gray-700 dark:text-gray-300">{log.recordsProcessed}</td>
                   <td className="px-8 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${log.status === 'Success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'}`}>
                        {log.status}
                     </span>
                   </td>
                 </tr>
               ))
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
