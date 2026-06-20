
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon, 
  Check, AlertTriangle, Filter, Trash, UploadCloud, ArrowUpRight, Sparkles, Loader, MoreHorizontal, Key,
  Calendar, Clock, Eye, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { getCourses, saveCourse, deleteCourse } from '../../services/storageService';
import { generateCourseImage } from '../../services/geminiService';
import { Course, CourseCategory } from '../../types';

interface RichTextSectionEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const RichTextSectionEditor: React.FC<RichTextSectionEditorProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [lastValue, setLastValue] = useState<string>('');

  useEffect(() => {
    if (isOpen && editorRef.current && value !== lastValue) {
      editorRef.current.innerHTML = value || '';
      setLastValue(value || '');
    }
  }, [isOpen, value, lastValue]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setLastValue(html);
      onChange(html);
    }
  };

  const execSectionCmd = (command: string, val: string = '') => {
    document.execCommand(command, false, val);
    handleInput();
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = window.prompt("Enter the URL (e.g. https://example.com):", "https://");
    if (!url) return;
    execSectionCmd('createLink', url);
  };

  const clearFormatting = () => {
    if (window.confirm("Strip styling from selected text?")) {
      execSectionCmd('removeFormat');
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-5 py-3.5 text-left font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isOpen ? 'bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700' : ''}`}
      >
        <span className="text-sm">{label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800 border border-gray-205 dark:border-gray-700 rounded-lg select-none">
            <button
              type="button"
              onClick={() => execSectionCmd('bold')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => execSectionCmd('italic')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs italic rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => execSectionCmd('underline')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs underline rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Underline"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => execSectionCmd('strikeThrough')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs line-through rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Strikethrough"
            >
              S
            </button>
            <div className="h-4 w-[1px] bg-gray-305 dark:bg-gray-600 mx-0.5" />
            <button
              type="button"
              onClick={() => execSectionCmd('insertUnorderedList')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => execSectionCmd('insertOrderedList')}
              className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
              title="Numbered List"
            >
              1. List
            </button>
            <div className="h-4 w-[1px] bg-gray-305 dark:bg-gray-600 mx-0.5" />
            <button
              type="button"
              onClick={insertLink}
              className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 cursor-pointer"
              title="Link"
            >
              Link
            </button>
            <button
              type="button"
              onClick={clearFormatting}
              className="px-2 py-0.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 font-bold cursor-pointer"
              title="Clear Format"
            >
              Clear Format
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleInput}
            onBlur={handleInput}
            className="w-full min-h-[120px] max-h-[300px] overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none bg-transparent text-gray-905 dark:text-gray-100 rich-text-editor-workspace prose max-w-none dark:prose-invert html-description text-sm leading-relaxed"
            placeholder={`Enter details for ${label.toLowerCase()} visually...`}
            style={{ outline: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // List State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterDuration, setFilterDuration] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [durationError, setDurationError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [lastCourseId, setLastCourseId] = useState<string | undefined>(undefined);

  // Intake Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState<'single' | 'range'>('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timePreset, setTimePreset] = useState('full-day'); // 'full-day', 'morning', 'afternoon', 'custom'
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [editingIntakeIdx, setEditingIntakeIdx] = useState<number | null>(null);
  const [rawIntakeText, setRawIntakeText] = useState('');
  const [isRawMode, setIsRawMode] = useState(false);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData(prev => ({
        ...prev,
        fullDescription: editorRef.current?.innerHTML || ''
      }));
    }
  };

  const execCmd = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleEditorInput();
    editorRef.current?.focus();
  };

  const insertHTMLAtCursor = (html: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      // If editor doesn't have focus, append to end
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        handleEditorInput();
      }
      return;
    }
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const el = document.createElement("div");
    el.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node;
    let lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    handleEditorInput();
  };

  const insertList = (listType: 'ul' | 'ol') => {
    execCmd(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
  };

  const clearFormatting = () => {
    if (window.confirm("Are you sure you want to strip formatting from selection?")) {
      execCmd('removeFormat');
    }
  };

  const insertLink = () => {
    const url = window.prompt("Enter the URL (e.g. https://example.com):", "https://");
    if (!url) return;
    execCmd('createLink', url);
  };

  const insertAlert = (type: 'info' | 'warning') => {
    const title = type === 'info' ? 'Note' : 'Important';
    const text = window.prompt(`Enter ${type} alert message:`, `This is a ${type} alert banner message.`);
    if (!text) return;
    const alertHtml = `<div class="html-alert alert-${type}"><strong>${title}:</strong> ${text}</div><p><br></p>`;
    insertHTMLAtCursor(alertHtml);
  };

  const insertDivider = () => {
    const dividerHtml = `<hr /><p><br></p>`;
    insertHTMLAtCursor(dividerHtml);
  };

  const insertTable = () => {
    const tableHtml = `<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Col 1</td><td>Col 2</td></tr></tbody></table><p><br></p>`;
    insertHTMLAtCursor(tableHtml);
  };

  useEffect(() => {
    if (isEditing) {
      if (formData.id !== lastCourseId) {
        setLastCourseId(formData.id);
        if (editorRef.current) {
          editorRef.current.innerHTML = formData.fullDescription || '';
        }
      }
    } else {
      setLastCourseId(undefined);
    }
  }, [isEditing, formData.id, lastCourseId]);

  // AI Gen State
  const [showGenModal, setShowGenModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [genAspectRatio, setGenAspectRatio] = useState('16:9');
  const [genSize, setGenSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleEdit = (course: Course) => {
    setFormData(course);
    setIsEditing(true);
    setDurationError('');
    setImageError('');
  };

  const handleAdd = () => {
    setFormData({
      id: `c_${Date.now()}`,
      title: '',
      category: CourseCategory.SAFETY,
      shortDescription: '',
      fullDescription: '',
      price: 0,
      duration: '',
      level: 'Short Course',
      image: '',
      upcomingDates: []
    });
    setIsEditing(true);
    setDurationError('');
    setImageError('');
  };

  const validateDuration = (val: string) => {
    // Enforces Format: Number + Space + Unit (Day/Days/Month/Months/Week/Weeks/Hour/Hours)
    const regex = /^\d+\s+(Day|Days|Month|Months|Week|Weeks|Hour|Hours)$/i;
    if (!val) return true; 
    return regex.test(val);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side Validation: Duration
    if (formData.duration && !validateDuration(formData.duration)) {
      setDurationError("Format must be: '5 Days', '1 Month', or '8 Hours'");
      return;
    }
    
    // Client-side Validation: Image
    if (imageError) {
      return; // Don't save if there's an active image error
    }
    
    if (formData.id && formData.title) {
      setIsSaving(true);
      // Simulate network request
      setTimeout(() => {
        saveCourse(formData as Course);
        setCourses(getCourses());
        setIsEditing(false);
        setIsSaving(false);
      }, 800);
    }
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      deleteCourse(showDeleteModal);
      setCourses(getCourses());
      setShowDeleteModal(null);
      setSelectedIds(prev => prev.filter(id => id !== showDeleteModal));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected courses?`)) {
      selectedIds.forEach(id => deleteCourse(id));
      setCourses(getCourses());
      setSelectedIds([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(''); // Reset error
    
    if (file) {
      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid file type. Please upload JPEG, PNG, or GIF.");
        return;
      }

      // Validate File Size (Max 500KB)
      if (file.size > 500 * 1024) {
        setImageError("File size exceeds 500KB. Please select a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Check for API Key before opening modal
  const openGenModal = async () => {
      // Assuming window.aistudio is available in the environment
      if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
      } else {
          // Fallback if environment doesn't support the specific key selector (local dev)
          setHasApiKey(true); 
      }
      setShowGenModal(true);
  };

  const handleSelectApiKey = async () => {
      if ((window as any).aistudio) {
          await (window as any).aistudio.openSelectKey();
          // Assume success after interaction per guidelines, and reset state
          setHasApiKey(true);
      }
  };

  const handleGenerateImage = async () => {
      if (!genPrompt) return;
      setIsGenerating(true);
      const base64 = await generateCourseImage(genPrompt, genAspectRatio, genSize);
      if (base64) {
          setFormData(prev => ({ ...prev, image: base64 }));
          setShowGenModal(false);
          setGenPrompt(''); // reset
      } else {
          // If 404/error, it might be the key. Re-prompt user.
          setHasApiKey(false);
          alert("Failed to generate. You may need to select a valid API Key with access to Gemini 3 Pro.");
      }
      setIsGenerating(false);
  };

  // Filter Logic
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    
    let matchesPrice = true;
    if (filterPrice === 'Low') matchesPrice = c.price < 500;
    if (filterPrice === 'Medium') matchesPrice = c.price >= 500 && c.price <= 1500;
    if (filterPrice === 'High') matchesPrice = c.price > 1500;

    let matchesDuration = true;
    if (filterDuration === 'Short') matchesDuration = /Day|Hour/i.test(c.duration);
    if (filterDuration === 'Medium') matchesDuration = /Week/i.test(c.duration);
    if (filterDuration === 'Long') matchesDuration = /Month/i.test(c.duration);

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCourses.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderStringListEditor = (
    label: string,
    list: string[] | undefined,
    onChange: (newList: string[]) => void
  ) => {
    const items = list || [];
    return (
      <div className="space-y-2.5 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{label}</label>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item}
                className="flex-grow p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white"
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx] = e.target.value;
                  onChange(updated);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const updated = items.filter((_, i) => i !== idx);
                  onChange(updated);
                }}
                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors shrink-0 border border-transparent hover:border-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange([...items, ""]);
            }}
            className="text-xs font-bold text-primary dark:text-blue-400 hover:text-secondary flex items-center gap-1 mt-1 pl-1"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>
    );
  };

  const formatIntakeDate = (
    mode: 'single' | 'range',
    startStr: string,
    endStr: string,
    preset: string,
    startT: string,
    endT: string
  ): string => {
    if (!startStr) return '';
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const formatDateParts = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      return {
        day: d.getDate(),
        month: months[d.getMonth()],
        year: d.getFullYear()
      };
    };

    const startParts = formatDateParts(startStr);
    if (!startParts) return '';

    let datePart = '';
    if (mode === 'single' || !endStr) {
      datePart = `${startParts.day} ${startParts.month} ${startParts.year}`;
    } else {
      const endParts = formatDateParts(endStr);
      if (!endParts) {
        datePart = `${startParts.day} ${startParts.month} ${startParts.year}`;
      } else if (startParts.year !== endParts.year) {
        datePart = `${startParts.day} ${startParts.month} ${startParts.year} – ${endParts.day} ${endParts.month} ${endParts.year}`;
      } else if (startParts.month !== endParts.month) {
        datePart = `${startParts.day} ${startParts.month} – ${endParts.day} ${endParts.month} ${startParts.year}`;
      } else if (startParts.day !== endParts.day) {
        datePart = `${startParts.day} – ${endParts.day} ${startParts.month} ${startParts.year}`;
      } else {
        datePart = `${startParts.day} ${startParts.month} ${startParts.year}`;
      }
    }

    // Format Time
    const formatTimeStr = (timeStr: string) => {
      const [hStr, mStr] = timeStr.split(':');
      const h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (isNaN(h) || isNaN(m)) return timeStr;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m.toString().padStart(2, '0');
      return `${displayH}:${displayM} ${ampm}`;
    };

    let timePart = '';
    if (preset === 'full-day') {
      timePart = '09:00 AM - 05:00 PM';
    } else if (preset === 'morning') {
      timePart = '08:00 AM - 12:00 PM';
    } else if (preset === 'afternoon') {
      timePart = '01:00 PM - 05:00 PM';
    } else {
      timePart = `${formatTimeStr(startT)} - ${formatTimeStr(endT)}`;
    }

    return `${datePart}, ${timePart}`;
  };

  const parseExistingIntake = (str: string) => {
    if (!str) return;

    setStartDate('');
    setEndDate('');
    setTimePreset('full-day');
    setStartTime('09:00');
    setEndTime('17:00');
    setIsRawMode(false);
    setRawIntakeText(str);

    try {
      const parts = str.split(',');
      const datePart = parts[0]?.trim();
      const timePart = parts[1]?.trim();

      const yearMatch = datePart.match(/\b(20\d{2})\b/);
      if (!yearMatch) {
        setIsRawMode(true);
        return;
      }
      const year = parseInt(yearMatch[0], 10);

      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      let monthIndex = -1;
      for (let i = 0; i < months.length; i++) {
        if (datePart.toLowerCase().includes(months[i])) {
          monthIndex = i;
          break;
        }
      }
      if (monthIndex === -1) {
        setIsRawMode(true);
        return;
      }

      if (datePart.includes('–') || datePart.includes('-')) {
        setDateMode('range');
        const rangeParts = datePart.split(/[–-]/);
        const startDayStr = rangeParts[0]?.trim().match(/\d+/)?.[0];
        const endDayStr = rangeParts[1]?.trim().match(/\d+/)?.[0];
        if (!startDayStr || !endDayStr) {
          setIsRawMode(true);
          return;
        }
        
        let startMonthIdx = monthIndex;
        let endMonthIdx = monthIndex;
        
        for (let i = 0; i < months.length; i++) {
          if (rangeParts[0].toLowerCase().includes(months[i])) {
            startMonthIdx = i;
            break;
          }
        }
        
        const startD = new Date(year, startMonthIdx, parseInt(startDayStr, 10), 12);
        const endD = new Date(year, endMonthIdx, parseInt(endDayStr, 10), 12);
        
        const toISODate = (d: Date) => d.toISOString().split('T')[0];
        setStartDate(toISODate(startD));
        setEndDate(toISODate(endD));
      } else {
        setDateMode('single');
        const dayStr = datePart.match(/\d+/)?.[0];
        if (!dayStr) {
          setIsRawMode(true);
          return;
        }
        const startD = new Date(year, monthIndex, parseInt(dayStr, 10), 12);
        setStartDate(startD.toISOString().split('T')[0]);
      }

      if (timePart) {
        if (timePart.includes('09:00 AM - 05:00 PM')) {
          setTimePreset('full-day');
        } else if (timePart.includes('08:00 AM - 12:00 PM')) {
          setTimePreset('morning');
        } else if (timePart.includes('01:00 PM - 05:00 PM')) {
          setTimePreset('afternoon');
        } else {
          setTimePreset('custom');
          const parseTimeStr = (tStr: string) => {
            const match = tStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return null;
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && h < 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          };
          const times = timePart.split('-');
          const sT = parseTimeStr(times[0]);
          const eT = parseTimeStr(times[1]);
          if (sT && eT) {
            setStartTime(sT);
            setEndTime(eT);
          }
        }
      } else {
        setTimePreset('full-day');
      }
    } catch (e) {
      setIsRawMode(true);
    }
  };

  const renderIntakeDatesEditor = (
    list: string[] | undefined,
    onChange: (newList: string[]) => void
  ) => {
    const items = list || [];

    const handleSaveIntake = () => {
      let finalStr = '';
      if (isRawMode) {
        finalStr = rawIntakeText.trim();
      } else {
        finalStr = formatIntakeDate(dateMode, startDate, endDate, timePreset, startTime, endTime);
      }

      if (!finalStr) return;

      const updated = [...items];
      if (editingIntakeIdx !== null) {
        updated[editingIntakeIdx] = finalStr;
      } else {
        updated.push(finalStr);
      }
      onChange(updated);
      
      setShowDatePicker(false);
      setEditingIntakeIdx(null);
      setStartDate('');
      setEndDate('');
      setTimePreset('full-day');
      setStartTime('09:00');
      setEndTime('17:00');
      setIsRawMode(false);
      setRawIntakeText('');
    };

    const handleCancel = () => {
      setShowDatePicker(false);
      setEditingIntakeIdx(null);
      setStartDate('');
      setEndDate('');
      setTimePreset('full-day');
      setStartTime('09:00');
      setEndTime('17:00');
      setIsRawMode(false);
      setRawIntakeText('');
    };

    const handleStartEdit = (idx: number, val: string) => {
      setEditingIntakeIdx(idx);
      parseExistingIntake(val);
      setShowDatePicker(true);
    };

    const handleAddNewClick = () => {
      setEditingIntakeIdx(null);
      setStartDate('');
      setEndDate('');
      setTimePreset('full-day');
      setStartTime('09:00');
      setEndTime('17:00');
      setIsRawMode(false);
      setRawIntakeText('');
      setShowDatePicker(true);
    };

    const previewString = isRawMode 
      ? rawIntakeText 
      : formatIntakeDate(dateMode, startDate, endDate, timePreset, startTime, endTime);

    return (
      <div className="space-y-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Upcoming Intake Dates & Times</label>
          {!showDatePicker && (
            <button
              type="button"
              onClick={handleAddNewClick}
              className="text-xs px-3 py-1.5 font-bold bg-primary text-white hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus size={14} /> Schedule Intake
            </button>
          )}
        </div>

        {/* Existing Intake Dates List */}
        {!showDatePicker && items.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500 italic bg-white dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            No intake dates scheduled. Click "Schedule Intake" to add one.
          </div>
        )}

        {!showDatePicker && items.length > 0 && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {items.map((item, idx) => {
              const parts = item.split(',');
              const dateP = parts[0]?.trim();
              const timeP = parts[1]?.trim();

              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={12} className="text-primary dark:text-blue-400" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{dateP}</span>
                    </div>
                    {timeP && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-405 dark:text-gray-500">
                        <Clock size={12} className="text-gray-400 dark:text-gray-500" />
                        <span>{timeP}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idx, item)}
                      className="p-1.5 text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="Edit Intake"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = items.filter((_, i) => i !== idx);
                        onChange(updated);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      title="Delete Intake"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dropdown panel for adding/editing intake dates */}
        {showDatePicker && (
          <div className="p-4 bg-white dark:bg-gray-850 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Calendar size={16} className="text-primary dark:text-blue-400" />
                {editingIntakeIdx !== null ? 'Edit Scheduled Intake' : 'Schedule New Intake'}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Raw Mode</span>
                <button
                  type="button"
                  onClick={() => setIsRawMode(!isRawMode)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${isRawMode ? 'bg-primary dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${isRawMode ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>

            {isRawMode ? (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Custom Intake Text</label>
                <input
                  type="text"
                  placeholder="e.g. 22 - 25 June 2026, 09:00 AM - 05:00 PM"
                  value={rawIntakeText}
                  onChange={(e) => setRawIntakeText(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner animate-fade-in"
                />
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Date Mode Selector */}
                <div className="flex rounded-lg bg-gray-100 dark:bg-gray-900/60 p-0.5 w-fit">
                  <button
                    type="button"
                    onClick={() => setDateMode('range')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${dateMode === 'range' ? 'bg-white dark:bg-gray-800 text-primary dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                  >
                    Date Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateMode('single')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${dateMode === 'single' ? 'bg-white dark:bg-gray-800 text-primary dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                  >
                    Single Date
                  </button>
                </div>

                {/* Calendar fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{dateMode === 'range' ? 'Start Date' : 'Date'}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-905 dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  {dateMode === 'range' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-905 dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Time fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Shift / Time Preset</label>
                    <select
                      value={timePreset}
                      onChange={(e) => setTimePreset(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-905 dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                    >
                      <option value="full-day">Full Day: 09:00 AM - 05:00 PM</option>
                      <option value="morning">Morning: 08:00 AM - 12:00 PM</option>
                      <option value="afternoon">Afternoon: 01:00 PM - 05:00 PM</option>
                      <option value="custom">Custom Time...</option>
                    </select>
                  </div>

                  {timePreset === 'custom' && (
                    <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-905 dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">End Time</label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-905 dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Preview Display */}
            {previewString && (
              <div className="p-2.5 bg-primary/5 dark:bg-blue-500/5 border border-primary/20 dark:border-blue-500/20 rounded-lg">
                <span className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase tracking-wide">Live Preview</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-0.5">{previewString}</p>
              </div>
            )}

            {/* Form actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!previewString}
                onClick={handleSaveIntake}
                className="px-3 py-1.5 text-xs font-bold bg-primary hover:bg-secondary text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {editingIntakeIdx !== null ? 'Update Intake' : 'Add to Intakes'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 animate-fade-in-up relative">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold font-heading text-secondary dark:text-white">{formData.id?.startsWith('c_') ? 'Add New Course' : 'Edit Course'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
              <input 
                type="text" 
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as CourseCategory})}
              >
                {Object.values(CourseCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
              <input 
                type="number" 
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.price || 0}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 5 Days"
                className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm ${durationError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}`}
                value={formData.duration || ''}
                onChange={e => {
                  setFormData({...formData, duration: e.target.value});
                  setDurationError('');
                }}
              />
              {durationError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12}/> {durationError}</p>}
            </div>
            
            {/* Image Upload Section with Validation */}
            <div className="md:col-span-2 p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50">
               <div className="flex justify-between items-center mb-4">
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Course Image</label>
                   <button 
                      type="button"
                      onClick={openGenModal}
                      className="text-xs flex items-center gap-1 text-accent font-bold hover:text-yellow-500 transition-colors"
                   >
                      <Sparkles size={14} /> Generate with AI
                   </button>
               </div>
               
               <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Image Preview Area */}
                  {formData.image && !imageError && (
                    <div className="w-full md:w-1/3 shrink-0">
                      <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600 group aspect-video">
                        <img src={formData.image} alt="Course Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button type="button" size="sm" variant="danger" onClick={() => setFormData({...formData, image: ''})}>Remove</Button>
                        </div>
                      </div>
                      <p className="text-center text-xs text-green-600 mt-2 font-bold flex justify-center items-center gap-1"><Check size={12}/> Image Loaded</p>
                    </div>
                  )}

                  <div className="flex-1 w-full">
                      <label className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all group ${imageError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}`}>
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageUpload} />
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud size={20} className="text-primary dark:text-blue-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                             {formData.image ? 'Click to replace image' : 'Click to upload image'}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF up to 500KB</span>
                      </label>
                      
                      {imageError && (
                        <div className="mt-3 text-red-500 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg w-full">
                          <AlertTriangle size={16} /> {imageError}
                        </div>
                      )}
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
              {/* Left pane: Short Description Editor (takes 2 cols) */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Short Description</label>
                  <span className={`text-[10px] font-bold ${((formData.shortDescription || '').length > 160) ? 'text-amber-500' : 'text-gray-400'}`}>
                    {(formData.shortDescription || '').length} / 160 characters {((formData.shortDescription || '').length > 160) && '(SEO recommended length exceeded)'}
                  </span>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Enter a brief, compelling summary for course cards and search outcomes..."
                  className="w-full h-[180px] p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm resize-none"
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                />
              </div>
              {/* Right pane: Course Card Live Preview (takes 1 col) */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Live Course Card Preview</span>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm flex flex-col h-[180px] justify-between relative overflow-hidden group">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden relative shrink-0">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-750 text-gray-450 text-[10px]">No Image</div>
                      )}
                      <span className="absolute bottom-0.5 left-0.5 bg-secondary/80 backdrop-blur-sm text-white text-[8px] font-bold px-1 rounded uppercase truncate max-w-[55px]">{formData.level || 'Short Course'}</span>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-bold uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded inline-block mb-1">{formData.category}</span>
                        <h4 className="text-xs font-bold text-secondary dark:text-white truncate">{formData.title || 'Course Title'}</h4>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-3 leading-tight italic break-words">
                          {formData.shortDescription || 'Enter a brief summary...'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px]">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock size={10} className="mr-1 text-gray-400" />
                      <span>{formData.duration || 'Flexible'}</span>
                    </div>
                    <span className="font-bold text-primary">${formData.price || 0}</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">


              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Full Description Editor</label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 select-none">
                  <button
                    type="button"
                    onClick={() => execCmd('bold')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Bold text"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('italic')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs italic rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Italic text"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('underline')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs underline rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Underline text"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('strikeThrough')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs line-through rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Strikethrough text"
                  >
                    S
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<h3>')}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertList('ul')}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => insertList('ol')}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Numbered List"
                  >
                    1. List
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<p>')}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Paragraph wrapper"
                  >
                    P
                  </button>
                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-0.5" />
                  <button
                    type="button"
                    onClick={insertLink}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    title="Insert Hyperlink"
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAlert('info')}
                    className="px-2 py-1 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-xs text-green-600 dark:text-green-400 rounded border border-green-200 dark:border-green-800 transition-colors cursor-pointer"
                    title="Insert Info Alert Banner"
                  >
                    Info Box
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAlert('warning')}
                    className="px-2 py-1 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-xs text-amber-600 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                    title="Insert Warning Banner"
                  >
                    Warn Box
                  </button>
                  <button
                    type="button"
                    onClick={insertDivider}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Insert Horizontal Divider Line"
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={insertTable}
                    className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                    title="Insert Data Table Template"
                  >
                    Table
                  </button>
                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-0.5" />
                  <button
                    type="button"
                    onClick={clearFormatting}
                    className="px-2 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 transition-colors font-bold cursor-pointer"
                    title="Clear text formatting"
                  >
                    Clear Format
                  </button>
                </div>
                {/* Visual Rich-Text Workspace */}
                <div
                  ref={editorRef}
                  contentEditable={true}
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  className="w-full min-h-[350px] max-h-[600px] overflow-y-auto p-5 bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-905 dark:text-gray-100 rich-text-editor-workspace prose max-w-none dark:prose-invert html-description text-sm leading-relaxed"
                  placeholder="Start writing description details visually here..."
                  style={{ outline: 'none' }}
                />
              </div>
            </div>


            {/* Advanced Course Metadata Section */}
            <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-heading font-bold text-lg text-secondary dark:text-white mb-4">Advanced Course Metadata</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. GWO-ART-I"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.code || ''}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level / Availability</label>
                  <select 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.level || 'Available'}
                    onChange={e => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Popular">Popular</option>
                    <option value="New">New</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Official Certification Awarded</label>
                  <input 
                    type="text" 
                    placeholder="e.g. GWO Advanced Rescue Training Certificate"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.certificationName || ''}
                    onChange={e => setFormData({...formData, certificationName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Certification Validity (Months)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 24"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.validityMonths || ''}
                    onChange={e => setFormData({...formData, validityMonths: e.target.value ? Number(e.target.value) : undefined})}
                  />
                </div>
                <div className="flex items-center gap-2.5 pt-2 md:col-span-2">
                  <input 
                    type="checkbox"
                    id="isGwo"
                    className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 dark:bg-gray-950"
                    checked={!!formData.isGwo}
                    onChange={e => setFormData({...formData, isGwo: e.target.checked})}
                  />
                  <label htmlFor="isGwo" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">GWO Certified Course</label>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">RTO Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. RTO 21647"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white shadow-sm"
                    value={formData.rtoCode || ''}
                    onChange={e => setFormData({...formData, rtoCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Mode</label>
                  <select 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white shadow-sm"
                    value={formData.deliveryMode || 'Face-to-Face'}
                    onChange={e => setFormData({...formData, deliveryMode: e.target.value})}
                  >
                    <option value="Face-to-Face">Face-to-Face</option>
                    <option value="Online">Online</option>
                    <option value="Blended">Blended</option>
                    <option value="On-site at Wind Farm">On-site at Wind Farm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Required Deposit Amount ($)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white shadow-sm"
                    value={formData.depositAmount || ''}
                    onChange={e => setFormData({...formData, depositAmount: e.target.value ? Number(e.target.value) : undefined})}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-heading font-bold text-lg text-secondary dark:text-white mb-2">List Fields & Course Syllabus</h3>
              {renderIntakeDatesEditor(formData.upcomingDates, (val) => setFormData({...formData, upcomingDates: val}))}
              {renderStringListEditor("What You Will Learn", formData.whatYouWillLearn, (val) => setFormData({...formData, whatYouWillLearn: val}))}
              
              <div className="mt-8 space-y-4">
                <h4 className="font-heading font-bold text-base text-gray-800 dark:text-gray-250 mb-2">Collapsible Information Sections (WYSIWYG Editors)</h4>
                
                <RichTextSectionEditor
                  label="Course Benefits"
                  value={formData.courseBenefits || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, courseBenefits: val }))}
                />
                <RichTextSectionEditor
                  label="Is this course for me?"
                  value={formData.isThisCourseForMe || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, isThisCourseForMe: val }))}
                />
                <RichTextSectionEditor
                  label="Career Opportunities"
                  value={formData.careerOpportunities || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, careerOpportunities: val }))}
                />
                <RichTextSectionEditor
                  label="What is the duration of training?"
                  value={formData.durationOfTraining || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, durationOfTraining: val }))}
                />
                <RichTextSectionEditor
                  label="Where is the training delivered?"
                  value={formData.whereDelivered || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, whereDelivered: val }))}
                />
                <RichTextSectionEditor
                  label="Accredited Units"
                  value={formData.accreditedUnitsRich || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, accreditedUnitsRich: val }))}
                />
                <RichTextSectionEditor
                  label="What are the entry requirements?"
                  value={formData.entryRequirementsRich || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, entryRequirementsRich: val }))}
                />
                <RichTextSectionEditor
                  label="Language, Literacy & Numeracy (LLN)"
                  value={formData.lln || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, lln: val }))}
                />
                <RichTextSectionEditor
                  label="Assessment"
                  value={formData.assessment || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, assessment: val }))}
                />
                <RichTextSectionEditor
                  label="Certification/Training Record"
                  value={formData.certificationRecord || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, certificationRecord: val }))}
                />
                <RichTextSectionEditor
                  label="Validity Period"
                  value={formData.validityPeriod || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, validityPeriod: val }))}
                />
                <RichTextSectionEditor
                  label="What to bring?"
                  value={formData.whatToBringRich || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, whatToBringRich: val }))}
                />
                <RichTextSectionEditor
                  label="What is the cost of training?"
                  value={formData.costOfTraining || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, costOfTraining: val }))}
                />
                <RichTextSectionEditor
                  label="What are the payment options?"
                  value={formData.paymentOptions || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, paymentOptions: val }))}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="w-32">
                {isSaving ? <><Loader className="animate-spin mr-2" size={16}/> Saving...</> : 'Save Course'}
            </Button>
          </div>
        </form>

        {/* AI Image Generation Modal */}
        {showGenModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-accent">
                            <Sparkles size={20} />
                            <h3 className="text-xl font-bold font-heading text-gray-800 dark:text-white">AI Image Generator</h3>
                        </div>
                        <button onClick={() => setShowGenModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                    </div>

                    {!hasApiKey ? (
                        <div className="text-center py-8">
                            <Key size={48} className="mx-auto text-yellow-500 mb-4" />
                            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">API Key Required</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You need to select a billing project to use the AI generator.</p>
                            <Button onClick={handleSelectApiKey} className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                                Select API Key
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image Prompt</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Describe the image you want (e.g. 'Technicians working on a wind turbine at sunset')"
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent transition-all dark:text-white"
                                    value={genPrompt}
                                    onChange={e => setGenPrompt(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Aspect Ratio</label>
                                    <select 
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                                        value={genAspectRatio}
                                        onChange={e => setGenAspectRatio(e.target.value)}
                                    >
                                        <option value="1:1">1:1 (Square)</option>
                                        <option value="16:9">16:9 (Landscape)</option>
                                        <option value="4:3">4:3 (Standard)</option>
                                        <option value="3:4">3:4 (Portrait)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Quality</label>
                                    <select 
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
                                        value={genSize}
                                        onChange={e => setGenSize(e.target.value)}
                                    >
                                        <option value="1K">Standard (1K)</option>
                                        <option value="2K">High (2K)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleGenerateImage} 
                                disabled={isGenerating || !genPrompt}
                                className="w-full mt-4 bg-[#EBB108] text-[#041024] border-none shadow-lg hover:shadow-xl hover:bg-[#d4a017]"
                            >
                                {isGenerating ? <span className="flex items-center gap-2"><Loader className="animate-spin" size={16}/> Generating...</span> : 'Generate Image'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-secondary dark:text-white">Course Catalog</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage training programs, dates, and pricing.</p>
        </div>
        <Button onClick={handleAdd} className="shadow-lg hover:shadow-xl">
          <Plus size={18} className="mr-2" /> Create Course
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col xl:flex-row gap-4 justify-between items-center">
            
            {/* Search & Bulk Actions */}
            <div className="flex items-center gap-4 w-full xl:w-auto">
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg animate-fade-in">
                        <span className="text-xs font-bold">{selectedIds.length} Selected</span>
                        <button onClick={handleBulkDelete} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"><Trash2 size={16}/></button>
                    </div>
                )}
                
                <div className="relative flex-1 xl:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm dark:text-white"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {Object.values(CourseCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                
                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(e.target.value)}
                >
                    <option value="All">Any Price</option>
                    <option value="Low">Low (&lt; $500)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (&gt; $1.5k)</option>
                </select>

                <select 
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                >
                    <option value="All">Any Duration</option>
                    <option value="Short">Short (1-2 Days)</option>
                    <option value="Medium">Medium (Week)</option>
                    <option value="Long">Long (Month+)</option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-wider border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 w-10">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedIds.length === filteredCourses.length && filteredCourses.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4">Course Details</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredCourses.map(course => (
                        <tr key={course.id} className={`hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors group ${selectedIds.includes(course.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <td className="px-6 py-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={selectedIds.includes(course.id)}
                                    onChange={() => handleSelectRow(course.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                                        <img src={course.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{course.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{course.shortDescription}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-900/50">
                                    {course.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{course.duration}</td>
                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-white font-mono">${course.price}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                        to={`/courses/${course.id}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 shadow-sm flex items-center justify-center"
                                        title="Preview course public page"
                                    >
                                        <Eye size={18}/>
                                    </Link>
                                    <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-sm"><Edit2 size={18}/></button>
                                    <button onClick={() => setShowDeleteModal(course.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 shadow-sm"><Trash2 size={18}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredCourses.length === 0 && (
                <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No courses match your filters.</p>
                    <button onClick={() => {setSearchTerm(''); setFilterCategory('All'); setFilterPrice('All'); setFilterDuration('All');}} className="text-primary text-sm font-bold hover:underline mt-2">Clear Filters</button>
                </div>
            )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trash2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Course?</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">This action cannot be undone. Are you sure you want to proceed?</p>
                  <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={() => setShowDeleteModal(null)}>Cancel</Button>
                      <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-transparent">Delete</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
