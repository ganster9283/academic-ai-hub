import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Check,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { ChatMessage, GradeLevel, LanguageMode, SubjectCategory, BAUContext } from '../types';
import { SUBJECT_OPTIONS, QUICK_PROMPTS } from '../data/presets';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';
import { GraduationCap, ShieldCheck } from 'lucide-react';

interface AITutorTabProps {
  languageMode: LanguageMode;
  gradeLevel: GradeLevel;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
  bauContext?: BAUContext;
}

export const AITutorTab: React.FC<AITutorTabProps> = ({
  languageMode,
  gradeLevel,
  onSaveAsNote,
  bauContext
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('mathematics');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      text: `নমস্কার / আসসালামু আলাইকুম! 👋 আমি **UEI** (Universal Education AI) — তোমার এআই গৃহশিক্ষক।\n\nযে কোনো বিষয়ে প্রশ্ন করো— **গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, ইংরেজি, বাংলা, আইসিটি, কৃষিশিক্ষা, অর্থনীতি ও সাধারণ জ্ঞান**।\n\nআমি প্রতিটি প্রশ্নের উত্তর **নির্ভুল ও সুবিন্যস্ত কাঠামোতে** প্রদান করি:\n1. 📖 **সংজ্ঞা (Definition)**\n2. 💡 **বিস্তারিত ব্যাখ্যা (Explanation)**\n3. 🌟 **বাস্তব জীবনের উদাহরণ (Examples)**\n4. 📐 **গুরুত্বপূর্ণ সূত্র বা নিয়ম (Formulas/Rules)**\n5. 📝 **সংক্ষিপ্ত সারসংক্ষেপ (Short Summary)**\n\nনিচের বিষয় নির্বাচন বা প্রশ্নগুলো থেকে যেকোনো একটিতে ক্লিক করো অথবা টাইপ বা মুখে বলে প্রশ্ন করো!`,
      timestamp: Date.now(),
      suggestedFollowups: [
        "পিথাগোরাসের উপপাদ্য (a² + b² = c²) সহজ উদাহরণের মাধ্যমে বুঝিয়ে দাও",
        "অর্থনীতিতে চাহিদা ও যোগানের নীতি কীভাবে কাজ করে?",
        "আইসিটি: বাইনারি থেকে ডেসিমেল রূপান্তর কীভাবে করতে হয়?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          chatHistory: messages,
          language: languageMode,
          grade: gradeLevel,
          subject: selectedSubject,
          bauContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI tutor reply');
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: data.replyText || "ক্ষমা করবে, উত্তর তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা কর।",
        suggestedFollowups: data.suggestedFollowups || [],
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        text: `⚠️ দুঃখিত! এআই টিউটরের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। দয়া করে পুনরায় চেষ্টা করুন। (${err?.message || 'Error'})`,
        isError: true,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 flex flex-col h-[calc(100vh-5rem)]">
      
      {/* BAU Course Context Banner if active */}
      {bauContext && (bauContext.courseCode || bauContext.courseTitle) && (
        <div className="mb-3 p-3 bg-gradient-to-r from-emerald-900 to-indigo-950 text-white rounded-2xl border border-emerald-500/40 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-black text-emerald-300 mr-2">{bauContext.courseCode}</span>
              <span className="font-bold">{bauContext.courseTitle}</span>
              <span className="text-[11px] text-indigo-200 block">বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) অ্যাকাডেমিক টিউটর অ্যাক্টিভ</span>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            BAU Context Active
          </span>
        </div>
      )}

      {/* Subject Filter Bar */}
      <div className="mb-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            বিষয় নির্বাচন করো (Subject Focus)
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            {SUBJECT_OPTIONS.find(s => s.id === selectedSubject)?.labelBn} ({selectedSubject.toUpperCase()})
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUBJECT_OPTIONS.map((subj) => (
            <button
              key={subj.id}
              onClick={() => setSelectedSubject(subj.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === subj.id
                  ? 'bg-indigo-600 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{subj.labelBn}</span>
              <span className="opacity-70 text-[10px]">({subj.labelEn})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-3 sm:p-5 rounded-2xl border border-slate-200/80 mb-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 sm:space-x-3.5 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                msg.role === 'assistant'
                  ? msg.isError ? 'bg-rose-500 text-white' : 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>

            {/* Content Bubble */}
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[90%]`}>
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-strong:text-slate-900 break-words overflow-hidden">
                    <ReactMarkdown>{cleanMathAndMarkdown(msg.text)}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{cleanMathAndMarkdown(msg.text)}</p>
                )}

                {/* Message Controls for Bot Responses */}
                {msg.role === 'assistant' && !msg.isError && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <TTSButton text={msg.text} lang={languageMode === 'en' ? 'en-US' : 'bn-BD'} />

                      <button
                        type="button"
                        onClick={() => onSaveAsNote('AI Tutor Lesson Note', msg.text, selectedSubject)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
                        title="নোট হিসেবে সংরক্ষণ করুন"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>সেভ নোট</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-700 transition-colors"
                    >
                      {copiedId === msg.id ? <span className="text-emerald-600 font-medium flex items-center gap-1"><Check className="w-3 h-3"/> কপিড</span> : 'কপি'}
                    </button>
                  </div>
                )}
              </div>

              {/* Follow-up Suggested Chips */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowups.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-500 text-sm p-3 bg-white border border-slate-200 rounded-2xl max-w-xs shadow-xs animate-pulse">
            <Bot className="w-5 h-5 text-indigo-600 animate-spin" />
            <span>শিক্ষক উত্তর তৈরি করছেন...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="mb-3 flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          দ্রুত প্রশ্ন:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedSubject(qp.subject as any);
              handleSendMessage(qp.promptBn);
            }}
            className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors shrink-0"
          >
            {qp.topic}
          </button>
        ))}
      </div>

      {/* Input Form with Voice Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="তোমার প্রশ্নটি বাংলা বা ইংরেজিতে টাইপ করো..."
          className="flex-1 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          disabled={isLoading}
        />

        <VoiceInputButton
          onTranscript={(t) => setInputText((prev) => prev ? `${prev} ${t}` : t)}
          lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">পাঠান</span>
        </button>
      </form>
    </div>
  );
};
