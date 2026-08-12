import React, { useState } from 'react';
import { 
  DollarSign, 
  BookOpen, 
  Search, 
  HelpCircle, 
  Calculator, 
  CheckCircle2, 
  Layers, 
  ArrowLeft,
  GraduationCap,
  Sparkles,
  ChevronRight,
  FileText,
  Award,
  Filter
} from 'lucide-react';
import { AGRI_ECON_TOPICS, AgriEconTopic } from '../data/agriEconData';
import { LanguageMode } from '../types';

interface AgriEconomicsViewProps {
  onBack?: () => void;
  languageMode?: LanguageMode;
  onOpenAITutorWithTopic?: (topicName: string) => void;
}

export const AgriEconomicsView: React.FC<AgriEconomicsViewProps> = ({
  onBack,
  languageMode = 'bilingual',
  onOpenAITutorWithTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTopic, setActiveTopic] = useState<AgriEconTopic>(AGRI_ECON_TOPICS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'formulas' | 'mcq' | 'qa'>('overview');

  // MCQ state
  const [userMcqAnswers, setUserMcqAnswers] = useState<Record<string, number>>({});
  const [showMcqResults, setShowMcqResults] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Fundamentals', 'Micro & Production', 'Farm Management', 'Marketing & Policy', 'Quantitative & Advanced'];

  const filteredTopics = AGRI_ECON_TOPICS.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = 
      t.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortExplanationBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMcqSelect = (mcqIndex: number, optionIndex: number) => {
    const key = `${activeTopic.id}_${mcqIndex}`;
    setUserMcqAnswers((prev) => ({ ...prev, [key]: optionIndex }));
    setShowMcqResults((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Navigation Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1.5">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-purple-200 hover:text-white bg-purple-800/40 px-3 py-1.5 rounded-xl border border-purple-700/50 transition-all cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>পূর্ববর্তী পাতায় যান</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-700/60 border border-purple-500/50 text-amber-300">
              <DollarSign className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              কৃষি অর্থনীতি বিভাগ (Department of Agricultural Economics)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 max-w-3xl">
            বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) FAERS অনুষদের সম্পূর্ণ ডিজিটাল কোর্স ডাটাবেস: সংজ্ঞাসমূহ, সূত্রের ব্যাখ্যা, গাণিতিক মডেল, প্র্যাকটিক্যাল সমস্যা ও MCQ প্রশ্ন ব্যাংক।
          </p>
        </div>

        {onOpenAITutorWithTopic && (
          <button
            onClick={() => onOpenAITutorWithTopic(activeTopic.nameEn)}
            className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tutor-এ প্রশ্ন করুন</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কৃষি অর্থনীতির যেকোনো টপিক বা সূত্র খুঁজুন (যেমন: Demand, Opportunity Cost, Elasticity)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'সকল টপিক (All)' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Topic Sidebar, Right Topic Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Topic List Sidebar (32 Topics) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-3xl shadow-xs border border-slate-200/80 space-y-3 max-h-[700px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>একাডেমিক টপিক তালিকা ({filteredTopics.length})</span>
            </span>
          </div>

          <div className="space-y-1.5">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopic(topic);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                      : 'bg-slate-50/60 border-slate-100 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{topic.nameBn}</h3>
                      <p className="text-[11px] text-purple-700 font-medium">{topic.nameEn}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shrink-0">
                      {topic.category}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                কোনো টপিক পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>

        {/* Right Workspace for Selected Topic */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Topic Header Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  {activeTopic.category}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
                  {activeTopic.nameBn}
                </h2>
                <p className="text-xs text-purple-700 font-semibold">{activeTopic.nameEn}</p>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'overview' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সারসংক্ষেপ
                </button>

                {activeTopic.formulas && activeTopic.formulas.length > 0 && (
                  <button
                    onClick={() => setActiveTab('formulas')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'formulas' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    গাণিতিক সূত্র
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('mcq')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'mcq' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MCQ ({activeTopic.mcqs.length})
                </button>

                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'qa' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  প্রশ্নোত্তর
                </button>
              </div>
            </div>

            {/* Short Explanation */}
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100/80 text-xs text-slate-800 space-y-1">
              <p className="font-medium leading-relaxed">{activeTopic.shortExplanationBn}</p>
              <p className="text-[11px] text-slate-500 italic">{activeTopic.shortExplanationEn}</p>
            </div>

            {/* Content Based on Active Inner Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Definitions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>গুরুত্বপূর্ণ সংজ্ঞাসমূহ (Important Definitions)</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {activeTopic.definitions.map((def, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-purple-900">{def.titleBn}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{def.titleEn}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{def.descBn}</p>
                        <p className="text-[11px] text-slate-500 italic">{def.descEn}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Examples */}
                {activeTopic.examples && activeTopic.examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>ব্যবহারিক উদাহরণ (Practical Examples)</span>
                    </h3>
                    <ul className="space-y-2">
                      {activeTopic.examples.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Important Exam Points */}
                {activeTopic.examPoints && activeTopic.examPoints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>পরীক্ষার গুরুত্বপূর্ণ পয়েন্ট (Important Exam Tips)</span>
                    </h3>
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                      {activeTopic.examPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-amber-900 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'formulas' && activeTopic.formulas && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>গাণিতিক সূত্রাবলি ও ব্যাখ্যা</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {activeTopic.formulas.map((form, idx) => (
                    <div key={idx} className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
                      <span className="text-[11px] font-bold text-purple-300 uppercase">{form.name}</span>
                      <div className="bg-slate-950 p-3 rounded-xl text-emerald-300 font-mono text-sm border border-slate-800">
                        {form.formula}
                      </div>
                      <p className="text-xs text-slate-300">{form.descBn}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mcq' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>কুইজ অনুশীলন (MCQ Practice)</span>
                </h3>

                <div className="space-y-4">
                  {activeTopic.mcqs.map((mcq, idx) => {
                    const key = `${activeTopic.id}_${idx}`;
                    const selectedOpt = userMcqAnswers[key];
                    const isAnswered = showMcqResults[key];

                    return (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900">
                          {idx + 1}. {mcq.questionBn}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mcq.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200';
                            if (isAnswered) {
                              if (optIdx === mcq.answerIndex) {
                                btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                              } else if (selectedOpt === optIdx) {
                                btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleMcqSelect(idx, optIdx)}
                                className={`text-left p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className="p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs">
                            <span className="font-bold">ব্যাখ্যা: </span>
                            <span>{mcq.explanationBn}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Short Questions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span>সংক্ষিপ্ত প্রশ্ন ও উত্তর (Short Q&A)</span>
                  </h3>
                  <div className="space-y-3">
                    {activeTopic.shortQuestions.map((sq, idx) => (
                      <div key={idx} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                        <p className="text-xs font-bold text-purple-900">Q: {sq.questionBn}</p>
                        <p className="text-xs text-slate-700 leading-relaxed">A: {sq.answerBn}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Broad Questions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>রচনামূলক প্রশ্ন ও উত্তর আউটলাইন (Broad Questions & Outline)</span>
                  </h3>
                  <div className="space-y-3">
                    {activeTopic.broadQuestions.map((bq, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <p className="text-xs font-extrabold text-slate-900">Q: {bq.questionBn}</p>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">উত্তর লেখার আউটলাইন:</span>
                          <ul className="space-y-1">
                            {bq.outlineBn.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-xs text-slate-700 font-medium">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
