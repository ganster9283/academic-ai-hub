import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bot, 
  Camera, 
  FileText, 
  Award, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Globe, 
  Zap,
  ChevronUp,
  ChevronDown,
  Layers,
  Calendar,
  Lightbulb,
  Languages,
  Timer,
  BarChart3
} from 'lucide-react';
import { TabType } from '../types';

interface WelcomeHeroProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  activeTab,
  onSelectTab
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const features = [
    {
      id: 'tutor' as const,
      titleBn: 'AI গৃহশিক্ষক (AI Tutor)',
      desc: 'গণিত, ফিজিক্স, কেমিস্ট্রি, বায়োলজি, আইসিটি ও সাধারণ জ্ঞানের সহজ সমাধান।',
      icon: Bot,
      color: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      actionText: 'প্রশ্ন করুন',
      tag: 'Step-by-Step AI'
    },
    {
      id: 'snap' as const,
      titleBn: 'স্ন্যাপ সলভ (Snap & Solve)',
      desc: 'যেকোনো বই বা খাতার প্রশ্নের ছবি তুললেই তাৎক্ষণিক স্টেপ-বাই-স্টেপ সমাধান।',
      icon: Camera,
      color: 'from-purple-600 to-pink-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      actionText: 'ছবি সমাধান',
      tag: 'OCR Vision'
    },
    {
      id: 'assignment' as const,
      titleBn: 'অ্যাসাইনমেন্ট জেনারেটর',
      desc: 'শিরোনাম, ভূমিকা, মূল আলোচনা ও রেফারেন্স সহ তৈরি করুন সম্পূর্ণ অ্যাসাইনমেন্ট।',
      icon: Layers,
      color: 'from-indigo-600 to-purple-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionText: 'অ্যাসাইনমেন্ট বানান',
      tag: 'Academic Writer'
    },
    {
      id: 'notes' as const,
      titleBn: 'লেসন নোটস (Notes Gen)',
      desc: 'অধ্যায়ভিত্তিক শর্ট নোটস, বিস্তারিত ব্যাখ্যা, মূল পয়েন্ট ও গাণিতিক সূত্র।',
      icon: FileText,
      color: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'নোট তৈরি করুন',
      tag: 'Revision Sheet'
    },
    {
      id: 'quiz' as const,
      titleBn: 'কুইজ ও MCQ (Quizzes)',
      desc: '৫, ১০, ২০টি প্রশ্নের প্র্যাকটিস কুইজ ও উত্তর ব্যাখ্যাসহ যাচাই।',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      actionText: 'কুইজ দিন',
      tag: 'MCQ Practice'
    },
    {
      id: 'exam' as const,
      titleBn: 'পরীক্ষা মোড (Exam Mode)',
      desc: 'লাইভ টাইমার ও মডেল টেস্ট পরিবেশের মাধ্যমে পরীক্ষার আসল অনুভূতি।',
      icon: Timer,
      color: 'from-rose-600 to-pink-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      actionText: 'পরীক্ষা দিন',
      tag: 'Timed Model Test'
    },
    {
      id: 'planner' as const,
      titleBn: 'স্টাডি প্ল্যানার (Routine)',
      desc: 'তোমার পড়ার সময় এবং পরীক্ষার তারিখ অনুযায়ী বাস্তবমুখী রুটিন।',
      icon: Calendar,
      color: 'from-teal-600 to-emerald-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      actionText: 'রুটিন বানান',
      tag: 'Smart Routine'
    },
    {
      id: 'explainer' as const,
      titleBn: 'সহজ ব্যাখ্যা (Explain Simply)',
      desc: 'যেকোনো কঠিন টপিক সহজ এনালজি ও নিজের পড়ার লেভেল অনুযায়ী বুঝে নাও।',
      icon: Lightbulb,
      color: 'from-orange-500 to-amber-500',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
      actionText: 'সহজ ব্যাখ্যা',
      tag: 'Intuitive AI'
    },
    {
      id: 'translator' as const,
      titleBn: 'একাডেমিক অনুবাদক',
      desc: 'বাংলা ↔ ইংরেজি সঠিক অনুবাদ ও একাডেমিক টার্মের অর্থ জানো।',
      icon: Languages,
      color: 'from-cyan-600 to-blue-600',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      actionText: 'অনুবাদ করুন',
      tag: 'Academic Translator'
    },
    {
      id: 'dashboard' as const,
      titleBn: 'অগ্রগতি ড্যাশবোর্ড',
      desc: 'তোমার পরীক্ষার স্কোর, গড় নির্ভুলতা ও সাম্প্রতিক প্রশ্নগুলো দেখো।',
      icon: BarChart3,
      color: 'from-indigo-600 to-pink-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      actionText: 'ড্যাশবোর্ড দেখুন',
      tag: 'Progress Tracker'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/20">
        
        {/* Glow Spheres */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-6 sm:p-8 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-5 text-center md:text-left">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-white">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 mb-0.5" />
                  <span className="font-extrabold text-[10px] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-cyan-200">
                    UEI
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Universal Education AI • 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                UEI - Universal Education AI
              </h1>
              <p className="text-indigo-200/90 font-medium text-xs sm:text-sm mt-1">
                Learn Smarter, Achieve Higher <span className="text-slate-400 text-xs ml-2">| স্মার্ট শিখুন, সেরাদের সেরা হন</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[11px] font-semibold text-slate-300">
              <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Bangla & English
              </span>
              <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Voice & Speech
              </span>
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>{isCollapsed ? 'ফিচার সমূহ খুলুন' : 'সংক্ষিপ্ত করুন'}</span>
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Grid of Features */}
        {!isCollapsed && (
          <div className="relative z-10 p-5 sm:p-6 bg-slate-900/40">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {features.map((feat) => {
                const IconComponent = feat.icon;
                const isActive = activeTab === feat.id;

                return (
                  <div
                    key={feat.id}
                    onClick={() => onSelectTab(feat.id)}
                    className={`group cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-slate-800/95 border-indigo-400 shadow-xl ring-2 ring-indigo-400/50'
                        : 'bg-slate-800/40 border-white/10 hover:border-indigo-400/40 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${feat.badgeBg}`}>
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-200 transition-colors">
                        {feat.titleBn}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-indigo-300 group-hover:text-white">
                      <span>{feat.actionText}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
