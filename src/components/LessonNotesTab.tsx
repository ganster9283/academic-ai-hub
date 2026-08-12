import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  Check, 
  Copy, 
  Bookmark, 
  Table,
  Zap,
  ListOrdered
} from 'lucide-react';
import { GradeLevel, LanguageMode, LessonNote, SubjectCategory } from '../types';
import { SUBJECT_OPTIONS } from '../data/presets';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface LessonNotesTabProps {
  languageMode: LanguageMode;
  gradeLevel: GradeLevel;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
}

export const LessonNotesTab: React.FC<LessonNotesTabProps> = ({
  languageMode,
  gradeLevel,
  onSaveAsNote
}) => {
  const [topic, setTopic] = useState('');
  const [textContent, setTextContent] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('physics');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<LessonNote | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateNote = async () => {
    if (!topic.trim() && !textContent.trim()) {
      setErrorMsg('দয়া করে একটি বিষয়ের নাম লিখুন বা চ্যাপ্টারের টেক্সট পেস্ট করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/explain-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Lesson Summary Note',
          textContent: textContent.trim(),
          subject,
          grade: gradeLevel,
          language: languageMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson note');
      }

      const data = await response.json();
      
      const newNote: LessonNote = {
        id: `note_${Date.now()}`,
        topic: data.topic || topic || 'Study Note',
        subject,
        grade: gradeLevel,
        summaryBn: data.summaryBn || '',
        summaryEn: data.summaryEn || '',
        keyConcepts: data.keyConcepts || [],
        formulasOrRules: data.formulasOrRules || [],
        importantTerms: data.importantTerms || [],
        practiceQuestions: data.practiceQuestions || [],
        createdAt: Date.now()
      };

      setGeneratedNote(newNote);
    } catch (err: any) {
      console.error('Lesson Note Error:', err);
      setErrorMsg(err?.message || 'নোটস প্রস্তুত করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNote = () => {
    if (!generatedNote) return;
    const text = `
# ${generatedNote.topic} (${generatedNote.subject.toUpperCase()})

## সারসংক্ষেপ (Summary in Bangla):
${generatedNote.summaryBn}

## Summary in English:
${generatedNote.summaryEn}

## মূল ধারণা (Key Concepts):
${generatedNote.keyConcepts.map(c => `- ${c}`).join('\n')}

## সূত্র ও গুরুত্বপূর্ণ নিয়ম (Formulas & Rules):
${generatedNote.formulasOrRules.map(f => `- ${f}`).join('\n')}

## গুরুত্বপূর্ণ শব্দার্থ (Key Terms):
${generatedNote.importantTerms.map(t => `- ${t.term}: ${t.meaningBn} (${t.meaningEn})`).join('\n')}

## অনুশীলনী প্রশ্ন (Practice Questions):
${generatedNote.practiceQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    if (!generatedNote) return;
    const content = `
### সারসংক্ষেপ (Bangla):
${generatedNote.summaryBn}

### English Summary:
${generatedNote.summaryEn}

### Key Concepts:
${generatedNote.keyConcepts.map(c => `• ${c}`).join('\n')}

### Formulas & Rules:
${generatedNote.formulasOrRules.map(f => `• ${f}`).join('\n')}
    `;
    onSaveAsNote(generatedNote.topic, content, generatedNote.subject);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-indigo-900 text-white p-6 rounded-3xl shadow-md">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md text-emerald-200 mb-3 border border-emerald-400/30">
          <FileText className="w-3.5 h-3.5 text-emerald-300" />
          <span>Smart Study Notes Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">পাঠ ও নোটস জেনারেটর (Lesson Notes)</h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
          যেকোনো বিষয় বা অধ্যায়ের নাম লেখো অথবা বইয়ের অনুচ্ছেদ পেস্ট করো। AI তোমার জন্য তৈরি করে দেবে সাজানো লেসন নোট, মূল সূত্র, গুরুত্বপূর্ণ শব্দার্থ ও অনুশীলনী প্রশ্ন!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            {/* Topic Input with Voice */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  অধ্যায় / টপিকের নাম (Topic Title)
                </label>
                <VoiceInputButton
                  onTranscript={(t) => setTopic((prev) => prev ? `${prev} ${t}` : t)}
                  lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
                />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: সালোকসংশ্লেষণ, চাহিদা ও যোগান, Newton's Laws"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Sample Topics */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                জনপ্রিয় টপিক থেকে বেছে নাও (Sample Topics)
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {[
                  { topic: 'পিথাগোরাসের উপপাদ্য', subj: 'mathematics' },
                  { topic: 'নিউটনের গতিসূত্র', subj: 'physics' },
                  { topic: 'পর্যায় সারণি ও রাসায়নিক বন্ধন', subj: 'chemistry' },
                  { topic: 'সালোকসংশ্লেষণ ও ডিএনএ গঠন', subj: 'biology' },
                  { topic: 'Right Forms of Verbs & Voice', subj: 'english' },
                  { topic: 'ফসলের পর্যায়ক্রমিক চাষ ও সেচ', subj: 'bengali' },
                  { topic: 'বাইনারি সংখ্যা ও লজিক গেট', subj: 'ict' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(item.topic);
                      setSubject(item.subj as SubjectCategory);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {item.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                বিষয় (Subject)
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.labelBn} ({s.labelEn})
                  </option>
                ))}
              </select>
            </div>

            {/* Text Paragraph Input (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                বইয়ের অনুচ্ছেদ / টেক্সট পেস্ট করো (Optional Textbook Text)
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                placeholder="বইয়ের অনুচ্ছেদ বা প্যারাগ্রাফ এখানে পেস্ট করতে পারো..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleGenerateNote}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-100"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>নোট তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>স্মার্ট নোট তৈরি করো (Generate Note)</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Note View Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">লেসন নোট সাজানো হচ্ছে...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  বাংলা সারসংক্ষেপ, সূত্র, এবং অনুশীলনী প্রশ্ন সাজানো হচ্ছে।
                </p>
              </div>
            </div>
          ) : generatedNote ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              {/* Header Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{generatedNote.topic}</h3>
                  <p className="text-xs text-slate-500">বিষয়: {generatedNote.subject.toUpperCase()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TTSButton
                    text={`${generatedNote.summaryBn}. ${generatedNote.summaryEn}`}
                    lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
                  />

                  <button
                    onClick={handleCopyNote}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="কপি করুন"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleSaveToLibrary}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>সেভ নোট</span>
                  </button>
                </div>
              </div>

              {/* Bangla Summary */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  বাংলা সারসংক্ষেপ (Bangla Summary)
                </h4>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-wrap break-words">
                  {cleanMathAndMarkdown(generatedNote.summaryBn)}
                </p>
              </div>

              {/* English Summary */}
              {generatedNote.summaryEn && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    English Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                    {cleanMathAndMarkdown(generatedNote.summaryEn)}
                  </p>
                </div>
              )}

              {/* Key Concepts */}
              {generatedNote.keyConcepts.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    মূল ধারণাসমূহ (Key Concepts)
                  </h4>
                  <ul className="space-y-1.5 pl-2">
                    {generatedNote.keyConcepts.map((concept, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2 break-words">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span>{cleanMathAndMarkdown(concept)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formulas & Rules */}
              {generatedNote.formulasOrRules.length > 0 && (
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 formula-card">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    গাণিতিক সূত্র ও ব্যাকরণের নিয়ম (Formulas & Rules)
                  </h4>
                  <ul className="space-y-1.5">
                    {generatedNote.formulasOrRules.map((rule, idx) => (
                      <li key={idx} className="text-xs sm:text-sm font-semibold text-amber-950 bg-white/90 p-2.5 rounded-lg border border-amber-200/60 font-mono break-words">
                        {cleanMathAndMarkdown(rule)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Vocabulary Table */}
              {generatedNote.importantTerms.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-indigo-600" />
                    গুরুত্বপূর্ণ শব্দার্থ (Key Terminology)
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl max-w-full">
                    <table className="w-full text-left text-xs sm:text-sm min-w-[320px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Term (শব্দ)</th>
                          <th className="p-2.5">বাংলা অর্থ</th>
                          <th className="p-2.5">English Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {generatedNote.importantTerms.map((term, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-indigo-900 break-words">{cleanMathAndMarkdown(term.term)}</td>
                            <td className="p-2.5 break-words">{cleanMathAndMarkdown(term.meaningBn)}</td>
                            <td className="p-2.5 text-slate-500 break-words">{cleanMathAndMarkdown(term.meaningEn)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Practice Questions */}
              {generatedNote.practiceQuestions.length > 0 && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-indigo-600" />
                    স্ব-মূল্যায়ন প্রশ্ন (Revision Questions)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-800">
                    {generatedNote.practiceQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-100/70 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-slate-700">কোনো লেসন নোট এখনও তৈরি হয়নি</h3>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                বাম পাশের ঘরে কোনো অধ্যায়ের নাম লিখে "স্মার্ট নোট তৈরি করো" বাটনে ক্লিক করুন।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
