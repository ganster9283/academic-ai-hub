import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  HelpCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { GradeLevel, LanguageMode, Quiz, QuizQuestion, SubjectCategory } from '../types';
import { SUBJECT_OPTIONS, SAMPLE_PRESET_QUIZZES } from '../data/presets';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';

interface QuizTabProps {
  languageMode: LanguageMode;
  gradeLevel: GradeLevel;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  languageMode,
  gradeLevel
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Custom Quiz Generator Form State
  const [customSubject, setCustomSubject] = useState<SubjectCategory>('physics');
  const [customTopic, setCustomTopic] = useState('Physics & Mechanics');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (activeQuiz && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, isCompleted, timeLeft]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setTimeLeft(quiz.questions.length * 60); // 1 minute per question
  };

  const handleGenerateCustomQuiz = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: customSubject,
          topic: customTopic,
          grade: gradeLevel,
          questionCount,
          difficulty,
          language: languageMode
        })
      });

      if (!response.ok) {
        throw new Error('Quiz generation failed');
      }

      const data = await response.json();
      
      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title: data.quizTitle || `${customTopic} Quiz (${customSubject.toUpperCase()})`,
        subject: customSubject,
        grade: gradeLevel,
        questions: data.questions || [],
        userAnswers: {},
        createdAt: Date.now()
      };

      if (newQuiz.questions.length === 0) {
        throw new Error('No questions received from server.');
      }

      startQuiz(newQuiz);
    } catch (err: any) {
      console.error('Quiz Generation Error:', err);
      setErrorMsg(err?.message || 'কুইজ তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (selectedAnswers[questionIdx] !== undefined) return; // Answered already
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const handleFinishQuiz = () => {
    setIsCompleted(true);
    if (activeQuiz) {
      let score = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });
      const percent = (score / activeQuiz.questions.length) * 100;
      if (percent >= 60) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const currentQuestion: QuizQuestion | undefined = activeQuiz?.questions[currentQuestionIndex];
  const totalQuestions = activeQuiz?.questions.length || 0;
  const answeredCount = Object.keys(selectedAnswers).length;

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-6 rounded-3xl shadow-md">
        <div className="inline-flex items-center space-x-2 bg-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md text-purple-200 mb-3 border border-purple-400/30">
          <Award className="w-3.5 h-3.5 text-purple-300" />
          <span>Interactive Quiz & Exam Practice</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">কুইজ ও MCQ অ্যারেনা (Interactive MCQs)</h2>
        <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-2xl">
          যেকোনো বিষয় ও টপিকে কাস্টম MCQ কুইজ তৈরি করো, পরীক্ষার প্রস্তুতি নাও এবং সাথে সাথে সঠিক উত্তর ও ব্যাখ্যা সহ ফলাফল দেখে নাও!
        </p>
      </div>

      {!activeQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Custom Quiz Generator Form */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                কাস্টম কুইজ তৈরি করো (Generate AI Quiz)
              </h3>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  বিষয় (Subject)
                </label>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value as SubjectCategory)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameBn} ({s.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  টপিক/অধ্যায়ের নাম (Topic)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="যেমন: বল ও গতি, চাহিদা ও যোগান, Trigonometry, Tense"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Topic Suggestions */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                  জনপ্রিয় কুইজ টপিক (Quick Selection)
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {[
                    { topic: 'গণিত: জ্যামিতি ও ত্রিকোণমিতি', subj: 'math' },
                    { topic: 'পদার্থ: বল ও পরিমাপ', subj: 'physics' },
                    { topic: 'রসায়ন: পর্যায় সারণি ও মোলের ধারণা', subj: 'chemistry' },
                    { topic: 'জীববিজ্ঞান: সালোকসংশ্লেষণ ও কোষবিজ্ঞান', subj: 'biology' },
                    { topic: 'English: Grammar & Vocabulary', subj: 'english' },
                    { topic: 'কৃষিশিক্ষা: ফসল ব্যবস্থাপনা ও মাটি', subj: 'agriculture' },
                    { topic: 'অর্থনীতি: চাহিদা, যোগান ও বাজার', subj: 'economics' },
                    { topic: 'আইসিটি: লজিক গেট ও প্রোগ্রামিং', subj: 'ict' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomTopic(item.topic);
                        setCustomSubject(item.subj as SubjectCategory);
                      }}
                      className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {item.topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    প্রশ্ন সংখ্যা (Count)
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={3}>৩ টি প্রশ্ন</option>
                    <option value={5}>৫ টি প্রশ্ন</option>
                    <option value={8}>৮ টি প্রশ্ন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    মান (Difficulty)
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="easy">সহজ (Easy)</option>
                    <option value="medium">মাঝারি (Medium)</option>
                    <option value="hard">কঠিন (Hard)</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleGenerateCustomQuiz}
                disabled={isGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-100"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>কুইজ তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>কুইজ শুরু করো (Start Quiz)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Sample Quizzes List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                ইনস্ট্যান্ট প্র্যাকটিস কুইজ (Preset Quizzes)
              </h3>

              <div className="space-y-3">
                {SAMPLE_PRESET_QUIZZES.map((pq) => (
                  <div
                    key={pq.id}
                    className="p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{pq.title}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase font-semibold">
                          {pq.subject}
                        </span>
                        <span>• {pq.questions.length} Questions</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startQuiz(pq)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <span>খেলুন</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : isCompleted ? (
        /* Quiz Results Card */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
          
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">কুইজ সমাপ্ত হয়েছে! 🎉</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{activeQuiz.title}</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-around">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">মোট প্রশ্ন</span>
              <p className="text-xl font-bold text-slate-800">{totalQuestions}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">সঠিক উত্তর</span>
              <p className="text-xl font-bold text-emerald-600">{calculateScore()}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">স্কোর</span>
              <p className="text-xl font-bold text-indigo-600">
                {Math.round((calculateScore() / totalQuestions) * 100)}%
              </p>
            </div>
          </div>

          {/* Detailed Question Explanations */}
          <div className="text-left space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm">প্রশ্ন ও সমাধান বিশ্লেষণ (Detailed Review):</h4>
            
            {activeQuiz.questions.map((q, qIdx) => {
              const userAns = selectedAnswers[qIdx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div key={q.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm text-slate-900 break-words">
                      {qIdx + 1}. {cleanMathAndMarkdown(q.questionBn)} <span className="text-xs text-slate-500 font-normal">({cleanMathAndMarkdown(q.questionEn)})</span>
                    </p>
                    {isCorrect ? (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> ভুল
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 break-words">
                    <strong>তোমার উত্তর:</strong> {userAns !== undefined ? cleanMathAndMarkdown(q.optionsBn[userAns]) : 'উত্তর দেওয়া হয়নি'}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold break-words">
                    <strong>সঠিক উত্তর:</strong> {cleanMathAndMarkdown(q.optionsBn[q.correctIndex])}
                  </p>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 mt-2 break-words">
                    <strong>ব্যাখ্যা:</strong> {cleanMathAndMarkdown(q.explanationBn)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => setActiveQuiz(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>নতুন কুইজ খেলুন</span>
            </button>
          </div>

        </div>
      ) : currentQuestion ? (
        /* Active Quiz Screen */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          
          {/* Top Timer & Progress Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                {activeQuiz.title}
              </span>
              <span className="text-xs text-slate-500">
                প্রশ্ন {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                বাতিল
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words">
              {currentQuestionIndex + 1}. {cleanMathAndMarkdown(currentQuestion.questionBn)}
            </h3>
            <p className="text-xs text-slate-500 italic break-words">{cleanMathAndMarkdown(currentQuestion.questionEn)}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.optionsBn.map((optBn, optIdx) => {
              const optEn = currentQuestion.optionsEn[optIdx] || '';
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
              const isCorrectOpt = optIdx === currentQuestion.correctIndex;

              let btnClass = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100";
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold";
                } else if (isSelected) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-950 font-bold";
                } else {
                  btnClass = "bg-slate-50 border-slate-200 opacity-60";
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between ${btnClass}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold break-words">{cleanMathAndMarkdown(optBn)}</p>
                      <p className="text-xs opacity-75 break-words">{cleanMathAndMarkdown(optEn)}</p>
                    </div>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 mt-1">
                      {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if Answered */}
          {selectedAnswers[currentQuestionIndex] !== undefined && (
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-xs sm:text-sm text-slate-800 space-y-1 break-words">
              <span className="font-bold text-indigo-900 block">💡 ব্যাখ্যা (Explanation):</span>
              <p>{cleanMathAndMarkdown(currentQuestion.explanationBn)}</p>
              <p className="text-xs text-slate-500 italic">{cleanMathAndMarkdown(currentQuestion.explanationEn)}</p>
            </div>
          )}

          {/* Next / Finish Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="text-xs font-bold text-slate-600 disabled:opacity-30 hover:text-slate-900"
            >
              ← পূর্ববর্তী
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-xs"
              >
                ফলাফল দেখুন
              </button>
            )}
          </div>

        </div>
      ) : null}

    </div>
  );
};
