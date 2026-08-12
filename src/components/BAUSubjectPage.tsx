import React, { useState } from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Camera, 
  Award, 
  Layers, 
  Mic, 
  FlaskConical, 
  Timer, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Download, 
  Share2, 
  Play, 
  RotateCcw,
  HelpCircle,
  Clock,
  BarChart2,
  ListOrdered,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { BAUCourse, LanguageMode, VivaQuestion, PracticalExperiment, SubjectCategory } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { GoogleGenAI } from '@google/genai';

interface BAUSubjectPageProps {
  course: BAUCourse;
  onBack: () => void;
  languageMode: LanguageMode;
  onSaveAsNote?: (title: string, content: string, subject?: SubjectCategory) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onNavigateTab: (tab: any) => void;
}

export const BAUSubjectPage: React.FC<BAUSubjectPageProps> = ({
  course,
  onBack,
  languageMode,
  onSaveAsNote,
  isBookmarked,
  onToggleBookmark,
  onNavigateTab
}) => {
  const isBn = languageMode === 'bn';
  const [activeSubTab, setActiveSubTab] = useState<
    'info' | 'tutor' | 'notes' | 'snap' | 'quiz' | 'assignment' | 'viva' | 'practical' | 'exam'
  >('info');

  // Notes state
  const [noteType, setNoteType] = useState<string>('Short Notes');
  const [generatedNote, setGeneratedNote] = useState<string>('');
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  // Quiz state
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(10);
  const [quizDifficulty, setQuizDifficulty] = useState<string>('Medium');
  const [quizTopic, setQuizTopic] = useState<string>(course.topics[0] || 'All Topics');
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Viva state
  const [vivaCategory, setVivaCategory] = useState<'Basic' | 'Intermediate' | 'Advanced' | 'Practical Viva'>('Basic');
  const [vivaQuestions, setVivaQuestions] = useState<VivaQuestion[]>([]);
  const [vivaLoading, setVivaLoading] = useState(false);

  // Practical state
  const [practicalData, setPracticalData] = useState<PracticalExperiment | null>(null);
  const [practicalLoading, setPracticalLoading] = useState(false);

  // Exam prep state
  const [examKitData, setExamKitData] = useState<any | null>(null);
  const [examKitLoading, setExamKitLoading] = useState(false);
  const [examTimer, setExamTimer] = useState<number>(900); // 15 mins model test
  const [isExamRunning, setIsExamRunning] = useState(false);

  // Quick Note Generator
  const handleGenerateNote = async () => {
    setIsNoteLoading(true);
    setGeneratedNote('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a professor at Bangladesh Agricultural University (BAU), Faculty of ${course.facultyNameEn}, Department of ${course.departmentNameEn}.
Course: ${course.courseCode} - ${course.courseTitle}.
Task: Generate ${noteType} for this course topic: "${quizTopic || course.topics.join(', ')}".

Format clean markdown with:
- Summary
- Key Concepts
- Important Definitions
- Key Formulas / Rules (if applicable)
- Tables or Comparison (if relevant)
- University Exam Review Tips

Language instruction: Respond in ${isBn ? 'Bengali (বাংলা)' : 'English'}, with technical terms in English brackets.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      setGeneratedNote(response.text || 'নোট তৈরি করা সম্ভব হয়নি।');
    } catch (e) {
      console.error(e);
      setGeneratedNote('নোট জেনারেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsNoteLoading(false);
    }
  };

  // Generate Course Quiz
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizSubmitted(false);
    setUserAnswers({});
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate ${quizQuestionCount} university-level multiple choice questions (MCQs) for Bangladesh Agricultural University (BAU) course:
Course Code: ${course.courseCode} (${course.courseTitle})
Topic: ${quizTopic}
Difficulty: ${quizDifficulty}

Return ONLY a JSON array with this exact format:
[
  {
    "id": "q1",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Detailed explanation here"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '[]');
      setQuizData(parsed);
    } catch (e) {
      console.error(e);
      alert('কুইজ জেনারেট করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } fontally: {
      setQuizLoading(false);
    }
  };

  // Generate Viva Qs
  const handleGenerateViva = async () => {
    setVivaLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a BAU Viva examiner for ${course.courseCode}: ${course.courseTitle} (${course.departmentNameEn}).
Generate 5 ${vivaCategory} level viva voce questions and model answers.

Return ONLY a JSON array with format:
[
  {
    "id": "v1",
    "questionBn": "প্রশ্ন (বাংলা)",
    "questionEn": "Question (English)",
    "shortAnswerBn": "সংক্ষিপ্ত উত্তর",
    "shortAnswerEn": "Short Answer",
    "detailedExplanationBn": "বিস্তারিত ব্যাখ্যা",
    "detailedExplanationEn": "Detailed Explanation",
    "category": "${vivaCategory}"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '[]');
      setVivaQuestions(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setVivaLoading(false);
    }
  };

  // Generate Practical Experiment
  const handleGeneratePractical = async () => {
    setPracticalLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Create a university lab practical experiment guide for BAU Course ${course.courseCode}: ${course.courseTitle}.
Practical Topic: "${course.practicalTopics?.[0] || course.topics[0]}".

Return ONLY JSON format:
{
  "id": "p1",
  "titleBn": "পরীক্ষার নাম (বাংলা)",
  "titleEn": "Experiment Title (English)",
  "objectives": ["Objective 1", "Objective 2"],
  "materials": ["Reagent A", "Apparatus B"],
  "procedure": ["Step 1", "Step 2", "Step 3"],
  "observation": "Observation table description",
  "calculation": "Formula and sample calculation",
  "result": "Expected result statement",
  "discussion": "Scientific discussion",
  "precautions": ["Precaution 1", "Precaution 2"],
  "vivaQuestions": [
    {"question": "Lab Viva Question 1", "answer": "Lab Viva Answer 1"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      setPracticalData(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setPracticalLoading(false);
    }
  };

  // Generate Exam Prep Kit
  const handleGenerateExamKit = async () => {
    setExamKitLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a comprehensive Exam Preparation Kit for BAU course ${course.courseCode}: ${course.courseTitle}.

Include:
1. Important Topics (High Priority)
2. Important Definitions
3. Short Questions (5 items)
4. Broad / Essay Questions (3 items)
5. Numerical Problems (2 items)
6. Model Test Question Paper (5 MCQs for timed exam)

Language: ${isBn ? 'Bengali & English mixed' : 'English'}.
Return JSON format with keys: importantTopics, importantDefinitions, shortQuestions, broadQuestions, numericalProblems, modelTestMCQs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      setExamKitData(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setExamKitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-xs bg-slate-100 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ফিরে যান' : 'Back to BAU Hub'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {course.sourceName}
          </span>

          <button
            onClick={onToggleBookmark}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isBookmarked ? 'বুকমার্কড' : 'বুকমার্ক করুন'}</span>
          </button>
        </div>
      </div>

      {/* Course Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl">
                {course.courseCode}
              </span>
              <span className="text-xs font-bold text-emerald-200">
                {course.departmentNameBn} • {course.facultyNameBn}
              </span>
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-lg font-semibold">
                ক্রেডিট: {course.credit}
              </span>
              <span className="text-xs bg-indigo-500/40 text-indigo-200 px-2.5 py-0.5 rounded-lg border border-indigo-400/30">
                Level {course.year}, Semester {course.semester} ({course.program})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isBn ? course.courseTitleBn : course.courseTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-4xl">
              {isBn ? course.descriptionBn : course.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('tutor')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>AI টিউটর চালু করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Tool Nav Tabs (Section 5 of Prompt) */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
        {[
          { id: 'info', label: '📚 তথ্য (Course Info)', icon: BookOpen },
          { id: 'tutor', label: '🧠 AI টিউটর', icon: MessageSquare },
          { id: 'notes', label: '📝 নোটস જেনারেটর', icon: FileText },
          { id: 'quiz', label: '❓ MCQ কুইজ', icon: Award },
          { id: 'viva', label: '🎤 ভাইভা প্রস্তুতি', icon: Mic },
          { id: 'practical', label: '🧪 প্র্যাকটিক্যাল / ল্যাব', icon: FlaskConical },
          { id: 'exam', label: '📊 পরীক্ষা ও মডেল টেস্ট', icon: Timer },
          { id: 'assignment', label: '📄 অ্যাসাইনমেন্ট', icon: Layers },
          { id: 'snap', label: '📷 স্ন্যাপ সলভ', icon: Camera }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'tutor') {
                  onNavigateTab('tutor');
                } else if (tab.id === 'assignment') {
                  onNavigateTab('assignment');
                } else if (tab.id === 'snap') {
                  onNavigateTab('snap');
                } else {
                  setActiveSubTab(tab.id as any);
                }
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENT PANELS */}

      {/* 1. COURSE INFO PANEL */}
      {activeSubTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Syllabus Topics Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <ListOrdered className="w-5 h-5" />
                <h3>অফিসিয়াল সিলেবাস ও টপিকসমূহ (Syllabus Topics)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.topics.map((t, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-800">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Syllabus Card if applicable */}
            {course.practicalTopics && course.practicalTopics.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
                  <FlaskConical className="w-5 h-5" />
                  <h3>ব্যবহারিক সিলেবাস (Practical Syllabus)</h3>
                </div>
                <div className="space-y-2">
                  {course.practicalTopics.map((pt, idx) => (
                    <div key={idx} className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span className="text-xs font-semibold text-teal-950">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official References */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                <BookOpen className="w-5 h-5" />
                <h3>সুপারিশকৃত পাঠ্যবই ও রেফারেন্স (References)</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
                {course.references.map((ref, idx) => (
                  <li key={idx} className="font-medium">{ref}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Sidebar Metadata */}
          <div className="space-y-6">
            <div className="bg-emerald-900/5 p-6 rounded-3xl border border-emerald-200 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>অফিসিয়াল তথ্য যাচাই</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">অনুষদ:</span>
                  <span className="font-bold text-slate-900">{course.facultyNameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">বিভাগ:</span>
                  <span className="font-bold text-slate-900">{course.departmentNameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">উৎস:</span>
                  <span className="font-bold text-slate-900">{course.sourceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">যাচাইয়ের তারিখ:</span>
                  <span className="font-bold text-emerald-700">{course.lastVerified}</span>
                </div>
              </div>

              <a
                href={course.sourceURL}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all"
              >
                <span>BAU ওয়েবসাইট ভিজিট করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Launch Tools Buttons */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">দ্রুত অ্যাকশন</h4>
              <button
                onClick={() => setActiveSubTab('notes')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 transition-all"
              >
                <span>📝 এই কোর্সের শর্ট নোট বানান</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setActiveSubTab('quiz')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 transition-all"
              >
                <span>❓ ২০ প্রশ্নের কুইজ দিন</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setActiveSubTab('viva')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 transition-all"
              >
                <span>🎤 ভাইভা প্রশ্নোত্তর দেখুন</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTES GENERATOR PANEL */}
      {activeSubTab === 'notes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>{course.courseCode} নোটস জেনারেটর (Course Notes Generator)</span>
              </h3>
              <p className="text-xs text-slate-500">শর্ট নোটস, গাণিতিক সূত্র, সংজ্ঞাসমূহ ও রিভিশন শিট তৈরি করুন</p>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {[
                'Short Notes',
                'Detailed Notes',
                'Exam Notes',
                'Key Points',
                'Definitions',
                'Important Formulas',
                'Tables',
                'Revision Sheet'
              ].map((nt) => (
                <button
                  key={nt}
                  onClick={() => setNoteType(nt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    noteType === nt
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {nt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">-- সব টপিক একত্রে --</option>
              {course.topics.map((tp, idx) => (
                <option key={idx} value={tp}>{tp}</option>
              ))}
            </select>

            <button
              onClick={handleGenerateNote}
              disabled={isNoteLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 disabled:opacity-50 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isNoteLoading ? 'তৈরি হচ্ছে...' : 'জেনারেট করুন'}</span>
            </button>
          </div>

          {/* Generated Note Output */}
          {generatedNote ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  {noteType} — {course.courseCode}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedNote)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি</span>
                  </button>
                  {onSaveAsNote && (
                    <button
                      onClick={() => onSaveAsNote(`${course.courseCode} - ${noteType}`, generatedNote, 'agriculture')}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                      সেভ টু নোটস 📚
                    </button>
                  )}
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {cleanMathAndMarkdown(generatedNote)}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              উপরের বোতাম চেপে যেকোনো ক্যাটাগরির নোটস জেনারেট করুন
            </div>
          )}
        </div>
      )}

      {/* 3. MCQ QUIZ PANEL */}
      {activeSubTab === 'quiz' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{course.courseCode} MCQ কুইজ মোড</span>
              </h3>
              <p className="text-xs text-slate-500">প্রশ্নসংখ্যা ও স্তরের উপর ভিত্তি করে কুইজ তৈরি ও অনুশীলন করুন</p>
            </div>

            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-600">প্রশ্ন:</span>
                {[5, 10, 20, 30, 50].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuizQuestionCount(cnt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      quizQuestionCount === cnt ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-600">কঠিনতা:</span>
                {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setQuizDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      quizDifficulty === diff ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={quizLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{quizLoading ? 'তৈরি হচ্ছে...' : 'কুইজ শুরু'}</span>
              </button>
            </div>
          </div>

          {/* Quiz List */}
          {quizData.length > 0 ? (
            <div className="space-y-6">
              {quizData.map((q, qIdx) => (
                <div key={qIdx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt: string, oIdx: number) => {
                      const isSelected = userAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctIndex === oIdx;
                      let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100';

                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                        else if (isSelected) btnStyle = 'bg-rose-500 text-white border-rose-600';
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600 text-white border-indigo-700 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                      <span className="font-bold">উত্তর ব্যাখ্যা:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  কুইজ জমা দিন ও স্কোর দেখুন
                </button>
              ) : (
                <div className="p-6 bg-emerald-500 text-slate-950 rounded-2xl text-center space-y-2">
                  <h4 className="text-xl font-black">
                    স্কোর: {Object.entries(userAnswers).filter(([idx, ans]) => quizData[Number(idx)]?.correctIndex === ans).length} / {quizData.length}
                  </h4>
                  <p className="text-xs font-bold">
                    সঠিক শতকরা: {Math.round((Object.entries(userAnswers).filter(([idx, ans]) => quizData[Number(idx)]?.correctIndex === ans).length / quizData.length) * 100)}%
                  </p>
                  <button
                    onClick={handleGenerateQuiz}
                    className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold mt-2 hover:bg-slate-800"
                  >
                    আবার কুইজ দিন
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              উপরে প্রশ্নসংখ্যা বেছে নিয়ে "কুইজ শুরু" বোতাম চাপুন
            </div>
          )}
        </div>
      )}

      {/* 4. VIVA PREPARATION PANEL */}
      {activeSubTab === 'viva' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Mic className="w-5 h-5 text-rose-600" />
                <span>{course.courseCode} ভাইভা প্রস্তুতি (Viva Voce Prep)</span>
              </h3>
              <p className="text-xs text-slate-500">অনুষদভিত্তিক শিক্ষক সমকক্ষ গুরুত্বপূর্ণ ভাইভা প্রশ্ন ও উত্তর</p>
            </div>

            <div className="flex items-center space-x-2">
              {(['Basic', 'Intermediate', 'Advanced', 'Practical Viva'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setVivaCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    vivaCategory === cat ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={handleGenerateViva}
                disabled={vivaLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {vivaLoading ? 'তৈরি হচ্ছে...' : 'জেনারেট করুন'}
              </button>
            </div>
          </div>

          {vivaQuestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {vivaQuestions.map((vq, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Q{idx + 1}. {vq.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{isBn ? vq.questionBn : vq.questionEn}</h4>
                  
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-800 space-y-1">
                    <span className="font-bold text-emerald-700">সংক্ষিপ্ত উত্তর (Short Answer):</span>
                    <p className="font-medium">{isBn ? vq.shortAnswerBn : vq.shortAnswerEn}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
                    <span className="font-bold text-indigo-800">বিস্তারিত ব্যাখ্যা (Detailed Explanation):</span>
                    <p className="leading-relaxed">{isBn ? vq.detailedExplanationBn : vq.detailedExplanationEn}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              ক্যাটাগরি বেছে নিয়ে "জেনারেট করুন" বোতাম চাপুন
            </div>
          )}
        </div>
      )}

      {/* 5. PRACTICAL / LAB PANEL */}
      {activeSubTab === 'practical' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-600" />
                <span>{course.courseCode} প্র্যাকটিক্যাল / ল্যাব মডিউল</span>
              </h3>
              <p className="text-xs text-slate-500">পরীক্ষার নাম, উদ্দেশ্য, পদ্ধতি, গণনা ও ফলাফল রেডি গাইড</p>
            </div>

            <button
              onClick={handleGeneratePractical}
              disabled={practicalLoading}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {practicalLoading ? 'তৈরি হচ্ছে...' : 'ল্যাব এক্সপেরিমেন্ট জেনারেট করুন'}
            </button>
          </div>

          {practicalData ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b pb-2">
                {isBn ? practicalData.titleBn : practicalData.titleEn}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-teal-800">🎯 উদ্দেশ্য (Objectives)</h4>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {practicalData.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-teal-800">🧪 প্রয়োজনীয় উপকরণ (Materials)</h4>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {practicalData.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-teal-800">📋 কাজের ধারা (Procedure)</h4>
                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1">
                  {practicalData.procedure.map((pr, i) => <li key={i}>{pr}</li>)}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-teal-800">📊 পর্যবেক্ষণ ও গণনা (Observation & Calculation)</h4>
                  <p className="text-xs text-slate-700">{practicalData.observation}</p>
                  {practicalData.calculation && (
                    <p className="text-xs font-mono bg-slate-100 p-2 rounded-lg text-slate-800">{practicalData.calculation}</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-teal-800">✅ ফলাফল ও আলোচনা (Result & Discussion)</h4>
                  <p className="text-xs font-semibold text-emerald-800">{practicalData.result}</p>
                  <p className="text-xs text-slate-700">{practicalData.discussion}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              "ল্যাব এক্সপেরিমেন্ট জেনারেট করুন" বোতাম চাপুন
            </div>
          )}
        </div>
      )}

      {/* 6. EXAM PREPARATION PANEL */}
      {activeSubTab === 'exam' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-600" />
                <span>{course.courseCode} পরীক্ষা ও মডেল টেস্ট কিট</span>
              </h3>
              <p className="text-xs text-slate-500">গুরুত্বপূর্ণ সংক্ষিপ্ত, রচনামূলক ও গাণিতিক প্রশ্নসহ পূর্ণাঙ্গ মডেল টেস্ট</p>
            </div>

            <button
              onClick={handleGenerateExamKit}
              disabled={examKitLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {examKitLoading ? 'তৈরি হচ্ছে...' : 'পরীক্ষা কিট লোড করুন'}
            </button>
          </div>

          {examKitData ? (
            <div className="space-y-6">
              {/* Important Topics */}
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-black text-amber-900 uppercase">🔥 পরীক্ষায় আসা নিশ্চিত টপিকসমূহ</h4>
                <div className="flex flex-wrap gap-2">
                  {examKitData.importantTopics?.map((tp: string, idx: number) => (
                    <span key={idx} className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-lg">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Short & Broad Qs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">📌 সংক্ষিপ্ত প্রশ্ন (Short Questions)</h4>
                  <ul className="list-disc list-inside text-xs text-slate-800 space-y-1.5 font-medium">
                    {examKitData.shortQuestions?.map((sq: string, i: number) => <li key={i}>{sq}</li>)}
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">📖 রচনামূলক প্রশ্ন (Broad Questions)</h4>
                  <ul className="list-disc list-inside text-xs text-slate-800 space-y-1.5 font-medium">
                    {examKitData.broadQuestions?.map((bq: string, i: number) => <li key={i}>{bq}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              "পরীক্ষা কিট লোড করুন" বোতাম চেপে নমুনা প্রশ্নপত্র দেখুন
            </div>
          )}
        </div>
      )}

    </div>
  );
};
