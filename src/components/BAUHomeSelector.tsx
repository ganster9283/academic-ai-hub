import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  School, 
  Layers, 
  Calendar, 
  Search, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { BAUFaculty, BAUDepartment, BAUCourse, BAUContext, LanguageMode } from '../types';

interface BAUHomeSelectorProps {
  faculties: BAUFaculty[];
  departments: BAUDepartment[];
  courses: BAUCourse[];
  selectedContext: BAUContext;
  onSelectContext: (ctx: BAUContext) => void;
  onOpenSubjectPage: (course: BAUCourse) => void;
  onOpenAITutor: (course: BAUCourse) => void;
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, type: 'course', title: string) => void;
  languageMode: LanguageMode;
}

export const BAUHomeSelector: React.FC<BAUHomeSelectorProps> = ({
  faculties,
  departments,
  courses,
  selectedContext,
  onSelectContext,
  onOpenSubjectPage,
  onOpenAITutor,
  onOpenSearch,
  onOpenAddModal,
  bookmarks,
  onToggleBookmark,
  languageMode
}) => {
  const isBn = languageMode === 'bn';

  // Filtered lists
  const availableDepartments = useMemo(() => {
    if (!selectedContext.facultyId) return departments;
    return departments.filter(d => d.facultyId === selectedContext.facultyId);
  }, [departments, selectedContext.facultyId]);

  const availablePrograms = useMemo(() => {
    const selectedDept = departments.find(d => d.id === selectedContext.departmentId);
    if (selectedDept) return selectedDept.programs;
    
    // Fallback programs
    return [
      'B.Sc. Ag. (Hons.)',
      'DVM (Doctor of Veterinary Medicine)',
      'B.Sc. Animal Husbandry (Hons.)',
      'B.Sc. Ag. Econ. (Hons.)',
      'B.Sc. Ag. Engg.',
      'B.Sc. Fisheries (Hons.)',
      'MS',
      'PhD'
    ];
  }, [departments, selectedContext.departmentId]);

  const availableCourses = useMemo(() => {
    return courses.filter(c => {
      if (selectedContext.facultyId && c.facultyId !== selectedContext.facultyId) return false;
      if (selectedContext.departmentId && c.departmentId !== selectedContext.departmentId) return false;
      if (selectedContext.year && c.year !== selectedContext.year) return false;
      if (selectedContext.semester && c.semester !== selectedContext.semester) return false;
      return true;
    });
  }, [courses, selectedContext]);

  const currentCourse = useMemo(() => {
    return courses.find(c => c.id === selectedContext.courseId) || availableCourses[0];
  }, [courses, selectedContext.courseId, availableCourses]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden my-4 border border-indigo-500/30">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-5 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-900/40 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                BAU Official Academic Database
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              🎓 BAU ACADEMIC AI HUB
            </h2>
            <p className="text-xs text-indigo-200/80">
              {isBn ? 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় অ্যাকাডেমিক কোর্স, লেকচার ও এআই গৃহশিক্ষক' : 'Bangladesh Agricultural University Course Database & AI Learning System'}
            </p>
          </div>
        </div>

        {/* Global Search & Add Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white backdrop-blur-md border border-white/15 transition-all"
          >
            <Search className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? 'খুঁজুন' : 'Search Database'}</span>
          </button>
          
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            title="Add new course or department"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? '+ নতুন কোর্স যোগ' : '+ Add Course'}</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Selectors (Section 23 of Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-5 relative z-10">
        
        {/* 1. Select Faculty */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>১. অনুষদ (Faculty)</span>
          </label>
          <select
            value={selectedContext.facultyId || ''}
            onChange={(e) => onSelectContext({ ...selectedContext, facultyId: e.target.value || undefined, departmentId: undefined, courseId: undefined })}
            className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="">-- সব অনুষদ (All) --</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {isBn ? f.nameBn : f.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Select Department */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
            <School className="w-3.5 h-3.5 text-blue-400" />
            <span>২. বিভাগ (Department)</span>
          </label>
          <select
            value={selectedContext.departmentId || ''}
            onChange={(e) => onSelectContext({ ...selectedContext, departmentId: e.target.value || undefined, courseId: undefined })}
            className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="">-- সব বিভাগ (All) --</option>
            {availableDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {isBn ? d.nameBn : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Select Program */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>৩. ডিগ্রি/প্রোগ্রাম</span>
          </label>
          <select
            value={selectedContext.program || ''}
            onChange={(e) => onSelectContext({ ...selectedContext, program: e.target.value || undefined })}
            className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="">-- সব ডিগ্রি (All) --</option>
            {availablePrograms.map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 4. Select Year (Level) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>৪. বছর (Level)</span>
          </label>
          <select
            value={selectedContext.year || ''}
            onChange={(e) => onSelectContext({ ...selectedContext, year: e.target.value ? Number(e.target.value) : undefined, courseId: undefined })}
            className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="">-- সব লেভেল --</option>
            <option value="1">Level 1 (১ম বর্ষ)</option>
            <option value="2">Level 2 (২য় বর্ষ)</option>
            <option value="3">Level 3 (৩য় বর্ষ)</option>
            <option value="4">Level 4 (৪র্থ বর্ষ)</option>
          </select>
        </div>

        {/* 5. Select Semester */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>৫. সেমিস্টার</span>
          </label>
          <select
            value={selectedContext.semester || ''}
            onChange={(e) => onSelectContext({ ...selectedContext, semester: e.target.value ? Number(e.target.value) : undefined, courseId: undefined })}
            className="w-full bg-slate-900/90 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="">-- সব সেমিস্টার --</option>
            <option value="1">Semester 1 (১ম সেমিস্টার)</option>
            <option value="2">Semester 2 (২য় সেমিস্টার)</option>
          </select>
        </div>

        {/* 6. Select Course */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>৬. কোর্স (Course)</span>
          </label>
          <select
            value={selectedContext.courseId || currentCourse?.id || ''}
            onChange={(e) => {
              const selectedC = courses.find(c => c.id === e.target.value);
              if (selectedC) {
                onSelectContext({
                  facultyId: selectedC.facultyId,
                  departmentId: selectedC.departmentId,
                  program: selectedC.program,
                  year: selectedC.year,
                  semester: selectedC.semester,
                  courseId: selectedC.id,
                  courseCode: selectedC.courseCode,
                  courseTitle: selectedC.courseTitle
                });
              }
            }}
            className="w-full bg-emerald-950/80 border border-emerald-500/80 rounded-xl px-3 py-2 text-xs text-emerald-100 font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            {availableCourses.length === 0 ? (
              <option value="">তথ্য পাওয়া যায়নি (Not Available)</option>
            ) : (
              availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseCode}: {isBn ? c.courseTitleBn : c.courseTitle} ({c.credit} Cr)
                </option>
              ))
            )}
          </select>
        </div>

      </div>

      {/* Selected Course Quick Overview Card & Action Buttons */}
      {currentCourse ? (
        <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-emerald-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                {currentCourse.courseCode}
              </span>
              <span className="text-xs font-bold text-indigo-200">
                {currentCourse.departmentNameBn} • {currentCourse.program}
              </span>
              <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-md text-white">
                ক্রেডিট: {currentCourse.credit}
              </span>
              <span className="text-[11px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-400/30">
                L-{currentCourse.year} S-{currentCourse.semester}
              </span>
              <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentCourse.sourceName} Verified
              </span>
            </div>

            <h3 className="text-lg font-black text-white tracking-tight">
              {isBn ? currentCourse.courseTitleBn : currentCourse.courseTitle}
            </h3>
            <p className="text-xs text-slate-200/90 line-clamp-2">
              {isBn ? currentCourse.descriptionBn : currentCourse.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 flex-wrap sm:flex-nowrap gap-y-2">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(currentCourse.id, 'course', `${currentCourse.courseCode}: ${currentCourse.courseTitle}`)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookmarks.includes(currentCourse.id)
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Bookmark Course"
            >
              {bookmarks.includes(currentCourse.id) ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            {/* Open Subject Page */}
            <button
              onClick={() => onOpenSubjectPage(currentCourse)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isBn ? 'বিষয় ভিত্তিক পেজ খুলুন' : 'Open Subject Page'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Open AI Tutor with Context */}
            <button
              onClick={() => onOpenAITutor(currentCourse)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl border border-indigo-400/40 shadow-lg transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isBn ? 'এই কোর্সের AI টিউটর' : 'Open AI Tutor'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>অফিসিয়াল কোর্স তথ্য এখনো সম্পূর্ণ পাওয়া যায়নি (Official course information not available yet.)</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="text-xs font-bold text-emerald-300 hover:underline"
          >
            + কোর্স যোগ করুন
          </button>
        </div>
      )}

    </div>
  );
};
