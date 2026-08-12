import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  BookOpen, 
  Check, 
  Plus, 
  Trash2, 
  Award, 
  Target
} from 'lucide-react';
import { LanguageMode, GradeLevel, StudyPlanResult, SubjectCategory } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface StudyPlannerTabProps {
  languageMode: LanguageMode;
  gradeLevel?: GradeLevel;
  onSaveAsNote?: (title: string, content: string, subject?: SubjectCategory) => void;
}

export const StudyPlannerTab: React.FC<StudyPlannerTabProps> = ({
  languageMode
}) => {
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState<string[]>([
    'উচ্চতর গণিত (Higher Math)',
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'ইংরেজি (English)'
  ]);
  const [dailyHours, setDailyHours] = useState('4');
  const [examDate, setExamDate] = useState('১ মাস পর (In 1 Month)');
  const [plannerLang, setPlannerLang] = useState<LanguageMode>(languageMode);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudyPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSubject = () => {
    if (!subjectInput.trim()) return;
    if (!subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
    }
    setSubjectInput('');
  };

  const removeSubject = (idx: number) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (subjects.length === 0) {
      setError('কমপক্ষে একটি বিষয় যোগ করুন');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects,
          dailyHours: `${dailyHours} Hours`,
          examDate,
          language: plannerLang
        })
      });

      if (!response.ok) {
        throw new Error('স্টাডি প্ল্যান তৈরি করতে সমস্যা হয়েছে');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Personal Study Routine & Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্টাডি প্ল্যানার (Smart Study Planner)
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            তোমার বিষয়সমূহ, দৈনিক পড়ার সময় এবং পরীক্ষার তারিখের সাথে মিল রেখে একটি বাস্তবমুখী রুটিন এবং রিভিশন প্ল্যান বানিয়ে নাও।
          </p>
        </div>
      </div>

      {/* Inputs Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            পড়ার বিষয়সমূহ (Subjects to Cover)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
              placeholder="বিষয় লিখুন (যেমন: জীববিজ্ঞান, ICT, Accounting...)"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <VoiceInputButton
              onTranscript={(text) => setSubjectInput(text)}
              lang={plannerLang === 'en' ? 'en-US' : 'bn-BD'}
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>যোগ করুন</span>
            </button>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {subjects.map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => removeSubject(idx)}
                  className="hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              দৈনিক পড়ার সময় (Daily Study Hours)
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="2">২ ঘণ্টা (2 Hours)</option>
              <option value="3">৩ ঘণ্টা (3 Hours)</option>
              <option value="4">৪ ঘণ্টা (4 Hours)</option>
              <option value="6">৬ ঘণ্টা (6 Hours)</option>
              <option value="8">৮+ ঘণ্টা (8+ Hours Intensive)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              পরীক্ষার সময় (Exam Date)
            </label>
            <input
              type="text"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              placeholder="যেমন: ১৫ দিন পর / ১ মাস পর..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ভাষা (Language)
            </label>
            <select
              value={plannerLang}
              onChange={(e) => setPlannerLang(e.target.value as LanguageMode)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="bn">বাংলা (Bengali)</option>
              <option value="en">English</option>
              <option value="bilingual">দ্বিভাষিক (Bilingual)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeneratePlan}
          disabled={isLoading || subjects.length === 0}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>স্টাডি প্ল্যান তৈরি করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>স্টাডি প্ল্যান তৈরি করুন (Generate Routine)</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Generated Routine */}
      {result && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                স্মার্ট পড়ার রুটিন
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 break-words">
                {result.title}
              </h3>
            </div>
            <TTSButton text={`${result.title}. ${result.summary}`} lang={plannerLang === 'en' ? 'en-US' : 'bn-BD'} />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 bg-teal-50/60 p-4 rounded-2xl border border-teal-100 leading-relaxed">
            {result.summary}
          </p>

          {/* Daily Schedule Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              দৈনিক রুটিন ও সময়সূচি (Daily Schedule)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[340px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">সময় (Time Slot)</th>
                    <th className="p-3">বিষয় (Subject)</th>
                    <th className="p-3">কাজ / লক্ষ্য (Activity)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {result.dailySchedule.map((slot, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-teal-800 whitespace-nowrap">{slot.timeSlot}</td>
                      <td className="p-3 font-bold text-slate-900">{slot.subject}</td>
                      <td className="p-3 text-slate-600">{slot.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Milestones */}
          {result.weeklyMilestones && result.weeklyMilestones.length > 0 && (
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                সাপ্তাহিক লক্ষ্যমাত্রা (Weekly Milestones)
              </h4>
              <ul className="space-y-1.5 pl-2">
                {result.weeklyMilestones.map((m, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-indigo-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategy & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <h4 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                পরীক্ষার প্রস্তুতির কৌশল (Exam Strategy)
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed">
                {result.examPrepStrategy}
              </p>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                কার্যকর পরামর্শ (Study Tips)
              </h4>
              <ul className="space-y-1 text-xs text-emerald-950">
                {result.tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
