import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  BookOpen, 
  GraduationCap, 
  ListChecks, 
  Layers
} from 'lucide-react';
import { LanguageMode, GradeLevel, AssignmentResult, SubjectCategory } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface AssignmentGeneratorTabProps {
  languageMode: LanguageMode;
  gradeLevel?: GradeLevel;
  onSaveAsNote?: (title: string, content: string, subject?: SubjectCategory) => void;
}

export const AssignmentGeneratorTab: React.FC<AssignmentGeneratorTabProps> = ({
  languageMode
}) => {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('College / Class 11-12');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [assignmentLang, setAssignmentLang] = useState<LanguageMode>(languageMode);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          classLevel,
          length,
          language: assignmentLang
        })
      });

      if (!response.ok) {
        throw new Error('অ্যাসাইনমেন্ট তৈরি করা সম্ভব হয়নি');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'সাময়িক ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const discussionList = result ? (
    Array.isArray(result.mainDiscussion)
      ? result.mainDiscussion
      : typeof result.mainDiscussion === 'string'
      ? [result.mainDiscussion]
      : (result.mainBodySections || []).map(s => `${s.sectionTitle}: ${s.content}`)
  ) : [];

  const examplesList = result?.examples || result?.keyTakeaways || [];

  const formattedFullText = result ? `
TITLE: ${result.title}
TOPIC: ${result.topic} (${result.classLevel || classLevel})

--- INTRODUCTION ---
${result.introduction}

--- MAIN DISCUSSION ---
${discussionList.join('\n\n')}

--- EXAMPLES & CASE STUDIES ---
${examplesList.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}

--- CONCLUSION ---
${result.conclusion}

--- REFERENCES ---
${(result.references || []).join('\n')}
  `.trim() : '';

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(formattedFullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([formattedFullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.title.replace(/[^a-z0-9]/gi, '_')}_Assignment.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Academic Assignment Writer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            অ্যাসাইনমেন্ট জেনারেটর (Assignment Generator)
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            যেকোনো বিষয়ের উপর সম্পূর্ণ সাজানো অ্যাসাইনমেন্ট তৈরি করুন— শিরোনাম, ভূমিকা, মূল আলোচনা, উদাহরণ, উপসংহার এবং রেফারেন্স সহ।
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              অ্যাসাইনমেন্টের বিষয় / Topic Name *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: বাংলাদেশের অর্থনীতিতে ডিজিটাল প্রযুক্তির ভূমিকা, Solar System, Photoelectric Effect..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
              <VoiceInputButton
                onTranscript={(text) => setTopic((prev) => prev ? `${prev} ${text}` : text)}
                lang={assignmentLang === 'en' ? 'en-US' : 'bn-BD'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                শ্রেণী/স্তর (Class Level)
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="School / Class 6-8">School / Class 6-8 (জেএসসি)</option>
                <option value="School / Class 9-10">School / Class 9-10 (এসএসসি)</option>
                <option value="College / Class 11-12">College / Class 11-12 (এইচএসসি)</option>
                <option value="University / Undergraduate">University / Undergraduate (বিশ্ববিদ্যালয়)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                দৈর্ঘ্য (Length)
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="short">সংক্ষিপ্ত (Short ~400 words)</option>
                <option value="medium">মাঝারি (Medium ~800 words)</option>
                <option value="long">বিস্তারিত (Long ~1200+ words)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ভাষা (Language)
              </label>
              <select
                value={assignmentLang}
                onChange={(e) => setAssignmentLang(e.target.value as LanguageMode)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
                <option value="bilingual">দ্বিভাষিক (Bilingual Mix)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>অ্যাসাইনমেন্ট তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>অ্যাসাইনমেন্ট তৈরি করুন (Generate Assignment)</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Generated Assignment Result */}
      {result && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                {result.classLevel || classLevel}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 break-words">
                {cleanMathAndMarkdown(result.title)}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <TTSButton text={formattedFullText} lang={assignmentLang === 'en' ? 'en-US' : 'bn-BD'} />

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড (Text)</span>
              </button>
            </div>
          </div>

          <div className="space-y-6 text-slate-800 text-sm leading-relaxed">
            {/* Introduction */}
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100/80 space-y-1.5">
              <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                ১. ভূমিকা (Introduction)
              </h4>
              <p className="text-slate-700 text-xs sm:text-sm break-words">
                {cleanMathAndMarkdown(result.introduction)}
              </p>
            </div>

            {/* Main Discussion */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                ২. মূল আলোচনা (Main Discussion)
              </h4>
              <div className="space-y-3 pl-2">
                {discussionList.map((para, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 break-words">
                    {cleanMathAndMarkdown(para)}
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {examplesList.length > 0 && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-amber-600" />
                  ৩. বাস্তব উদাহরণ ও মূল পয়েন্ট (Examples & Key Takeaways)
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {examplesList.map((ex, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-amber-950 flex items-start gap-2 break-words">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{cleanMathAndMarkdown(ex)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conclusion */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100/80 space-y-1.5">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                ৪. উপসংহার (Conclusion)
              </h4>
              <p className="text-emerald-950 text-xs sm:text-sm break-words">
                {cleanMathAndMarkdown(result.conclusion)}
              </p>
            </div>

            {/* References */}
            {result.references && result.references.length > 0 && (
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  ৫. তথ্যসূত্র / রেফারেন্স (References & Bibliography)
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 font-mono pl-2">
                  {result.references.map((ref, idx) => (
                    <li key={idx} className="break-words">
                      • {cleanMathAndMarkdown(ref)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
