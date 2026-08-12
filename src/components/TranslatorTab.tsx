import React, { useState } from 'react';
import { 
  Languages, 
  ArrowLeftRight, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  BookOpen, 
  Volume2 
} from 'lucide-react';
import { LanguageMode, SubjectCategory, TranslationResult } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface TranslatorTabProps {
  languageMode?: LanguageMode;
  onSaveAsNote?: (title: string, content: string, subject?: SubjectCategory) => void;
}

export const TranslatorTab: React.FC<TranslatorTabProps> = ({
  languageMode,
  onSaveAsNote
}) => {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState<'bn_to_en' | 'en_to_bn'>('bn_to_en');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'bn_to_en' ? 'en_to_bn' : 'bn_to_en'));
    if (result) {
      setText(result.translatedText);
      setResult(null);
    }
  };

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          direction
        })
      });

      if (!response.ok) {
        throw new Error('অনুবাদ করা সম্ভব হয়নি');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'অনুবাদে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Translator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            একাডেমিক অনুবাদক (Bengali ↔ English Translator)
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            পড়াশোনার বাক্য, বৈজ্ঞানিক টার্ম, ব্যাকরণ ও অনুচ্ছেদগুলো সঠিক অনুবাদ ও গুরুত্বপূর্ণ শব্দার্থ সহ জেনে নাও।
          </p>
        </div>
      </div>

      {/* Control Switcher & Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-700">
            {direction === 'bn_to_en' ? 'বাংলা ➔ English' : 'English ➔ বাংলা'}
          </span>

          <button
            type="button"
            onClick={toggleDirection}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-indigo-600 flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>দিক পরিবর্তন করুন (Switch)</span>
          </button>
        </div>

        <form onSubmit={handleTranslate} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {direction === 'bn_to_en' ? 'বাংলা টেক্সট লিখুন (Enter Bengali Text)' : 'English Text (Enter English Text)'}
              </label>
              <VoiceInputButton
                onTranscript={(t) => setText((prev) => prev ? `${prev} ${t}` : t)}
                lang={direction === 'bn_to_en' ? 'bn-BD' : 'en-US'}
              />
            </div>

            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                direction === 'bn_to_en'
                  ? 'এখানে বাংলা লেখা, টার্ম বা অনুচ্ছেদ পেস্ট করুন...'
                  : 'Paste your English sentences, textbook paragraphs, or academic terms here...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>অনুবাদ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>অনুবাদ করুন (Translate Now)</span>
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

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              অনুবাদ ফলাফল (Translation Result)
            </h3>

            <div className="flex items-center gap-2">
              <TTSButton
                text={result.translatedText}
                lang={direction === 'bn_to_en' ? 'en-US' : 'bn-BD'}
              />

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 space-y-2">
            <p className="text-base sm:text-lg font-semibold text-blue-950 leading-relaxed whitespace-pre-wrap break-words">
              {cleanMathAndMarkdown(result.translatedText)}
            </p>
          </div>

          {/* Key Terms */}
          {result.keyTerms && result.keyTerms.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                গুরুত্বপূর্ণ শব্দার্থ (Key Terms)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.keyTerms.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-indigo-900 break-words">{cleanMathAndMarkdown(item.term)}</span>
                    <span className="text-slate-600 break-words">{cleanMathAndMarkdown(item.meaning)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
