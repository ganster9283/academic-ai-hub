import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  ImageIcon, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  Bookmark,
  Layers,
  BookOpen
} from 'lucide-react';
import { GradeLevel, LanguageMode, SnapSolveResult, SubjectCategory } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface SnapSolveTabProps {
  languageMode: LanguageMode;
  gradeLevel: GradeLevel;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
}

export const SnapSolveTab: React.FC<SnapSolveTabProps> = ({
  languageMode,
  gradeLevel,
  onSaveAsNote
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SnapSolveResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('ফাইলের সাইজ ১৫ মেগাবাইটের কম হতে হবে। (File size must be under 15MB)');
        return;
      }
      setErrorMsg(null);
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!imagePreview || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/snap-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType,
          additionalPrompt,
          language: languageMode,
          grade: gradeLevel
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to solve image question');
      }

      const data: SnapSolveResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Snap & Solve Error:', err);
      setErrorMsg(err?.message || 'ছবি থেকে সমাধান তৈরি করা সম্ভব হয়নি। আবার চেষ্টা কর।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResult = () => {
    if (!result) return;
    const content = `
### Extracted Question:
${result.extractedQuestionText}

### Final Answer:
- **Bangla:** ${result.finalAnswerBn}
- **English:** ${result.finalAnswerEn}

### Solution Steps:
${result.solutionSteps.map(s => `**Step ${s.stepNumber}: ${s.titleBn} / ${s.titleEn}**\n${s.explanationBn}\n${s.explanationEn}`).join('\n\n')}

### Core Concept:
${result.conceptExplanationBn}
    `;

    onSaveAsNote(`Snap Solve: ${result.subject}`, content, 'mathematics');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md text-indigo-200 mb-3 border border-indigo-400/30">
            <Camera className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Visual Question Solver</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">ছবি তুলে সমাধান পাও (Snap & Solve)</h2>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl">
            বইয়ের পৃষ্ঠা, গণিতের সমীকরণ, বিজ্ঞান প্রশ্ন বা হাতে লেখা নোটের ছবি আপলোড করো। AI মুহূর্তের মধ্যে ধাপে ধাপে বাংলা ও ইংরেজিতে সঠিক সমাধান দিয়ে দেবে!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload & Preview Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              প্রশ্নের ছবি আপলোড করো (Upload Question)
            </h3>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                imagePreview
                  ? 'border-indigo-300 bg-indigo-50/20'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Question Preview"
                    className="max-h-64 mx-auto rounded-xl object-contain border border-slate-200 shadow-xs"
                  />
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setResult(null);
                      }}
                      className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg font-medium hover:bg-rose-100 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      ছবি সরান
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">এখানে ছবি ড্র্যাগ করুন বা ক্লিক করুন</p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP সাপোর্ট করে (Max 15MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Instruction Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-600">
                  অতিরিক্ত নির্দেশ (Optional Extra Instruction)
                </label>
                <VoiceInputButton
                  onTranscript={(t) => setAdditionalPrompt((prev) => prev ? `${prev} ${t}` : t)}
                  lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
                />
              </div>
              <input
                type="text"
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="যেমন: খ অংশ সমাধান করো / সহজ বাংলায় বুঝাও"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Error Display */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={!imagePreview || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-100"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI ছবি বিশ্লেষণ করছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>সমাধান বের করো (Solve Now)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Solution Display */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">ছবি বিশ্লেষণ ও সমাধান তৈরি হচ্ছে...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gemini AI টেক্সট এক্সট্র্যাক্ট করে গাণিতিক নিয়ম ও সহজ ব্যাখ্যা প্রস্তুত করছে।
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {result.subject || 'General Subject'}
                  </span>
                  <span className="text-xs text-slate-500">ধাপে ধাপে সমাধান</span>
                </div>

                <div className="flex items-center gap-2">
                  <TTSButton
                    text={`${result.finalAnswerBn}. ${result.conceptExplanationBn}`}
                    lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
                  />

                  <button
                    onClick={handleSaveResult}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>নোট সেভ</span>
                  </button>
                </div>
              </div>

              {/* Extracted Question Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  শনাক্তকৃত প্রশ্ন (Detected Question):
                </span>
                <p className="text-sm font-semibold text-slate-900 whitespace-pre-wrap break-words">
                  {cleanMathAndMarkdown(result.extractedQuestionText)}
                </p>
              </div>

              {/* Final Answer Highlight Box */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>চূড়ান্ত উত্তর (Final Answer)</span>
                </div>
                <div className="text-sm text-emerald-900 space-y-1 pl-7 break-words">
                  <p><strong>বাংলা:</strong> {cleanMathAndMarkdown(result.finalAnswerBn)}</p>
                  {result.finalAnswerEn && <p className="text-emerald-800"><strong>English:</strong> {cleanMathAndMarkdown(result.finalAnswerEn)}</p>}
                </div>
              </div>

              {/* Key Formula (if present) */}
              {result.keyFormula && (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 formula-card">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <BookOpen className="w-4 h-4 text-amber-700" /> মূল সূত্র/নিয়ম (Key Formula):
                  </span>
                  <code className="bg-white/80 px-2.5 py-1.5 rounded-lg font-mono font-bold text-amber-950 border border-amber-200 block text-center text-sm sm:text-base break-words">
                    {cleanMathAndMarkdown(result.keyFormula)}
                  </code>
                </div>
              )}

              {/* Step by Step Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  সমাধানের ধাপসমূহ (Step-by-Step Solution):
                </h4>

                <div className="space-y-3">
                  {result.solutionSteps.map((step) => (
                    <div key={step.stepNumber} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-200 transition-colors">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="font-bold text-sm text-slate-900">
                          {cleanMathAndMarkdown(step.titleBn)} {step.titleEn && <span className="text-xs text-slate-500 font-normal">({cleanMathAndMarkdown(step.titleEn)})</span>}
                        </h5>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8 mb-1 break-words">
                        {cleanMathAndMarkdown(step.explanationBn)}
                      </p>
                      {step.explanationEn && (
                        <p className="text-xs text-slate-500 pl-8 italic break-words">
                          {cleanMathAndMarkdown(step.explanationEn)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Concept Explanation */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs sm:text-sm text-slate-700 break-words">
                <span className="font-bold text-indigo-900 block mb-1">💡 ধারণা স্পষ্টীকরণ (Concept Explanation):</span>
                <p className="mb-2">{cleanMathAndMarkdown(result.conceptExplanationBn)}</p>
                {result.conceptExplanationEn && <p className="text-xs text-slate-500">{cleanMathAndMarkdown(result.conceptExplanationEn)}</p>}
              </div>

            </div>
          ) : (
            <div className="bg-slate-100/70 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-slate-700">এখনও কোনো ছবি নির্বাচন করা হয়নি</h3>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                বাম পাশের বক্সে কোনো প্রশ্নের ছবি আপলোড করুন এবং "সমাধান বের করো" বাটনে ক্লিক করুন।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
