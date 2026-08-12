import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Loader2, 
  Smile, 
  BookOpen, 
  GraduationCap, 
  School, 
  CheckCircle2 
} from 'lucide-react';
import { LanguageMode, GradeLevel, SubjectCategory, SimplifiedExplanationResult } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface AIExplainerTabProps {
  languageMode: LanguageMode;
  gradeLevel?: GradeLevel;
  onSaveAsNote?: (title: string, content: string, subject?: SubjectCategory) => void;
}

export const AIExplainerTab: React.FC<AIExplainerTabProps> = ({
  languageMode,
  gradeLevel,
  onSaveAsNote
}) => {
  const [topic, setTopic] = useState('');
  const [targetLevel, setTargetLevel] = useState<'beginner' | 'school' | 'college' | 'university'>('school');
  const [explainerLang, setExplainerLang] = useState<LanguageMode>(languageMode);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimplifiedExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain-simply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetLevel,
          language: explainerLang
        })
      });

      if (!response.ok) {
        throw new Error('সহজ ব্যাখ্যা তৈরি করতে সমস্যা হয়েছে');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const levelOptions = [
    { id: 'beginner', labelBn: 'একদম সহজ (Beginner / 5-Year Old)', icon: Smile },
    { id: 'school', labelBn: 'স্কুল লেভেল (Class 6-10)', icon: School },
    { id: 'college', labelBn: 'কলেজ লেভেল (HSC / Class 11-12)', icon: BookOpen },
    { id: 'university', labelBn: 'বিশ্ববিদ্যালয় (University Level)', icon: GraduationCap }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-200" />
            <span>AI "Explain Simply" Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            সহজ ব্যাখ্যা (Explain Simply)
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            যেকোনো কঠিন বা জটিল বিষয়কে নিজের মতো সহজ ভাষায় বুঝে নাও— তোমার পড়ার লেভেল অনুযায়ী উদাহরণ সহ।
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
        <form onSubmit={handleExplain} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                কঠিন বিষয়টি লিখুন বা পেস্ট করুন (Topic / Concept) *
              </label>
              <VoiceInputButton
                onTranscript={(t) => setTopic((prev) => prev ? `${prev} ${t}` : t)}
                lang={explainerLang === 'en' ? 'en-US' : 'bn-BD'}
              />
            </div>

            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="যেমন: Quantum Entanglement, Newton's Third Law, Photosynthesis, Inflation in Economics, GDP..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              বুঝে নেওয়ার লেভেল নির্বাচন করুন (Select Level)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {levelOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = targetLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTargetLevel(opt.id as any)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="text-xs">{opt.labelBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>সহজ ভাষায় ব্যাখ্য করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span>সহজ ভাষায় বুঝিয়ে দাও (Explain Simply)</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Explanation Result */}
      {result && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                {result.targetLevel} level explanation
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 break-words">
                {result.topic}
              </h3>
            </div>

            <TTSButton
              text={`${result.explanationBn}. ${result.realWorldAnalogy}`}
              lang={explainerLang === 'en' ? 'en-US' : 'bn-BD'}
            />
          </div>

          {/* Real world analogy */}
          {result.realWorldAnalogy && (
            <div className="bg-amber-50/80 p-4.5 rounded-2xl border border-amber-200/80 space-y-1.5">
              <span className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-600" />
                বাস্তব জীবনের সুন্দর এনালজি (Real-World Analogy)
              </span>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium break-words">
                "{cleanMathAndMarkdown(result.realWorldAnalogy)}"
              </p>
            </div>
          )}

          {/* Explanations */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                বাংলা ব্যাখ্যা (Bengali Explanation)
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed break-words">
                {cleanMathAndMarkdown(result.explanationBn)}
              </p>
            </div>

            {result.explanationEn && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  English Explanation
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                  {cleanMathAndMarkdown(result.explanationEn)}
                </p>
              </div>
            )}
          </div>

          {/* Key Takeaways */}
          {result.keyTakeaways && result.keyTakeaways.length > 0 && (
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                মনে রাখার মতো ৩টি মূল বিষয় (Key Takeaways)
              </h4>
              <ul className="space-y-1.5 pl-2">
                {result.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-emerald-950 flex items-start gap-2 break-words">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{cleanMathAndMarkdown(takeaway)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
