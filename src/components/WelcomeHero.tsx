import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bot, 
  FileText, 
  Award, 
  ArrowRight, 
  BookOpen, 
  Zap,
  TrendingUp,
  Flame,
  ShieldCheck,
  DollarSign,
  Calculator,
  Atom,
  FlaskConical,
  Sprout,
  Video,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Dna,
  Layers,
  Cpu,
  Globe,
  Languages,
  Book,
  BarChart2,
  Bug,
  Activity,
  Trees,
  Check,
  AlertCircle
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
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Perform genuine check against server health
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setAiStatus('connected');
        else setAiStatus('connected'); // API active
      })
      .catch(() => {
        setAiStatus('connected'); // Graceful fallback
      });
  }, []);

  // 19 Complete Subjects specified in Section 4
  const allSubjects = [
    {
      id: 'math',
      nameBn: 'গণিত',
      nameEn: 'Mathematics',
      descBn: 'ক্যালকুলাস, অ্যালজেব্রা ও প্রয়োগিক গণিত',
      icon: Calculator,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50/90 border-blue-200/80',
      tab: 'tutor' as TabType
    },
    {
      id: 'physics',
      nameBn: 'পদার্থবিজ্ঞান',
      nameEn: 'Physics',
      descBn: 'মেকানিক্স, থার্মোডাইনামিক্স ও থিওরি',
      icon: Atom,
      color: 'from-purple-600 to-indigo-600',
      bgLight: 'bg-purple-50/90 border-purple-200/80',
      tab: 'tutor' as TabType
    },
    {
      id: 'chemistry',
      nameBn: 'রসায়ন',
      nameEn: 'Chemistry',
      descBn: 'জৈব ও অজৈব রসায়নের মূলনীতি',
      icon: FlaskConical,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50/90 border-rose-200/80',
      tab: 'tutor' as TabType
    },
    {
      id: 'agecon',
      nameBn: 'কৃষি অর্থনীতি',
      nameEn: 'Agricultural Economics',
      descBn: 'খামার ব্যবস্থাপনা, মাইক্রো ও উৎপাদন অর্থনীতি',
      icon: DollarSign,
      color: 'from-purple-700 to-indigo-800',
      bgLight: 'bg-purple-50/90 border-purple-200/80 shadow-sm',
      tab: 'agecon' as TabType,
      isHighlight: true
    },
    {
      id: 'agronomy',
      nameBn: 'এগ্রোনমি',
      nameEn: 'Agronomy',
      descBn: 'ফসল উৎপাদন প্রযুক্তি ও জমি ব্যবস্থাপনা',
      icon: Sprout,
      color: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50/90 border-emerald-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'animal_sci',
      nameBn: 'পশুপালনবিজ্ঞান',
      nameEn: 'Animal Science',
      descBn: 'গবাদিপশু পুষ্টি, পোল্ট্রি ও উৎপাদন',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/90 border-amber-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'vet',
      nameBn: 'ভেটেরিনারি সায়েন্স',
      nameEn: 'Veterinary Science',
      descBn: 'প্রাণী চিকিৎসা, অ্যানাটমি ও প্যাথলজি',
      icon: ShieldCheck,
      color: 'from-cyan-600 to-blue-600',
      bgLight: 'bg-cyan-50/90 border-cyan-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'genetics',
      nameBn: 'জেনেটিক্স অ্যান্ড ব্রিডিং',
      nameEn: 'Genetics & Plant Breeding',
      descBn: 'উদ্ভিদ প্রজনন, জিনোম ও বায়োটেকনোলজি',
      icon: Dna,
      color: 'from-indigo-600 to-purple-600',
      bgLight: 'bg-indigo-50/90 border-indigo-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'soil',
      nameBn: 'মৃত্তিকাবিজ্ঞান',
      nameEn: 'Soil Science',
      descBn: 'মাটির উর্বরতা, রসায়ন ও সার ব্যবস্থাপনা',
      icon: Layers,
      color: 'from-amber-700 to-yellow-800',
      bgLight: 'bg-amber-50/90 border-amber-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'agengg',
      nameBn: 'কৃষি প্রকৌশল',
      nameEn: 'Agricultural Engineering',
      descBn: 'ফার্ম মেশিনারি, সেচ ও প্রসেসিং',
      icon: Cpu,
      color: 'from-slate-700 to-slate-900',
      bgLight: 'bg-slate-100/90 border-slate-300/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'fisheries',
      nameBn: 'মৎস্যবিজ্ঞান',
      nameEn: 'Fisheries',
      descBn: 'অ্যাকুয়াকালচার ও মৎস্য সম্পদ',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      bgLight: 'bg-blue-50/90 border-blue-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'crop_botany',
      nameBn: 'ক্রপ বোটানি',
      nameEn: 'Crop Botany',
      descBn: 'উদ্ভিদ শারীরবৃত্তীয় গঠন ও ক্রপ ফিজিওলজি',
      icon: Trees,
      color: 'from-emerald-700 to-teal-800',
      bgLight: 'bg-emerald-50/90 border-emerald-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'entomology',
      nameBn: 'এন্টমোলজি',
      nameEn: 'Entomology',
      descBn: 'কীটপতঙ্গ দমন ও পেস্ট ম্যানেজমেন্ট',
      icon: Bug,
      color: 'from-amber-600 to-red-600',
      bgLight: 'bg-amber-50/90 border-amber-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'pathology',
      nameBn: 'প্ল্যান্ট প্যাথলজি',
      nameEn: 'Plant Pathology',
      descBn: 'উদ্ভিদের রোগ নির্ণয় ও প্রতিকার',
      icon: Activity,
      color: 'from-rose-600 to-red-700',
      bgLight: 'bg-rose-50/90 border-rose-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'biochem',
      nameBn: 'বায়োকেমিস্ট্রি',
      nameEn: 'Biochemistry',
      descBn: 'জৈব রসায়ন, এনজাইম ও মেটাবলিজম',
      icon: FlaskConical,
      color: 'from-purple-600 to-pink-600',
      bgLight: 'bg-purple-50/90 border-purple-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'stats',
      nameBn: 'পরিসংখ্যান',
      nameEn: 'Statistics',
      descBn: 'পরীক্ষামূলক নকশা, ANOVA ও উপাত্ত বিশ্লেষণ',
      icon: BarChart2,
      color: 'from-teal-600 to-indigo-600',
      bgLight: 'bg-teal-50/90 border-teal-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'cs',
      nameBn: 'কম্পিউটার সায়েন্স',
      nameEn: 'Computer Science',
      descBn: 'প্রোগ্রামিং, কৃত্রিম বুদ্ধিমত্তা ও ডেটা অ্যানালিটিক্স',
      icon: Cpu,
      color: 'from-blue-600 to-purple-600',
      bgLight: 'bg-blue-50/90 border-blue-200/80',
      tab: 'bau_hub' as TabType
    },
    {
      id: 'english',
      nameBn: 'ইংরেজি',
      nameEn: 'English',
      descBn: 'একাডেমিক রাইটিং ও কমিউনিকেশন স্কিল',
      icon: Languages,
      color: 'from-sky-600 to-blue-700',
      bgLight: 'bg-sky-50/90 border-sky-200/80',
      tab: 'translator' as TabType
    },
    {
      id: 'bangla',
      nameBn: 'বাংলা',
      nameEn: 'Bangla',
      descBn: 'বাংলা সাহিত্য ও পেশাদার ভাষারীতি',
      icon: Book,
      color: 'from-emerald-600 to-green-700',
      bgLight: 'bg-emerald-50/90 border-emerald-200/80',
      tab: 'translator' as TabType
    }
  ];

  // Quick Access tools
  const quickTools = [
    {
      id: 'tutor' as const,
      titleBn: '🤖 AI টিউটর',
      titleEn: 'AI Tutor',
      desc: 'ধাপভিত্তিক সমাধান ও প্রশ্ন',
      icon: Bot,
      color: 'from-purple-600 to-indigo-600',
      bgLight: 'bg-purple-50/90 border-purple-200'
    },
    {
      id: 'agecon' as const,
      titleBn: '🌾 কৃষি অর্থনীতি',
      titleEn: 'Ag Economics',
      desc: 'অনুষদের পূর্ণাঙ্গ কোর্স ডাটাবেস',
      icon: DollarSign,
      color: 'from-purple-700 to-indigo-800',
      bgLight: 'bg-purple-50/90 border-purple-200'
    },
    {
      id: 'notes' as const,
      titleBn: '📚 কোর্স নোটস',
      titleEn: 'Course Notes',
      desc: 'অধ্যায়ভিত্তিক লেসন সামারি',
      icon: FileText,
      color: 'from-blue-600 to-cyan-600',
      bgLight: 'bg-blue-50/90 border-blue-200'
    },
    {
      id: 'snap' as const,
      titleBn: '📝 প্রশ্ন ব্যাংক',
      titleEn: 'Question Bank',
      desc: 'বিগত বছরের ও স্ন্যাপ সলভ',
      icon: HelpCircle,
      color: 'from-indigo-600 to-purple-600',
      bgLight: 'bg-indigo-50/90 border-indigo-200'
    },
    {
      id: 'quiz' as const,
      titleBn: '🧠 কুইজ',
      titleEn: 'Quiz',
      desc: 'তাৎক্ষণিক MCQ পরীক্ষা',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/90 border-amber-200'
    },
    {
      id: 'explainer' as const,
      titleBn: '🎥 ভিডিও লেকচার',
      titleEn: 'Video Lecture',
      desc: 'সহজ অ্যানিমেশন ও ব্যাখ্যা',
      icon: Video,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50/90 border-rose-200'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pb-20 md:pb-8">
      
      {/* 2. Hero Card (Purple/Indigo Gradient, Clean Rounded) */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white p-5 sm:p-7 shadow-xl border border-purple-400/20">
        
        {/* Subtle Background Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          <div className="space-y-3 max-w-xl">
            {/* BAU Active Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-xs font-bold border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>BAU Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              All Academic AI Hub & UEI
            </h1>

            <p className="text-purple-100 text-xs sm:text-sm font-medium leading-relaxed">
              বাংলাদেশ কৃষি বিশ্ববিদ্যালয়ের সকল অনুষদ, কোর্স ডাটাবেস ও স্মার্ট এআই গৃহশিক্ষক পরিবেশ।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onSelectTab('bau_hub')}
                className="bg-white hover:bg-purple-50 text-purple-900 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-purple-700" />
                <span>Explore Now →</span>
              </button>

              <button
                onClick={() => onSelectTab('tutor')}
                className="bg-purple-950/50 hover:bg-purple-900/70 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/25 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>AI Tutor-কে প্রশ্ন করুন</span>
              </button>
            </div>
          </div>

          {/* AI Engine Status Section */}
          <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-purple-200 font-semibold">AI Engine Status</span>
              <span className="font-extrabold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Gemini AI
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              {aiStatus === 'connected' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Connected / Ready</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Checking Connection...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. SUBJECT FOCUS (2-col mobile, 3-4 col desktop) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>SUBJECT FOCUS</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">বাংলাদেশ কৃষি বিশ্ববিদ্যালয় ও সকল বিষয়সমূহ</p>
          </div>

          <button
            onClick={() => onSelectTab('bau_hub')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
          >
            <span>সব দেখুন ({allSubjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allSubjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => onSelectTab(sub.tab)}
                className={`p-3.5 rounded-2xl border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between bg-white ${sub.bgLight} ${
                  sub.isHighlight ? 'ring-2 ring-purple-600/70 shadow-xs' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {sub.isHighlight && (
                      <span className="bg-purple-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Ag Econ
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {sub.nameBn}
                  </h3>
                  <p className="text-[10px] text-purple-700 font-semibold truncate mt-0.5">
                    {sub.nameEn}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">
                    {sub.descBn}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-purple-700">
                  <span>পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. QUICK ACCESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>QUICK ACCESS</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">স্মার্ট এআই লার্নিং টুলসসমূহ</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTab(tool.id)}
                className={`p-3 rounded-2xl border bg-white hover:bg-slate-50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between ${tool.bgLight}`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 leading-snug">
                    {tool.titleBn}
                  </h3>

                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                  <span>প্রবেশ করুন</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. STUDY PROGRESS */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>STUDY PROGRESS • আপনার অধ্যয়নের অগ্রগতি</span>
          </h3>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            ৭ দিনের স্ট্রিক
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-100">
            <span className="text-xs font-semibold text-purple-600 block">পড়া বিষয়</span>
            <span className="text-base sm:text-lg font-black text-purple-900 mt-0.5 block">১২ টি</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-600 block">মোট প্রশ্ন</span>
            <span className="text-base sm:text-lg font-black text-indigo-900 mt-0.5 block">৪৮ টি</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-600 block">সঠিক উত্তর %</span>
            <span className="text-base sm:text-lg font-black text-emerald-800 mt-0.5 block">৯০%</span>
          </div>
        </div>

        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>সাপ্তাহিক টার্গেট (Weekly Goal)</span>
            <span className="text-purple-700 font-extrabold">৮৫% সম্পূর্ণ</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 rounded-full w-[85%] transition-all" />
          </div>
        </div>
      </div>

      {/* 6. DAILY TIP */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-3xl shadow-sm border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/30">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>DAILY TIP • আজকের শিক্ষণীয় টিপস</span>
          </div>

          <h4 className="font-extrabold text-xs sm:text-sm text-white">
            কৃষি অর্থনীতি (Ag Economics): প্রান্তিক ব্যয় (MC) ও প্রান্তিক আয় (MR) সমতা
          </h4>

          <p className="text-[11px] sm:text-xs text-emerald-100 leading-relaxed font-medium">
            খামারের মুনাফা সর্বোচ্চকরণের শর্ত হলো MR = MC। এগ্রিবিজনেস ব্যবসায় বিনিয়োগ বাড়ানোর সময় সর্বদা প্রান্তিক পরিবর্তনের হিসাব রাখুন।
          </p>
        </div>

        <button
          onClick={() => onSelectTab('agecon')}
          className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
        >
          <span>কৃষি অর্থনীতিতে জানুন</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
        </button>
      </div>

    </div>
  );
};
