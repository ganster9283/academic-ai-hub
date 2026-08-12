import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Building2, School, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { BAUFaculty, BAUDepartment, BAUCourse, LanguageMode } from '../types';

interface BAUSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculties: BAUFaculty[];
  departments: BAUDepartment[];
  courses: BAUCourse[];
  onSelectCourse: (course: BAUCourse) => void;
  languageMode: LanguageMode;
}

export const BAUSearchModal: React.FC<BAUSearchModalProps> = ({
  isOpen,
  onClose,
  faculties,
  departments,
  courses,
  onSelectCourse,
  languageMode
}) => {
  const isBn = languageMode === 'bn';
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();

    return courses.filter(c => 
      c.courseCode.toLowerCase().includes(q) ||
      c.courseTitle.toLowerCase().includes(q) ||
      c.courseTitleBn.includes(q) ||
      c.departmentNameEn.toLowerCase().includes(q) ||
      c.departmentNameBn.includes(q) ||
      c.facultyNameEn.toLowerCase().includes(q) ||
      c.facultyNameBn.includes(q) ||
      c.topics.some(t => t.toLowerCase().includes(q))
    );
  }, [searchTerm, courses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden mt-12 space-y-0">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isBn ? 'কোড, টাইটেল, ডিপার্টমেন্ট বা বিষয় লিখে খুঁজুন... (যেমন: Animal Nutrition, AGRO 101)' : 'Search course code, title, topic or department...'}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-1">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
              <p>{isBn ? 'উপরে আপনার বিষয় বা কোর্স কোড লিখুন' : 'Type to search BAU academic courses'}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              {isBn ? 'কোনো কোর্স তথ্য পাওয়া যায়নি।' : 'No matching course found.'}
            </div>
          ) : (
            searchResults.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCourse(c);
                  onClose();
                }}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/70 rounded-2xl border border-slate-200/80 hover:border-indigo-200 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                      {c.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {c.departmentNameBn} • Level {c.year}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                    {isBn ? c.courseTitleBn : c.courseTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {c.topics.slice(0, 3).join(', ')}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
