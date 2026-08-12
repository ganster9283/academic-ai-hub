import React from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { UserProgressStats, TabType } from '../types';

interface DashboardTabProps {
  stats?: UserProgressStats;
  savedNotesCount?: number;
  onNavigateTab: (tab: TabType) => void;
}

const defaultStats: UserProgressStats = {
  totalQuestionsAsked: 12,
  totalQuestionsAnswered: 15,
  snapsSolved: 4,
  notesGenerated: 5,
  quizzesTaken: 3,
  totalQuizzesTaken: 3,
  averageQuizScore: 85,
  averageScore: 85,
  studyHoursCompleted: 12,
  frequentSubjects: [
    { subject: 'গণিত (Mathematics)', count: 8 },
    { subject: 'পদার্থবিজ্ঞান (Physics)', count: 6 },
    { subject: 'রসায়ন (Chemistry)', count: 5 },
    { subject: 'ইংরেজি (English)', count: 4 },
    { subject: 'আইসিটি (ICT)', count: 3 }
  ],
  recentSubjects: [
    { subject: 'গণিত (Mathematics)', count: 8 },
    { subject: 'পদার্থবিজ্ঞান (Physics)', count: 6 },
    { subject: 'রসায়ন (Chemistry)', count: 5 },
    { subject: 'ইংরেজি (English)', count: 4 },
    { subject: 'আইসিটি (ICT)', count: 3 }
  ],
  examScores: [
    { subject: 'গণিত (Mathematics)', score: 9, totalQuestions: 10, total: 10, date: 'আজ' },
    { subject: 'পদার্থবিজ্ঞান (Physics)', score: 8, totalQuestions: 10, total: 10, date: 'গতকাল' }
  ]
};

export const DashboardTab: React.FC<DashboardTabProps> = ({
  stats = defaultStats,
  savedNotesCount = 0,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Learning Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            শিক্ষার্থীর অগ্রগতি (Progress Dashboard)
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            তোমার পড়াশোনার পরিসংখ্যান, পরীক্ষার স্কোর, ও সাম্প্রতিক প্রশ্নাবলি একনজরে দেখে নাও।
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full text-indigo-700">মোট কুইজ</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalQuizzesTaken}</div>
          <p className="text-[11px] text-slate-500">সম্পন্ন করা কুইজ ও এক্সাম</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-700">গড় স্কোর</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.averageScore}%</div>
          <p className="text-[11px] text-slate-500">গড় নির্ভুলতার হার</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full text-amber-700">প্রশ্ন সলভ</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalQuestionsAnswered}</div>
          <p className="text-[11px] text-slate-500">মোট উত্তর দেওয়া প্রশ্ন</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-pink-600">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-full text-pink-700">বিষয়সমূহ</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.recentSubjects?.length || stats.frequentSubjects?.length || 7}</div>
          <p className="text-[11px] text-slate-500">সক্রিয়ভাবে পঠিত বিষয়</p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab('exam')}
          className="p-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Zap className="w-6 h-6 text-yellow-300" />
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-base">পরীক্ষা মোডে মডেল টেস্ট দাও</h3>
          <p className="text-xs text-rose-100">সময়সীমা সহ লাইভ কুইজ ও উত্তর মেলাও</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('snap')}
          className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="w-6 h-6 text-purple-200" />
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-base">প্রশ্ন ছবি তুলে সমাধান করুন</h3>
          <p className="text-xs text-indigo-100">OCR প্রযুক্তির মাধ্যমে দ্রুত উত্তর</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('tutor')}
          className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <BookOpen className="w-6 h-6 text-teal-200" />
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-base">টিউটরের সাথে বিষয়ভিত্তিক আলাপ</h3>
          <p className="text-xs text-emerald-100">যেকোনো কঠিন টপিক বুঝে নাও</p>
        </button>
      </div>

      {/* Recent Exam Scores */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          সাম্প্রতিক পরীক্ষার পারফরম্যান্স (Recent Exam Scores)
        </h3>

        {(!stats.examScores || stats.examScores.length === 0) ? (
          <div className="text-center py-6 text-xs text-slate-400">
            এখনো কোনো মডেল টেস্ট দেওয়া হয়নি। কুইজ বা এক্সাম মোড ট্যাব থেকে পরীক্ষা দিন!
          </div>
        ) : (
          <div className="space-y-2">
            {stats.examScores.map((score, idx) => {
              const totalVal = score.total || score.totalQuestions || 10;
              const pct = Math.round((score.score / totalVal) * 100);
              return (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{score.subject}</h4>
                    <span className="text-[11px] text-slate-500">{score.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div className="bg-indigo-600 h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-black text-indigo-900">
                      {score.score} / {totalVal} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
