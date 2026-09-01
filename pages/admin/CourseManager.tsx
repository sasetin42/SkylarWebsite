
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon, 
  Check, AlertTriangle, Filter, Trash, UploadCloud, ArrowUpRight, Sparkles, Loader, MoreHorizontal, Key,
  Calendar, Clock, Eye, ChevronDown, ArrowUp, ArrowDown, Copy, Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { getCourses, saveCourse, deleteCourse, getCategories } from '../../services/storageService';
import { firebaseClient } from '../../services/firebaseClient';
import { generateCourseImage } from '../../services/geminiService';
import { Course, Category, CourseAccordionSection } from '../../types';

export const DEFAULT_COURSE_SECTIONS = [
  { id: 'courseBenefits', title: 'Course Benefits', defaultKey: 'courseBenefits' },
  { id: 'isThisCourseForMe', title: 'Is this course for me?', defaultKey: 'isThisCourseForMe' },
  { id: 'careerOpportunities', title: 'Career Opportunities', defaultKey: 'careerOpportunities' },
  { id: 'durationOfTraining', title: 'What is the duration of training?', defaultKey: 'durationOfTraining' },
  { id: 'whereDelivered', title: 'Where is the training delivered?', defaultKey: 'whereDelivered' },
  { id: 'gwoModulesRich', title: 'GWO Modules & Specifications', defaultKey: 'gwoModulesRich' },
  { id: 'entryRequirementsRich', title: 'What are the entry requirements?', defaultKey: 'entryRequirementsRich' },
  { id: 'languageRequirements', title: 'Language & Prerequisite Skills', defaultKey: 'languageRequirements' },
  { id: 'assessment', title: 'Assessment', defaultKey: 'assessment' },
  { id: 'certificationRecord', title: 'Certification/Training Record', defaultKey: 'certificationRecord' },
  { id: 'validityPeriod', title: 'Validity Period', defaultKey: 'validityPeriod' },
  { id: 'whatToBringRich', title: 'What to bring?', defaultKey: 'whatToBringRich' },
  { id: 'costOfTraining', title: 'What is the cost of training?', defaultKey: 'costOfTraining' },
  { id: 'paymentOptions', title: 'What are the payment options?', defaultKey: 'paymentOptions' },
];

export const getCourseAccordionSections = (course: Partial<Course>): CourseAccordionSection[] => {
  if (course.accordionSections && Array.isArray(course.accordionSections) && course.accordionSections.length > 0) {
    return course.accordionSections;
  }
  return DEFAULT_COURSE_SECTIONS.map(s => ({
    id: s.id,
    title: s.title,
    content: ((course as any)[s.defaultKey] || '') as string
  }));
};

