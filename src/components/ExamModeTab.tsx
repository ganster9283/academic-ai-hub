import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  RotateCcw, 
  Award, 
  Clock 
} from 'lucide-react';
import { GradeLevel, LanguageMode, QuizQuestion, SubjectCategory } from '../types';
import { SUBJECT_OPTIONS } from '../data/presets';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { TTSButton } from './AudioControls';

interface ExamModeTabProps {
  languageMode: LanguageMode;
  gradeLevel: GradeLevel;
  onExamFinished?: (subject: string, score: number, total: number) => void;
}

export const ExamModeTab: React.FC<ExamModeTabProps> = ({
  languageMode,
  gradeLevel,
  onExamFinished
}) => {
  const [subject, setSubject] = useState<SubjectCategory>('mathematics');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Exam States: 'setup' | 'running' | 'submitted'
  const [examStatus, setExamStatus] = useState<'setup' | 'running' | 'submitted'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (examStatus === 'running' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
        setTimeTakenSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStatus, secondsRemaining]);

  const handleStartExam = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    const targetTopic = topic.trim() || `${SUBJECT_OPTIONS.find(s => s.id === subject)?.labelEn || subject} Model Exam`;

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          subject,
          count: questionCount,
          difficulty,
          grade: gradeLevel,
          language: languageMode
        })
      });

      if (!response.ok) {
        throw new Error('পরীক্ষার প্রশ্ন তৈরি করতে সমস্যা হয়েছে');
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setSelectedAnswers({});
        setSecondsRemaining(timeLimitMinutes * 60);
        setTimeTakenSeconds(0);
        setExamStatus('running');
      } else {
        throw new Error('কোনো প্রশ্ন তৈরি করা যায়নি। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setError(err?.message || 'সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (examStatus !== 'running') return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const handleSubmitExam = () => {
    setExamStatus('submitted');
    
    // Calculate Score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    if (onExamFinished) {
      const subLabel = SUBJECT_OPTIONS.find(s => s.id === subject)?.labelBn || subject;
      onExamFinished(subLabel, correct, questions.length);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const score = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Timer className="w-3.5 h-3.5 text-yellow-300" />
            <span>Timed Exam Mode</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            পরীক্ষা মোড (Exam Mode)
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            সময়সীমা এবং লাইভ কাউন্টডাউন টাইমার সহ আসল পরীক্ষার অভিজ্ঞতা নাও। সময় শেষ হলে স্বয়ংক্রিয়ভাবে জমা হবে।
          </p>
        </div>
      </div>

      {/* Setup Form */}
      {examStatus === 'setup' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5">
          <form onSubmit={handleStartExam} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  বিষয় নির্বাচন করুন (Subject)
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.labelBn} ({sub.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  বিশেষ টপিক (Topic - Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="যেমন: ত্রিকোণমিতি, গতিবিদ্যা, Organic Chemistry..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  প্রশ্নের সংখ্যা (Number of Questions)
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={5}>৫টি প্রশ্ন (5 Questions)</option>
                  <option value={10}>১০টি প্রশ্ন (10 Questions)</option>
                  <option value={15}>১৫টি প্রশ্ন (15 Questions)</option>
                  <option value={20}>২০টি প্রশ্ন (20 Questions)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  সময়সীমা (Time Limit)
                </label>
                <select
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={5}>৫ মিনিট (5 Minutes)</option>
                  <option value={10}>১০ মিনিট (10 Minutes)</option>
                  <option value={15}>১৫ মিনিট (15 Minutes)</option>
                  <option value={20}>২০ মিনিট (20 Minutes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  কঠিনতার মাত্রা (Difficulty)
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="easy">সহজ (Easy)</option>
                  <option value="medium">মাঝারি (Medium)</option>
                  <option value="hard">কঠিন (Hard / Admission)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>পরীক্ষার প্রশ্ন তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Timer className="w-5 h-5" />
                  <span>পরীক্ষা শুরু করুন (Start Exam)</span>
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
      )}

      {/* Active Running Exam */}
      {examStatus === 'running' && (
        <div className="space-y-6">
          {/* Top Sticky Bar with Countdown */}
          <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">উত্তর দেওয়া হয়েছে:</span>
              <span className="text-sm font-extrabold text-indigo-600">
                {Object.keys(selectedAnswers).length} / {questions.length}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black font-mono shadow-xs ${
              secondsRemaining < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-yellow-400'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitExam}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              পরীক্ষা শেষ করুন (Submit)
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 break-words">
                    {qIdx + 1}. {cleanMathAndMarkdown(q.questionBn)}
                  </h3>
                  {q.questionEn && (
                    <p className="text-xs text-slate-500 italic break-words">{cleanMathAndMarkdown(q.questionEn)}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.optionsBn.map((optBn, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm break-words">{cleanMathAndMarkdown(optBn)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Exam Results */}
      {examStatus === 'submitted' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="text-center space-y-3 py-4 border-b border-slate-100">
            <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-600 mb-1">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              পরীক্ষার ফলাফল (Exam Result)
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-slate-700">
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                স্কোর: <strong className="text-rose-600 text-base">{score} / {questions.length}</strong>
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                সময় লেগেছে: <strong className="text-indigo-600">{formatTimer(timeTakenSeconds)}</strong>
              </span>
            </div>
          </div>

          {/* Answer Review */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-base">
              উত্তর পর্যালোচনা (Answer Review)
            </h4>

            {questions.map((q, qIdx) => {
              const userAns = selectedAnswers[qIdx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div key={qIdx} className={`p-4 rounded-2xl border space-y-2.5 ${
                  isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 break-words">
                      {qIdx + 1}. {cleanMathAndMarkdown(q.questionBn)}
                    </p>
                    {isCorrect ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> সঠিক
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> ভুল
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-700 break-words">
                      <strong>তোমার উত্তর:</strong> {userAns !== undefined ? cleanMathAndMarkdown(q.optionsBn[userAns]) : 'উত্তর দেওয়া হয়নি'}
                    </p>
                    <p className="text-emerald-800 font-bold break-words">
                      <strong>সঠিক উত্তর:</strong> {cleanMathAndMarkdown(q.optionsBn[q.correctIndex])}
                    </p>
                  </div>

                  {q.explanationBn && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 break-words">
                      <strong>ব্যাখ্যা:</strong> {cleanMathAndMarkdown(q.explanationBn)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setExamStatus('setup')}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>নতুন পরীক্ষা শুরু করুন (Take Another Exam)</span>
          </button>
        </div>
      )}
    </div>
  );
};