interface RichTextSectionEditorProps {
  id: string;
  title: string;
  value: string;
  index: number;
  total: number;
  onTitleChange: (newTitle: string) => void;
  onChange: (val: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const RichTextSectionEditor: React.FC<RichTextSectionEditorProps> = ({ 
  id, 
  title, 
  value, 
  index, 
  total, 
  onTitleChange, 
  onChange, 
  onMoveUp, 
  onMoveDown, 
  onDelete 
}) => {
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

  const insertHTMLAtCursor = (html: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        handleInput();
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
    
    handleInput();
  };

  const insertHeading = (tag: 'h2' | 'h3' | 'h4' | 'p') => {
    execSectionCmd('formatBlock', `<${tag}>`);
  };

  const insertAlert = (type: 'info' | 'success' | 'warning' | 'accent') => {
    const titles = {
      info: 'Note',
      success: 'Verified Standard',
      warning: 'Important Notice',
      accent: 'Key Takeaway'
    };
    const text = window.prompt(`Enter message for ${type} box:`, `Important detail or specification regarding ${title || 'this section'}.`);
    if (!text) return;
    const alertHtml = `<div class="html-alert alert-${type}"><strong>${titles[type]}:</strong> ${text}</div><p><br></p>`;
    insertHTMLAtCursor(alertHtml);
  };

  const insertQuote = () => {
    const text = window.prompt("Enter quote or statement:", "Training standard aligned with Global Wind Organisation requirements and international safety protocols.");
    if (!text) return;
    const quoteHtml = `<blockquote>"${text}"</blockquote><p><br></p>`;
    insertHTMLAtCursor(quoteHtml);
  };

  const insertChecklist = () => {
    const checkHtml = `<ul class="html-checklist"><li>Verified WINDA registration and valid ID</li><li>Standard medical clearance and physical declaration</li><li>Appropriate PPE safety equipment provided</li></ul><p><br></p>`;
    insertHTMLAtCursor(checkHtml);
  };

  const insertBadge = () => {
    const text = window.prompt("Enter badge tag (e.g. GWO Certified, Mandatory, Level 1):", "GWO Certified");
    if (!text) return;
    const badgeHtml = `<span class="html-badge">${text}</span>&nbsp;`;
    insertHTMLAtCursor(badgeHtml);
  };

  const insertTable = () => {
    const tableHtml = `<table><thead><tr><th>Specification / Module</th><th>Details</th><th>Status</th></tr></thead><tbody><tr><td>Delivery Mode</td><td>Instructor-led Practical Simulation</td><td>Active</td></tr><tr><td>Certification Standard</td><td>Global Wind Organisation (GWO)</td><td>Verified</td></tr></tbody></table><p><br></p>`;
    insertHTMLAtCursor(tableHtml);
  };

  const insertDivider = () => {
    insertHTMLAtCursor(`<hr /><p><br></p>`);
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800 transition-all hover:border-gray-300 dark:hover:border-gray-600">
      <div className={`flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 gap-3 border-b ${isOpen ? 'border-gray-200 dark:border-gray-700' : 'border-transparent'}`}>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0">
            {index + 1}
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Accordion Section Title"
            className="flex-1 font-bold text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all min-w-0 shadow-inner"
            title="Click to customize accordion title"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className={`p-1.5 rounded-lg border transition-all ${
              index === 0 
                ? 'opacity-30 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white shadow-xs cursor-pointer'
            }`}
            title="Move Section Up"
          >
            <ArrowUp size={15} />
          </button>
          
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className={`p-1.5 rounded-lg border transition-all ${
              index === total - 1 
                ? 'opacity-30 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white shadow-xs cursor-pointer'
            }`}
            title="Move Section Down"
          >
            <ArrowDown size={15} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:border-red-800 transition-all shadow-xs cursor-pointer"
            title="Delete Section"
          >
            <Trash2 size={15} />
          </button>

          <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all shadow-xs cursor-pointer"
          >
            <span>{isOpen ? 'Close' : 'Edit'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3 animate-fade-in-up bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl select-none">
            {/* Headings */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertHeading('h2')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                title="Heading 2 (Major)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertHeading('h3')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                title="Heading 3 (Subheading)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertHeading('h4')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                title="Heading 4"
              >
                H4
              </button>
              <button
                type="button"
                onClick={() => insertHeading('p')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Normal Paragraph"
              >
                P
              </button>
            </div>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

            {/* Inline Styles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => execSectionCmd('bold')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => execSectionCmd('italic')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs italic rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => execSectionCmd('underline')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs underline rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Underline"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => execSectionCmd('strikeThrough')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs line-through rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Strikethrough"
              >
                S
              </button>
            </div>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

            {/* Lists & Checklists */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => execSectionCmd('insertUnorderedList')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => execSectionCmd('insertOrderedList')}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Numbered List"
              >
                1. List
              </button>
              <button
                type="button"
                onClick={insertChecklist}
                className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                title="Insert Verified Checklist"
              >
                ✓ Checklist
              </button>
            </div>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

            {/* Callout Boxes */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertAlert('info')}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-medium text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 cursor-pointer"
                title="Insert Info Box"
              >
                + Info
              </button>
              <button
                type="button"
                onClick={() => insertAlert('success')}
                className="px-2 py-1 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium text-green-700 dark:text-green-300 rounded border border-green-200 dark:border-green-800 cursor-pointer"
                title="Insert Success/Standard Box"
              >
                + Success
              </button>
              <button
                type="button"
                onClick={() => insertAlert('warning')}
                className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium text-amber-700 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800 cursor-pointer"
                title="Insert Warning Box"
              >
                + Warn
              </button>
              <button
                type="button"
                onClick={() => insertAlert('accent')}
                className="px-2 py-1 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-xs font-medium text-yellow-700 dark:text-yellow-300 rounded border border-yellow-200 dark:border-yellow-800 cursor-pointer"
                title="Insert Key Tip / Highlight Box"
              >
                + Tip
              </button>
            </div>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

            {/* Rich Layout Objects */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={insertQuote}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Insert Blockquote"
              >
                “ Quote
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Insert Data Table"
              >
                Table
              </button>
              <button
                type="button"
                onClick={insertBadge}
                className="px-2 py-1 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-xs font-medium text-sky-700 dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800 cursor-pointer"
                title="Insert Tag Badge"
              >
                Badge
              </button>
              <button
                type="button"
                onClick={insertDivider}
                className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Insert Horizontal Divider Line"
              >
                Line
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 cursor-pointer"
                title="Insert Hyperlink"
              >
                Link
              </button>
              <button
                type="button"
                onClick={clearFormatting}
                className="px-2 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 font-bold cursor-pointer"
                title="Clear Formatting"
              >
                Clear
              </button>
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleInput}
            onBlur={handleInput}
            className="w-full min-h-[140px] max-h-[350px] overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rich-text-editor-workspace prose max-w-none dark:prose-invert html-description text-sm leading-relaxed"
            placeholder={`Enter details for ${title ? title.toLowerCase() : 'this section'} visually...`}
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
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'tba'>('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timePreset, setTimePreset] = useState('full-day'); // 'full-day', 'morning', 'afternoon', 'flexible', 'custom'
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [tbaOption, setTbaOption] = useState<string>('Schedule Upon Request');
  const [tbaCustomDetail, setTbaCustomDetail] = useState<string>('');
  const [tbaTentativeDate, setTbaTentativeDate] = useState<string>('');
  const [tbaDuration, setTbaDuration] = useState<string>('');
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

  const applyTextColor = (color: string) => {
    execCmd('foreColor', color);
  };

  const applyHighlightColor = (color: string) => {
    execCmd('hiliteColor', color);
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

  const insertHeading = (tag: 'h2' | 'h3' | 'h4' | 'p') => {
    execCmd('formatBlock', `<${tag}>`);
  };

  const insertAlert = (type: 'info' | 'success' | 'warning' | 'accent') => {
    const titles = {
      info: 'Note',
      success: 'Verified Standard',
      warning: 'Important Notice',
      accent: 'Key Takeaway'
    };
    const text = window.prompt(`Enter message for ${type} box:`, `Important detail or specification regarding this course.`);
    if (!text) return;
    const alertHtml = `<div class="html-alert alert-${type}"><strong>${titles[type]}:</strong> ${text}</div><p><br></p>`;
    insertHTMLAtCursor(alertHtml);
  };

  const insertQuote = () => {
    const text = window.prompt("Enter quote or statement:", "Training standard aligned with Global Wind Organisation requirements and international safety protocols.");
    if (!text) return;
    const quoteHtml = `<blockquote>"${text}"</blockquote><p><br></p>`;
    insertHTMLAtCursor(quoteHtml);
  };

  const insertChecklist = () => {
    const checkHtml = `<ul class="html-checklist"><li>Verified WINDA registration and valid ID</li><li>Standard medical clearance and physical declaration</li><li>Appropriate PPE safety equipment provided</li></ul><p><br></p>`;
    insertHTMLAtCursor(checkHtml);
  };

  const insertBadge = () => {
    const text = window.prompt("Enter badge tag (e.g. GWO Certified, Mandatory, Level 1):", "GWO Certified");
    if (!text) return;
    const badgeHtml = `<span class="html-badge">${text}</span>&nbsp;`;
    insertHTMLAtCursor(badgeHtml);
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

  const insertDivider = () => {
    const dividerHtml = `<hr /><p><br></p>`;
    insertHTMLAtCursor(dividerHtml);
  };

  const insertTable = () => {
    const tableHtml = `<table><thead><tr><th>Module / Specification</th><th>Details</th><th>Status</th></tr></thead><tbody><tr><td>Theoretical Fundamentals</td><td>4 Hours Classroom & Digital Simulation</td><td>Verified</td></tr><tr><td>Practical Exercises</td><td>8 Hours Controlled Training Facility</td><td>Active</td></tr></tbody></table><p><br></p>`;
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleEdit = (course: Course) => {
    const sections = getCourseAccordionSections(course);
    setFormData({
      ...course,
      accordionSections: sections
    });
    setIsEditing(true);
    setDurationError('');
    setImageError('');
  };

  const handleDuplicate = async (course: Course) => {
    const sections = getCourseAccordionSections(course);
    const uniqueSuffix = Date.now().toString().slice(-4);
    
    // Deep clone course object with unique ID and title
    const clonedCourse: Course = {
      ...JSON.parse(JSON.stringify(course)),
      id: `c_${Date.now()}`,
      title: `${course.title} (Copy)`,
      code: course.code ? `${course.code}-COPY` : undefined,
      accordionSections: JSON.parse(JSON.stringify(sections))
    };

    try {
      await saveCourse(clonedCourse);
      const updated = getCourses();
      setCourses(updated);
      
      // Immediately open the duplicated course for editing so admin can customize it right away
      setFormData(clonedCourse);
      setIsEditing(true);
      setDurationError('');
      setImageError('');
    } catch (err) {
      console.error("Duplicate course error:", err);
    }
  };

  const handleAdd = () => {
    const defaultSections = DEFAULT_COURSE_SECTIONS.map(s => ({
      id: s.id,
      title: s.title,
      content: ''
    }));
    setFormData({
      id: `c_${Date.now()}`,
      title: '',
      category: getCategories().filter(c => !c.parentId)[0]?.name || '',
      subCategory: '',
      shortDescription: '',
      fullDescription: '',
      price: 0,
      duration: '',
      level: 'Short Course',
      image: '',
      upcomingDates: [],
      accordionSections: defaultSections
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

  const handleSave = async (e: React.FormEvent) => {
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
      try {
        const courseToSave: Course = {
          ...(formData as Course),
          accordionSections: formData.accordionSections || []
        };
        await saveCourse(courseToSave);
        setCourses(getCourses());
        setIsEditing(false);
      } catch (err) {
        console.error("Save course error:", err);
      } finally {
        setIsSaving(false);
      }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(''); // Reset error
    
    if (file) {
      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid file type. Please upload JPEG, PNG, GIF, WebP, or SVG.");
        return;
      }

      // Validate File Size (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImageError("File size exceeds 10MB. Please select a smaller image.");
        return;
      }

      setIsUploadingImage(true);
      try {
        const mediaData = await firebaseClient.uploadMedia(file, 'course-covers');
        setFormData(prev => ({ ...prev, image: mediaData }));
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingImage(false);
        e.target.value = '';
      }
    }
  };

  // Open generator modal directly without API blockers
  const openGenModal = async () => {
      setShowGenModal(true);
  };

  const handleSelectApiKey = async () => {
      if ((window as any).aistudio) {
          await (window as any).aistudio.openSelectKey();
          setHasApiKey(true);
      }
  };

  const handleGenerateImage = async () => {
      if (!genPrompt) return;
      setIsGenerating(true);
      try {
        const base64 = await generateCourseImage(genPrompt, genAspectRatio, genSize);
        if (base64) {
            // Save generated media directly to Firestore or fallback to base64
            try {
              const mediaData = await firebaseClient.uploadBase64(base64, 'course-covers', `ai_course_${Date.now()}.jpg`);
              setFormData(prev => ({ ...prev, image: mediaData }));
            } catch (err) {
              setFormData(prev => ({ ...prev, image: base64 }));
            }
            setShowGenModal(false);
            setGenPrompt(''); // reset
        } else {
            // Fallback default image in case of rendering interruption
            setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200' }));
            setShowGenModal(false);
        }
      } catch (e: any) {
        console.error("Image generation error:", e);
        // Fallback default image
        setFormData(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200' }));
        setShowGenModal(false);
      } finally {
        setIsGenerating(false);
      }
  };

  // Filter Logic
  const filteredCourses = (courses || []).filter(c => {
    if (!c) return false;
    const title = c.title || '';
    const code = c.code || '';
    const category = c.category || '';
    const subCategory = c.subCategory || '';
    const duration = c.duration || '';
    const price = typeof c.price === 'number' ? c.price : 0;

    const term = (searchTerm || '').toLowerCase().trim();
    const matchesSearch = !term || 
                          title.toLowerCase().includes(term) || 
                          code.toLowerCase().includes(term) || 
                          category.toLowerCase().includes(term) ||
                          subCategory.toLowerCase().includes(term);
    const matchesCategory = filterCategory === 'All' || category === filterCategory || subCategory === filterCategory;
    
    let matchesPrice = true;
    if (filterPrice === 'Low') matchesPrice = price < 500;
    if (filterPrice === 'Medium') matchesPrice = price >= 500 && price <= 1500;
    if (filterPrice === 'High') matchesPrice = price > 1500;

    let matchesDuration = true;
    if (filterDuration === 'Short') matchesDuration = /Day|Hour/i.test(duration);
    if (filterDuration === 'Medium') matchesDuration = /Week/i.test(duration);
    if (filterDuration === 'Long') matchesDuration = /Month/i.test(duration);

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
                id={`course-list-item-${idx}`}
                name={`listItem-${idx}`}
                autoComplete="off"
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
    mode: 'single' | 'range' | 'tba',
    startStr: string,
    endStr: string,
    preset: string,
    startT: string,
    endT: string,
    tbaOpt?: string,
    tbaCustom?: string,
    tbaTentative?: string,
    tbaDur?: string
  ): string => {
    if (mode === 'tba') {
      const detail = (tbaCustom && tbaCustom.trim()) ? tbaCustom.trim() : (tbaOpt || 'Schedule Upon Request');
      const durPart = (tbaDur && tbaDur.trim()) ? ` (${tbaDur.trim()})` : '';
      let datePart = '';
      if (tbaTentative) {
        const d = new Date(tbaTentative);
        if (!isNaN(d.getTime())) {
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          datePart = `TBA (${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${detail}${durPart})`;
        } else {
          datePart = `TBA (${detail}${durPart})`;
        }
      } else {
        datePart = `TBA – ${detail}${durPart}`;
      }

      let timePart = '';
      if (preset === 'full-day') {
        timePart = '09:00 AM - 05:00 PM';
      } else if (preset === 'morning') {
        timePart = '08:00 AM - 12:00 PM';
      } else if (preset === 'afternoon') {
        timePart = '01:00 PM - 05:00 PM';
      } else if (preset === 'flexible') {
        timePart = 'Flexible Schedule / On-Demand';
      } else if (preset === 'custom') {
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
        timePart = `${formatTimeStr(startT)} - ${formatTimeStr(endT)}`;
      }

      return timePart ? `${datePart}, ${timePart}` : datePart;
    }

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
    } else if (preset === 'flexible') {
      timePart = 'Flexible Schedule / On-Demand';
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
    setTbaOption('Schedule Upon Request');
    setTbaCustomDetail('');
    setTbaTentativeDate('');
    setTbaDuration('');
    setIsRawMode(false);
    setRawIntakeText(str);

    try {
      const lower = str.toLowerCase();
      if (lower.startsWith('tba') || lower.includes('to be announced') || lower.includes('upon request')) {
        setDateMode('tba');
        const parts = str.split(',');
        const datePart = parts[0]?.trim() || '';
        const timePart = parts[1]?.trim() || '';

        // Extract duration if present: e.g. (4 Days) or (5 Days Duration)
        const durMatch = datePart.match(/\(([^)]*(?:day|days|week|weeks|month|months|hrs|hours)[^)]*)\)/i);
        if (durMatch) {
          setTbaDuration(durMatch[1].trim());
        } else {
          setTbaDuration('');
        }

        let cleanDetail = datePart
          .replace(/^TBA\s*[–-]\s*/i, '')
          .replace(/^TBA\s*\(/i, '')
          .replace(/\(([^)]*(?:day|days|week|weeks|month|months|hrs|hours)[^)]*)\)/i, '')
          .replace(/\)$/, '')
          .trim();
        setTbaCustomDetail(cleanDetail);
        setTbaOption(cleanDetail || 'Schedule Upon Request');

        if (timePart) {
          if (timePart.includes('09:00 AM - 05:00 PM')) {
            setTimePreset('full-day');
          } else if (timePart.includes('08:00 AM - 12:00 PM')) {
            setTimePreset('morning');
          } else if (timePart.includes('01:00 PM - 05:00 PM')) {
            setTimePreset('afternoon');
          } else if (timePart.toLowerCase().includes('flexible') || timePart.toLowerCase().includes('on-demand')) {
            setTimePreset('flexible');
          } else {
            setTimePreset('custom');
          }
        }
        return;
      }

      const parts = str.split(',');
      const datePart = parts[0]?.trim() || '';
      const timePart = parts[1]?.trim() || '';

      const monthMap: Record<string, number> = {
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'sept': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11
      };

      const yearMatch = datePart.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

      const findMonthInText = (text: string): number => {
        const lowerText = text.toLowerCase();
        for (const [name, idx] of Object.entries(monthMap)) {
          const re = new RegExp(`\\b${name}\\b`, 'i');
          if (re.test(lowerText)) return idx;
        }
        for (const [name, idx] of Object.entries(monthMap)) {
          if (lowerText.includes(name)) return idx;
        }
        return -1;
      };

      const toISODate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      // ISO Format: YYYY-MM-DD
      const isoMatch = datePart.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        setStartDate(isoMatch[0]);
        setDateMode('single');
      } else if (datePart.includes('–') || datePart.includes('-') || datePart.toLowerCase().includes(' to ')) {
        setDateMode('range');
        const rangeParts = datePart.split(/[–-]| to /i);
        const startSec = rangeParts[0]?.trim() || '';
        const endSec = rangeParts[1]?.trim() || '';

        const startM = findMonthInText(startSec);
        const endM = findMonthInText(endSec);
        const generalM = findMonthInText(datePart);

        const startMIdx = startM !== -1 ? startM : generalM;
        const endMIdx = endM !== -1 ? endM : (startM !== -1 ? startM : generalM);

        const startDay = startSec.match(/\b\d{1,2}\b/)?.[0] || '1';
        const endDay = endSec.match(/\b\d{1,2}\b/)?.[0] || startDay;

        if (startMIdx !== -1) {
          const startD = new Date(year, startMIdx, parseInt(startDay, 10), 12);
          const endD = new Date(year, endMIdx !== -1 ? endMIdx : startMIdx, parseInt(endDay, 10), 12);
          setStartDate(toISODate(startD));
          setEndDate(toISODate(endD));
        } else {
          setIsRawMode(true);
          return;
        }
      } else {
        const mIdx = findMonthInText(datePart);
        if (mIdx !== -1) {
          setDateMode('single');
          const dayMatch = datePart.match(/\b\d{1,2}\b/);
          const dayNum = dayMatch ? parseInt(dayMatch[0], 10) : 1;
          const startD = new Date(year, mIdx, dayNum, 12);
          setStartDate(toISODate(startD));
        } else {
          setIsRawMode(true);
          return;
        }
      }

      if (timePart) {
        if (timePart.includes('09:00 AM - 05:00 PM')) {
          setTimePreset('full-day');
        } else if (timePart.includes('08:00 AM - 12:00 PM')) {
          setTimePreset('morning');
        } else if (timePart.includes('01:00 PM - 05:00 PM')) {
          setTimePreset('afternoon');
        } else if (timePart.toLowerCase().includes('flexible')) {
          setTimePreset('flexible');
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
          if (times.length >= 2) {
            const sT = parseTimeStr(times[0]);
            const eT = parseTimeStr(times[1]);
            if (sT && eT) {
              setStartTime(sT);
              setEndTime(eT);
            }
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

    const calculateEndDate = (startIso: string, daysCount: number) => {
      if (!startIso || daysCount <= 0) return '';
      const [y, m, d] = startIso.split('-').map(Number);
      const date = new Date(y, m - 1, d, 12);
      date.setDate(date.getDate() + (daysCount - 1));
      const toY = date.getFullYear();
      const toM = String(date.getMonth() + 1).padStart(2, '0');
      const toD = String(date.getDate()).padStart(2, '0');
      return `${toY}-${toM}-${toD}`;
    };

    const getNumericDaysFromDuration = (dur?: string): number => {
      if (!dur) return 5;
      const num = parseInt(dur.match(/\d+/)?.[0] || '5', 10);
      const lower = dur.toLowerCase();
      if (lower.includes('week')) return num * 7;
      if (lower.includes('month')) return num * 30;
      return num;
    };

    const getSelectedDurationDays = (): number => {
      if (dateMode === 'tba') return 0;
      if (!startDate) return 0;
      if (dateMode === 'single' || !endDate) return 1;
      const [y1, m1, d1] = startDate.split('-').map(Number);
      const [y2, m2, d2] = endDate.split('-').map(Number);
      const diff = Math.round((new Date(y2, m2 - 1, d2, 12).getTime() - new Date(y1, m1 - 1, d1, 12).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    };

    const handleApplyDuration = (days: number) => {
      const start = startDate || new Date().toISOString().split('T')[0];
      setStartDate(start);
      if (days === 1) {
        setDateMode('single');
        setEndDate('');
      } else {
        setDateMode('range');
        setEndDate(calculateEndDate(start, days));
      }
    };

    const handleSaveIntake = () => {
      let finalStr = '';
      if (isRawMode) {
        finalStr = rawIntakeText.trim();
      } else {
        finalStr = formatIntakeDate(dateMode, startDate, endDate, timePreset, startTime, endTime, tbaOption, tbaCustomDetail, tbaTentativeDate, tbaDuration);
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
      setTbaOption('Schedule Upon Request');
      setTbaCustomDetail('');
      setTbaTentativeDate('');
      setTbaDuration('');
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
      setTbaOption('Schedule Upon Request');
      setTbaCustomDetail('');
      setTbaTentativeDate('');
      setTbaDuration('');
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
      const todayIso = new Date().toISOString().split('T')[0];
      setStartDate(todayIso);
      const courseDays = getNumericDaysFromDuration(formData.duration);
      if (courseDays > 1) {
        setDateMode('range');
        setEndDate(calculateEndDate(todayIso, courseDays));
      } else {
        setDateMode('single');
        setEndDate('');
      }
      setTimePreset('full-day');
      setStartTime('09:00');
      setEndTime('17:00');
      setTbaOption('Schedule Upon Request');
      setTbaCustomDetail('');
      setTbaTentativeDate('');
      setTbaDuration(formData.duration || '');
      setIsRawMode(false);
      setRawIntakeText('');
      setShowDatePicker(true);
    };

    const previewString = isRawMode 
      ? rawIntakeText 
      : formatIntakeDate(dateMode, startDate, endDate, timePreset, startTime, endTime, tbaOption, tbaCustomDetail, tbaTentativeDate, tbaDuration);

    const calculatedDays = getSelectedDurationDays();

    const tbaPresets = [
      'Schedule Upon Request',
      'To Be Announced',
      'Flexible Dates / On-Demand',
      'Group / Corporate Booking',
      'Upcoming Q4 2026',
      'Pampanga Campus Intake',
      'Client Site Delivery'
    ];

    return (
      <div className="space-y-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Upcoming Intake Dates & Times</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Schedule dates, shifts, and calculate multi-day course duration ranges, or configure TBA schedules.</p>
          </div>
          {!showDatePicker && (
            <button
              type="button"
              onClick={handleAddNewClick}
              className="text-xs px-3.5 py-2 font-bold bg-primary text-white hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
              const isTba = dateP?.toLowerCase().includes('tba') || dateP?.toLowerCase().includes('upon request');

              return (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-all group">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={13} className="text-primary dark:text-accent shrink-0" />
                      <span className="font-bold text-gray-900 dark:text-white truncate">{dateP}</span>
                      {isTba && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-accent border border-amber-500/30 shrink-0">
                          TBA
                        </span>
                      )}
                    </div>
                    {timeP && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
                        <span>{timeP}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idx, item)}
                      className="p-1.5 text-gray-400 hover:text-primary dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
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
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
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

        {/* Date & Duration Picker Panel */}
        {showDatePicker && (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-xl space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-primary dark:text-accent" />
                {editingIntakeIdx !== null ? 'Edit Scheduled Intake' : 'Schedule New Intake'}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Raw Mode</span>
                <button
                  type="button"
                  onClick={() => setIsRawMode(!isRawMode)}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${isRawMode ? 'bg-primary dark:bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${isRawMode ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>

            {isRawMode ? (
              <div>
                <label htmlFor="course-custom-intake" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Custom Intake Text</label>
                <input
                  type="text"
                  id="course-custom-intake"
                  name="customIntake"
                  autoComplete="off"
                  placeholder="e.g. 22 - 25 June 2026, 09:00 AM - 05:00 PM or TBA – Schedule Upon Request"
                  value={rawIntakeText}
                  onChange={(e) => setRawIntakeText(e.target.value)}
                  className="w-full p-3 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-accent shadow-inner animate-fade-in"
                />
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Top Controls: Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="flex rounded-lg bg-gray-100 dark:bg-gray-900 p-0.5 w-fit border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        setDateMode('range');
                        if (!endDate && startDate) {
                          setEndDate(calculateEndDate(startDate, getNumericDaysFromDuration(formData.duration)));
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${dateMode === 'range' ? 'bg-white dark:bg-gray-800 text-primary dark:text-accent shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      Date Duration Range
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDateMode('single');
                        setEndDate('');
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${dateMode === 'single' ? 'bg-white dark:bg-gray-800 text-primary dark:text-accent shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      Single Date
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDateMode('tba');
                        if (!tbaDuration && formData.duration) {
                          setTbaDuration(formData.duration);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${dateMode === 'tba' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
                    >
                      ⚡ TBA / Custom Schedule
                    </button>
                  </div>

                  {/* Quick Pick Duration Presets + Duration Badge (for range/single mode) */}
                  {dateMode !== 'tba' && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mr-0.5">Quick Duration:</span>
                      {formData.duration && (
                        <button
                          type="button"
                          onClick={() => handleApplyDuration(getNumericDaysFromDuration(formData.duration))}
                          className="px-2 py-0.5 bg-accent/20 hover:bg-accent/30 text-secondary dark:text-accent font-bold text-xs rounded-lg border border-accent/40 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Auto-calculate duration matching course spec"
                        >
                          ⚡ Auto ({formData.duration})
                        </button>
                      )}
                      {[
                        { days: 1, label: '1 Day' },
                        { days: 2, label: '2 Days' },
                        { days: 3, label: '3 Days' },
                        { days: 4, label: '4 Days' },
                        { days: 5, label: '5 Days' },
                        { days: 7, label: '7 Days' },
                        { days: 7, label: '1 Week' },
                        { days: 14, label: '2 Weeks' },
                        { days: 30, label: '1 Month' }
                      ].map((dObj, dIdx) => (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => handleApplyDuration(dObj.days)}
                          className="px-2 py-0.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 transition-all cursor-pointer"
                        >
                          {dObj.label}
                        </button>
                      ))}

                      {calculatedDays > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-accent/15 text-secondary dark:text-accent border border-accent/30 ml-1">
                          <Clock size={11} />
                          {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* TBA / Custom Schedule Controls */}
                {dateMode === 'tba' ? (
                  <div className="space-y-4 bg-amber-500/5 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                    <div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">
                        Quick TBA Presets
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {tbaPresets.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setTbaOption(preset);
                              setTbaCustomDetail(preset);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              (tbaCustomDetail === preset || tbaOption === preset)
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                                : 'bg-slate-900 dark:bg-slate-950 text-gray-200 border-slate-700 hover:border-amber-400'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration / Number of Days Selection for TBA */}
                    <div className="bg-slate-900/60 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="course-tba-duration" className="block text-xs font-bold text-gray-200">
                          Course Duration (How Many Days / Schedule Length)
                        </label>
                        {tbaDuration && (
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                            <Clock size={11} /> {tbaDuration}
                          </span>
                        )}
                      </div>

                      {/* Quick Duration Preset Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="text-[11px] font-bold text-gray-400 mr-0.5">Quick Duration:</span>
                        {formData.duration && (
                          <button
                            type="button"
                            onClick={() => setTbaDuration(formData.duration || '')}
                            className={`px-2.5 py-1 font-bold text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                              tbaDuration === formData.duration
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                                : 'bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-amber-400 border-amber-500/40'
                            }`}
                          >
                            ⚡ Auto ({formData.duration})
                          </button>
                        )}
                        {['1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '7 Days', '1 Week', '2 Weeks', '1 Month'].map((dur, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() => setTbaDuration(dur)}
                            className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                              tbaDuration === dur
                                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-sm'
                                : 'bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-gray-300 border-slate-700'
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                        {tbaDuration && (
                          <button
                            type="button"
                            onClick={() => setTbaDuration('')}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        id="course-tba-duration"
                        name="tbaDuration"
                        autoComplete="off"
                        placeholder="e.g. 4 Days, 3 Days Intensive, or 2 Weeks"
                        value={tbaDuration}
                        onChange={(e) => setTbaDuration(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="course-tba-detail" className="block text-xs font-bold text-gray-200 mb-1">
                          Custom TBA Description / Specific Details
                        </label>
                        <input
                          type="text"
                          id="course-tba-detail"
                          name="tbaDetail"
                          autoComplete="off"
                          placeholder="e.g. Schedule Upon Request or Inquire for Available Slots"
                          value={tbaCustomDetail}
                          onChange={(e) => {
                            setTbaCustomDetail(e.target.value);
                            setTbaOption(e.target.value);
                          }}
                          className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-semibold shadow-inner"
                        />
                      </div>

                      <div>
                        <label htmlFor="course-tba-date" className="block text-xs font-bold text-gray-200 mb-1">
                          Optional Tentative Target Date
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            id="course-tba-date"
                            name="tbaDate"
                            autoComplete="off"
                            value={tbaTentativeDate}
                            onChange={(e) => setTbaTentativeDate(e.target.value)}
                            className="flex-1 p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                          />
                          {tbaTentativeDate && (
                            <button
                              type="button"
                              onClick={() => setTbaTentativeDate('')}
                              className="px-2.5 py-2 text-xs text-gray-400 hover:text-red-400 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                              title="Clear Date"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="course-tba-time-preset" className="block text-xs font-bold text-gray-200 mb-1">
                        Shift & Hours Specification
                      </label>
                      <select
                        id="course-tba-time-preset"
                        name="tbaTimePreset"
                        autoComplete="off"
                        value={timePreset}
                        onChange={(e) => setTimePreset(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                      >
                        <option value="flexible" className="bg-slate-950 text-white">Flexible Schedule / On-Demand</option>
                        <option value="full-day" className="bg-slate-950 text-white">Full Day: 09:00 AM - 05:00 PM</option>
                        <option value="morning" className="bg-slate-950 text-white">Morning Shift: 08:00 AM - 12:00 PM</option>
                        <option value="afternoon" className="bg-slate-950 text-white">Afternoon Shift: 01:00 PM - 05:00 PM</option>
                        <option value="custom" className="bg-slate-950 text-white">Custom Shift Hours...</option>
                      </select>
                    </div>

                    {timePreset === 'custom' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="course-tba-start-time" className="block text-xs font-bold text-gray-400 mb-1">Start Time</label>
                          <input
                            type="time"
                            id="course-tba-start-time"
                            name="tbaStartTime"
                            autoComplete="off"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="course-tba-end-time" className="block text-xs font-bold text-gray-400 mb-1">End Time</label>
                          <input
                            type="time"
                            id="course-tba-end-time"
                            name="tbaEndTime"
                            autoComplete="off"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Date Fields Row: Dates, Shift, and Custom Times */
                  <div className={`grid gap-3 pt-1 ${timePreset === 'custom' ? 'grid-cols-1 md:grid-cols-4' : (dateMode === 'range' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2')}`}>
                    <div>
                      <label htmlFor="course-start-date" className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                        {dateMode === 'range' ? 'Start Date' : 'Training Date'}
                      </label>
                      <input
                        type="date"
                        id="course-start-date"
                        name="startDate"
                        autoComplete="off"
                        min={new Date().toISOString().split('T')[0]}
                        value={startDate}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          setStartDate(newStart);
                          if (dateMode === 'range' && (!endDate || endDate < newStart)) {
                            const courseDays = getNumericDaysFromDuration(formData.duration);
                            setEndDate(calculateEndDate(newStart, courseDays));
                          }
                        }}
                        className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:ring-2 focus:ring-accent shadow-inner"
                      />
                    </div>

                    {dateMode === 'range' && (
                      <div>
                        <label htmlFor="course-end-date" className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="course-end-date"
                          name="endDate"
                          autoComplete="off"
                          value={endDate}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:ring-2 focus:ring-accent shadow-inner"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="course-time-preset" className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Shift & Hours</label>
                      <select
                        id="course-time-preset"
                        name="timePreset"
                        autoComplete="off"
                        value={timePreset}
                        onChange={(e) => setTimePreset(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-accent shadow-sm"
                      >
                        <option value="full-day" className="bg-slate-950 text-white">Full Day: 09:00 AM - 05:00 PM</option>
                        <option value="morning" className="bg-slate-950 text-white">Morning Shift: 08:00 AM - 12:00 PM</option>
                        <option value="afternoon" className="bg-slate-950 text-white">Afternoon Shift: 01:00 PM - 05:00 PM</option>
                        <option value="flexible" className="bg-slate-950 text-white">Flexible Schedule / On-Demand</option>
                        <option value="custom" className="bg-slate-950 text-white">Custom Shift Hours...</option>
                      </select>
                    </div>

                    {timePreset === 'custom' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="course-start-time" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Start Time</label>
                          <input
                            type="time"
                            id="course-start-time"
                            name="startTime"
                            autoComplete="off"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:ring-2 focus:ring-accent shadow-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="course-end-time" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">End Time</label>
                          <input
                            type="time"
                            id="course-end-time"
                            name="endTime"
                            autoComplete="off"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-700 rounded-xl text-xs text-white [color-scheme:dark] focus:ring-2 focus:ring-accent shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Live Preview Display */}
            {previewString && (
              <div className="p-3 bg-primary/5 dark:bg-accent/10 border border-primary/20 dark:border-accent/30 rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-primary dark:text-accent uppercase tracking-wider block">Live Intake Preview</span>
                  <p className="text-xs text-gray-800 dark:text-white font-semibold mt-0.5 truncate">{previewString}</p>
                </div>
                {calculatedDays > 0 && !isRawMode && dateMode !== 'tba' ? (
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-2xs">
                    {calculatedDays}d
                  </span>
                ) : dateMode === 'tba' ? (
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 shadow-2xs">
                    {tbaDuration ? `TBA (${tbaDuration})` : 'TBA Slot'}
                  </span>
                ) : null}
              </div>
            )}

            {/* Form actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!previewString}
                onClick={handleSaveIntake}
                className="px-4 py-2 text-xs font-bold bg-accent text-secondary hover:bg-accent/90 dark:text-gray-900 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
              <label htmlFor="course-title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
              <input 
                type="text" 
                id="course-title"
                name="courseTitle"
                autoComplete="off"
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            {(() => {
              const allCats = getCategories();
              const parentCats = allCats.filter(c => !c.parentId);
              const selectedParent = parentCats.find(c => c.name === formData.category);
              const subCats = selectedParent ? allCats.filter(c => c.parentId === selectedParent.id) : [];
              return (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="course-category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select 
                      id="course-category"
                      name="courseCategory"
                      autoComplete="off"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                      value={formData.category || ''}
                      onChange={e => setFormData({...formData, category: e.target.value, subCategory: ''})}
                    >
                      <option value="" disabled>Select Category</option>
                      {parentCats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  {subCats.length > 0 && (
                    <div>
                      <label htmlFor="course-subcategory" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sub Category</label>
                      <select 
                        id="course-subcategory"
                        name="courseSubCategory"
                        autoComplete="off"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                        value={formData.subCategory || ''}
                        onChange={e => setFormData({...formData, subCategory: e.target.value})}
                      >
                        <option value="">None</option>
                        {subCats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })()}
            <div>
              <label htmlFor="course-price" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
              <input 
                type="number" 
                id="course-price"
                name="coursePrice"
                autoComplete="off"
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
                value={formData.price || 0}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label htmlFor="course-duration" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
              <input 
                type="text" 
                id="course-duration"
                name="courseDuration"
                autoComplete="off"
                required
                placeholder="e.g. 5 Days or 7 Days"
                className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm ${durationError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}`}
                value={formData.duration || ''}
                onChange={e => {
                  setFormData({...formData, duration: e.target.value});
                  setDurationError('');
                }}
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-gray-400 mr-0.5">Quick Presets:</span>
                {['1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '7 Days', '1 Week', '2 Weeks', '1 Month'].map((dur, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, duration: dur }));
                      setDurationError('');
                    }}
                    className={`px-2 py-0.5 text-xs rounded-lg border transition-all cursor-pointer ${
                      formData.duration === dur
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-sm'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
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
                      <label className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all group ${imageError ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} ${isUploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
                          <input type="file" id="course-image" name="courseImage" autoComplete="off" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml" onChange={handleImageUpload} disabled={isUploadingImage} />
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                            {isUploadingImage ? (
                              <Loader className="animate-spin text-primary dark:text-blue-400" size={20} />
                            ) : (
                              <UploadCloud size={20} className="text-primary dark:text-blue-400" />
                            )}
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                             {isUploadingImage ? 'Uploading & saving to Firestore...' : formData.image ? 'Click to replace image' : 'Click to upload image'}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP up to 10MB (Auto-optimized for web)</span>
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
                  <label htmlFor="course-short-desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Short Description</label>
                  <span className={`text-[10px] font-bold ${((formData.shortDescription || '').length > 160) ? 'text-amber-500' : 'text-gray-400'}`}>
                    {(formData.shortDescription || '').length} / 160 characters {((formData.shortDescription || '').length > 160) && '(SEO recommended length exceeded)'}
                  </span>
                </div>
                <textarea 
                  id="course-short-desc"
                  name="courseShortDescription"
                  autoComplete="off"
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
                  {/* Headings */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertHeading('h2')}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                      title="Heading 2 (Major)"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHeading('h3')}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                      title="Heading 3 (Subheading)"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHeading('h4')}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-bold rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer"
                      title="Heading 4"
                    >
                      H4
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHeading('p')}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                      title="Normal Paragraph"
                    >
                      P
                    </button>
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

                  {/* Inline Styles */}
                  <div className="flex items-center gap-1">
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
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

                  {/* Text & Background Color Pickers */}
                  <div className="flex items-center gap-1.5">
                    {/* Text Color Picker */}
                    <label 
                      className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer relative"
                      title="Change Text Color"
                    >
                      <Palette size={13} className="text-primary dark:text-accent" />
                      <span className="text-[11px]">Color</span>
                      <input
                        type="color"
                        defaultValue="#2563EB"
                        onChange={(e) => applyTextColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </label>

                    {/* Quick Color Swatches */}
                    <div className="flex items-center gap-1">
                      {[
                        { name: 'Default', color: '#1E293B' },
                        { name: 'Primary Blue', color: '#2563EB' },
                        { name: 'Accent Gold', color: '#F59E0B' },
                        { name: 'Emerald Green', color: '#10B981' },
                        { name: 'Rose Red', color: '#EF4444' },
                        { name: 'Purple', color: '#8B5CF6' },
                      ].map((swatch, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyTextColor(swatch.color)}
                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-2xs hover:scale-125 transition-transform cursor-pointer"
                          style={{ backgroundColor: swatch.color }}
                          title={`Color: ${swatch.name}`}
                        />
                      ))}
                    </div>

                    {/* Background Highlight Picker */}
                    <label 
                      className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-semibold rounded border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 transition-colors cursor-pointer relative ml-0.5"
                      title="Text Background Highlight"
                    >
                      <span className="text-[11px] font-bold">Highlight</span>
                      <input
                        type="color"
                        defaultValue="#FEF08A"
                        onChange={(e) => applyHighlightColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

                  {/* Lists & Checklists */}
                  <div className="flex items-center gap-1">
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
                      onClick={insertChecklist}
                      className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                      title="Insert Verified Checklist"
                    >
                      ✓ Checklist
                    </button>
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

                  {/* Callout Boxes */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertAlert('info')}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-medium text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 cursor-pointer"
                      title="Insert Info Box"
                    >
                      + Info
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAlert('success')}
                      className="px-2 py-1 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium text-green-700 dark:text-green-300 rounded border border-green-200 dark:border-green-800 cursor-pointer"
                      title="Insert Success/Standard Box"
                    >
                      + Success
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAlert('warning')}
                      className="px-2 py-1 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium text-amber-700 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800 cursor-pointer"
                      title="Insert Warning Box"
                    >
                      + Warn
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAlert('accent')}
                      className="px-2 py-1 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-xs font-medium text-yellow-700 dark:text-yellow-300 rounded border border-yellow-200 dark:border-yellow-800 cursor-pointer"
                      title="Insert Key Tip / Highlight Box"
                    >
                      + Tip
                    </button>
                  </div>

                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-0.5" />

                  {/* Rich Layout Objects */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={insertQuote}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                      title="Insert Blockquote"
                    >
                      “ Quote
                    </button>
                    <button
                      type="button"
                      onClick={insertTable}
                      className="px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                      title="Insert Data Table"
                    >
                      Table
                    </button>
                    <button
                      type="button"
                      onClick={insertBadge}
                      className="px-2 py-1 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-xs font-medium text-sky-700 dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800 cursor-pointer"
                      title="Insert Tag Badge"
                    >
                      Badge
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
                      onClick={insertLink}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                      title="Insert Hyperlink"
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={clearFormatting}
                      className="px-2 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 transition-colors font-bold cursor-pointer"
                      title="Clear text formatting"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {/* Visual Rich-Text Workspace */}
                <div
                  ref={editorRef}
                  contentEditable={true}
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  className="w-full min-h-[350px] max-h-[600px] overflow-y-auto p-5 bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 rich-text-editor-workspace prose max-w-none dark:prose-invert html-description text-sm leading-relaxed"
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
                  <label htmlFor="course-code" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Code</label>
                  <input 
                    type="text" 
                    id="course-code"
                    name="courseCode"
                    autoComplete="off"
                    placeholder="e.g. GWO-ART-I"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.code || ''}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="course-level" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level / Availability / Schedule</label>
                  <select 
                    id="course-level"
                    name="courseLevel"
                    autoComplete="off"
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
                  <label htmlFor="course-certification" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Official Certification Awarded</label>
                  <input 
                    type="text" 
                    id="course-certification"
                    name="courseCertification"
                    autoComplete="off"
                    placeholder="e.g. GWO Advanced Rescue Training Certificate"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                    value={formData.certificationName || ''}
                    onChange={e => setFormData({...formData, certificationName: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="course-validity" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Certification Validity (Months)</label>
                  <input 
                    type="number" 
                    id="course-validity"
                    name="courseValidity"
                    autoComplete="off"
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
                    name="isGwo"
                    autoComplete="off"
                    className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 dark:bg-gray-950"
                    checked={!!formData.isGwo}
                    onChange={e => setFormData({...formData, isGwo: e.target.checked})}
                  />
                  <label htmlFor="isGwo" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">GWO Certified Course</label>
                </div>
                <div>
                  <label htmlFor="course-provider-code" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Provider / GWO Code</label>
                  <input 
                    type="text" 
                    id="course-provider-code"
                    name="courseProviderCode"
                    autoComplete="off"
                    placeholder="e.g. GWO-PH-001"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white shadow-sm"
                    value={formData.rtoCode || ''}
                    onChange={e => setFormData({...formData, rtoCode: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="course-delivery-mode" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Mode</label>
                  <select 
                    id="course-delivery-mode"
                    name="courseDeliveryMode"
                    autoComplete="off"
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
                  <label htmlFor="course-deposit" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Required Deposit Amount ($)</label>
                  <input 
                    type="number" 
                    id="course-deposit"
                    name="courseDeposit"
                    autoComplete="off"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 gap-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-gray-800 dark:text-gray-200">
                      Collapsible Information Sections (Accordions)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Customize titles, re-order positions (Up/Down), edit rich text content, and add new accordion sections.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSec: CourseAccordionSection = {
                        id: `custom_${Date.now()}`,
                        title: 'New Accordion Section',
                        content: ''
                      };
                      const currentSections = formData.accordionSections || [];
                      setFormData({
                        ...formData,
                        accordionSections: [...currentSections, newSec]
                      });
                    }}
                    className="bg-accent text-secondary hover:bg-accent/90 dark:text-gray-900 font-bold px-4 py-2 rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus size={16} /> Add Accordion Section
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData.accordionSections || []).map((section, idx, arr) => (
                    <RichTextSectionEditor
                      key={section.id || idx}
                      id={section.id}
                      title={section.title}
                      value={section.content}
                      index={idx}
                      total={arr.length}
                      onTitleChange={(newTitle) => {
                        const updated = [...(formData.accordionSections || [])];
                        updated[idx] = { ...updated[idx], title: newTitle };
                        setFormData({ ...formData, accordionSections: updated });
                      }}
                      onChange={(val) => {
                        const updated = [...(formData.accordionSections || [])];
                        updated[idx] = { ...updated[idx], content: val };
                        setFormData({ ...formData, accordionSections: updated });
                      }}
                      onMoveUp={() => {
                        if (idx === 0) return;
                        const updated = [...(formData.accordionSections || [])];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setFormData({ ...formData, accordionSections: updated });
                      }}
                      onMoveDown={() => {
                        if (idx === arr.length - 1) return;
                        const updated = [...(formData.accordionSections || [])];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setFormData({ ...formData, accordionSections: updated });
                      }}
                      onDelete={() => {
                        if (window.confirm(`Are you sure you want to remove the section "${section.title}"?`)) {
                          const updated = (formData.accordionSections || []).filter((_, i) => i !== idx);
                          setFormData({ ...formData, accordionSections: updated });
                        }
                      }}
                    />
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newSec: CourseAccordionSection = {
                        id: `custom_${Date.now()}`,
                        title: 'New Accordion Section',
                        content: ''
                      };
                      const currentSections = formData.accordionSections || [];
                      setFormData({
                        ...formData,
                        accordionSections: [...currentSections, newSec]
                      });
                    }}
                    className="w-full py-3.5 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-accent dark:hover:border-accent text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-gray-50 dark:bg-gray-800/40 hover:bg-accent/5 dark:hover:bg-accent/10 cursor-pointer"
                  >
                    <Plus size={18} /> Add Another Accordion Section
                  </button>
                </div>
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

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="course-ai-prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image Prompt</label>
                            <textarea 
                                id="course-ai-prompt"
                                name="aiPrompt"
                                autoComplete="off"
                                rows={3}
                                placeholder="Describe the image you want (e.g. 'Technicians working on a wind turbine at sunset')"
                                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent transition-all dark:text-white"
                                value={genPrompt}
                                onChange={e => setGenPrompt(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="course-ai-aspect-ratio" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Aspect Ratio</label>
                                <select 
                                    id="course-ai-aspect-ratio"
                                    name="aiAspectRatio"
                                    autoComplete="off"
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
                                <label htmlFor="course-ai-quality" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Quality</label>
                                <select 
                                    id="course-ai-quality"
                                    name="aiQuality"
                                    autoComplete="off"
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
                        id="course-search"
                        name="courseSearch"
                        autoComplete="off"
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
                    id="course-filter-category"
                    name="filterCategory"
                    autoComplete="off"
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {getCategories().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                
                <select 
                    id="course-filter-price"
                    name="filterPrice"
                    autoComplete="off"
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
                    id="course-filter-duration"
                    name="filterDuration"
                    autoComplete="off"
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
                                id="course-select-all"
                                name="selectAll"
                                autoComplete="off"
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
                                    id={`course-row-${course.id}`}
                                    name="selectedCourse"
                                    autoComplete="off"
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={selectedIds.includes(course.id)}
                                    onChange={() => handleSelectRow(course.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 aspect-[16/9] rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 shadow-2xs">
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
                                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                        to={`/courses/${course.id}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 shadow-xs flex items-center justify-center"
                                        title="Preview public course page"
                                    >
                                        <Eye size={17}/>
                                    </Link>
                                    <button 
                                        onClick={() => handleDuplicate(course)} 
                                        className="p-2 text-amber-600 dark:text-accent hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800/40 shadow-xs flex items-center justify-center"
                                        title="Duplicate Course (Clone with all sections & data)"
                                    >
                                        <Copy size={17}/>
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(course)} 
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-xs flex items-center justify-center"
                                        title="Edit Course"
                                    >
                                        <Edit2 size={17}/>
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteModal(course.id)} 
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 shadow-xs flex items-center justify-center"
                                        title="Delete Course"
                                    >
                                        <Trash2 size={17}/>
                                    </button>
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
