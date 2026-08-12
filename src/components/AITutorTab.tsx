import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Bookmark, 
  Check,
  BookOpen,
  Lightbulb,
  RotateCcw,
  GraduationCap,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Plus,
  Square,
  ArrowDown,
  Paperclip,
  X,
  History,
  Trash2,
  MoreVertical,
  CheckCheck,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ChatMessage, GradeLevel, LanguageMode, SubjectCategory, BAUContext } from '../types';
import { SUBJECT_OPTIONS, QUICK_PROMPTS } from '../data/presets';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';
import { VoiceInputButton, TTSButton } from './AudioControls';

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
  subject: SubjectCategory;
}

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
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('math');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('uei_chat_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(`session_${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize welcome message or load history
  useEffect(() => {
    if (messages.length === 0) {
      // Welcome message initialized if starting fresh
      const welcomeMsg: ChatMessage = {
        id: 'welcome_1',
        role: 'assistant',
        text: `নমস্কার / আসসালামু আলাইকুম! 👋 আমি **UEI** (Universal Education AI) — তোমার একাডেমি গৃহশিক্ষক।\n\nযে কোনো বিষয়ে প্রশ্ন করো— **গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, ইংরেজি, বাংলা, আইসিটি, কৃষিশিক্ষা, অর্থনীতি, অ্যানাটমি ও সাধারণ জ্ঞান**।\n\nআমি প্রতিটি প্রশ্নের উত্তর **সুবিন্যস্ত কাঠামোতে** প্রদান করি:\n1. 📖 **সংজ্ঞা (Definition)**\n2. 💡 **বিস্তারিত ব্যাখ্যা (Explanation)**\n3. 🌟 **বাস্তব জীবনের উদাহরণ (Examples)**\n4. 📐 **সূত্র বা সমীকরণ (Formulas/Rules)**\n5. 📝 **সারসংক্ষেপ (Summary)**\n\nনিচের বিষয় নির্বাচন বা প্রশ্নগুলো থেকে যেকোনো একটিতে ক্লিক করো অথবা টাইপ বা মুখে বলে প্রশ্ন করো!`,
        timestamp: Date.now(),
        suggestedFollowups: [
          "পিথাগোরাসের উপপাদ্য (a² + b² = c²) সহজ উদাহরণের মাধ্যমে বুঝিয়ে দাও",
          "অর্থনীতিতে চাহিদা ও যোগানের নীতি কীভাবে কাজ করে?",
          "আইসিটি: বাইনারি থেকে ডেসিমেল রূপান্তর কীভাবে করতে হয়?"
        ]
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Save chat sessions to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.role === 'user');
      const title = firstUserMsg ? (firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '')) : 'নতুন চ্যাট';
      
      setChatSessions(prev => {
        const existingIdx = prev.findIndex(s => s.id === activeSessionId);
        const updatedSession: ChatSession = {
          id: activeSessionId,
          title,
          timestamp: Date.now(),
          messages,
          subject: selectedSubject
        };

        let newSessions: ChatSession[];
        if (existingIdx >= 0) {
          newSessions = [...prev];
          newSessions[existingIdx] = updatedSession;
        } else {
          newSessions = [updatedSession, ...prev];
        }

        try {
          localStorage.setItem('uei_chat_sessions', JSON.stringify(newSessions.slice(0, 20)));
        } catch (e) {
          console.warn("Failed to persist chat sessions:", e);
        }
        return newSessions;
      });
    }
  }, [messages, activeSessionId, selectedSubject]);

  // Scroll management
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsScrolledUp(distanceFromBottom > 100);
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setIsScrolledUp(false);
  };

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if ((!query && !imageAttachment) || isLoading) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: query || (imageAttachment ? 'সংযুক্ত ছবি ও প্রশ্নটি বিশ্লেষণ করে সঠিক উত্তর দিন।' : ''),
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const currentAttachment = imageAttachment;
    setImageAttachment(null);
    setImageFileName('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          imageBase64: currentAttachment || undefined,
          chatHistory: messages,
          language: languageMode,
          grade: gradeLevel,
          subject: selectedSubject,
          bauContext
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const rawMsg = (errorData.error || response.statusText || '').toLowerCase();

        let formattedError = "দুঃখিত, উত্তর তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
        if (response.status === 429 || rawMsg.includes('quota') || rawMsg.includes('limit') || rawMsg.includes('resource_exhausted')) {
          formattedError = "এই মুহূর্তে অনেকগুলো অনুরোধ চলছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
        } else if (response.status === 401 || response.status === 403 || rawMsg.includes('api_key') || rawMsg.includes('unauthorized') || rawMsg.includes('missing')) {
          formattedError = "AI Tutor-এর API সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে API configuration পরীক্ষা করুন।";
        } else if (response.status >= 500) {
          formattedError = "AI সার্ভিসে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।";
        }

        throw new Error(formattedError);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: data.replyText || "ক্ষমা করবে, উত্তর তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        suggestedFollowups: data.suggestedFollowups || [],
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const cancelledMsg: ChatMessage = {
          id: `cancel_${Date.now()}`,
          role: 'assistant',
          text: 'উত্তর তৈরি বন্ধ করা হয়েছে। (Generation stopped by user)',
          timestamp: Date.now()
        };
        setMessages((prev) => [...prev, cancelledMsg]);
      } else {
        console.error("Chat error:", err);
        let errorText = err?.message || "দুঃখিত, উত্তর তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";

        if (errorText.includes('Failed to fetch') || errorText.includes('NetworkError') || errorText.includes('fetch')) {
          errorText = "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
        }

        const errorMessage: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: errorText,
          isError: true,
          failedQuery: query,
          timestamp: Date.now()
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNewChat = () => {
    const newSessionId = `session_${Date.now()}`;
    setActiveSessionId(newSessionId);
    setMessages([]);
    setInputText('');
    setImageAttachment(null);
    setImageFileName('');
    setIsMoreMenuOpen(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setSelectedSubject(session.subject);
    setIsHistoryOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(filtered);
    try {
      localStorage.setItem('uei_chat_sessions', JSON.stringify(filtered));
    } catch {}
    if (activeSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ছবিটির সাইজ ৫MB-এর কম হতে হবে।");
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageAttachment(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100dvh-12rem)] md:h-[calc(100vh-8.5rem)] min-h-[500px] relative bg-slate-50/50 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* 1. STICKY TOP HEADER */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-5 py-3 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        
        {/* Left: Hamburger/Back, AI Avatar, Online Status */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
            title="চ্যাট হিস্ট্রি (Chat History)"
          >
            <History className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">UEI AI Tutor</h1>
              <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Universal Education AI Assistant</p>
          </div>
        </div>

        {/* Right Header Actions: New Chat, Saved Notes, More */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            type="button"
            onClick={handleStartNewChat}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="নতুন চ্যাট শুরু করুন (New Chat)"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="আরও অপশন (More Options)"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>নতুন কথা বলা শুরু করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>চ্যাট মুছে ফেলুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SUBJECT & BAU CONTEXT BAR */}
      <div className="bg-white/80 border-b border-slate-200/80 px-3 sm:px-5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        
        {/* Subject Chip & Dropdown */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>বিষয়:</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {SUBJECT_OPTIONS.map((subj) => (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === subj.id
                    ? 'bg-purple-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{subj.labelBn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BAU Context Indicator */}
        {bauContext && (bauContext.courseCode || bauContext.courseTitle) && (
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 self-start sm:self-auto">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[180px] sm:max-w-none">{bauContext.courseCode}: {bauContext.courseTitle}</span>
            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
          </div>
        )}
      </div>

      {/* 3. HISTORY DRAWER MODAL */}
      {isHistoryOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-30 flex">
          <div className="w-72 sm:w-80 bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <span>পুরোনো চ্যাট হিস্ট্রি</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 text-slate-500 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={() => {
                  handleStartNewChat();
                  setIsHistoryOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন চ্যাট শুরু করুন</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatSessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">কোনো পূর্ববর্তী চ্যাট সংরক্ষিত নেই</p>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`p-3 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between group ${
                      activeSessionId === session.id
                        ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-semibold">{session.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(session.timestamp).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsHistoryOpen(false)} />
        </div>
      )}

      {/* 4. MAIN SCROLLABLE MESSAGES CONTAINER */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 min-h-0 relative scroll-smooth"
      >
        {/* EMPTY STATE / WELCOME HERO WHEN NO MESSAGES */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 max-w-md mx-auto space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-purple-200 animate-in zoom-in duration-300">
              <Bot className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">আজ কী শিখতে চান?</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">প্রশ্ন করুন, আমি ধাপে ধাপে সহজ ভাষায় বুঝিয়ে দেব।</p>
            </div>

            <div className="w-full space-y-2 pt-2">
              {[
                { title: "একটি বিষয় বুঝিয়ে দাও", icon: Lightbulb, query: "সংক্ষেপে পর্যায় সারণি ও যোজনী নির্ণয়ের নিয়মটি বুঝিয়ে দাও" },
                { title: "এই প্রশ্নটি সমাধান করো", icon: HelpCircle, query: "পিথাগোরাসের উপপাদ্য (a² + b² = c²) গাণিতিক উদাহরণসহ সমাধান করো" },
                { title: "সহজ উদাহরণ দাও", icon: FileText, query: "নিউটন-এর গতির ৩টি সূত্র প্রতিদিনের বাস্তব জীবনের উদাহরণসহ ব্যাখ্যা করো" }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(card.query)}
                    className="w-full p-3.5 bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-2xl text-left flex items-center space-x-3 transition-all shadow-2xs cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-purple-900">{card.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{card.query}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 sm:space-x-3 max-w-4xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                  msg.role === 'assistant'
                    ? msg.isError ? 'bg-rose-500 text-white' : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Body */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[88%]`}>
                
                {/* Bubble Container */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-purple-700 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-purple-900 prose-headings:font-bold prose-a:text-purple-600 prose-strong:text-slate-900 prose-code:text-purple-800 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md break-words overflow-hidden">
                      <ReactMarkdown>{cleanMathAndMarkdown(msg.text)}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words font-medium">{cleanMathAndMarkdown(msg.text)}</p>
                  )}

                  {/* Message Footer Info (Timestamp / Checkmark for user) */}
                  {msg.role === 'user' && (
                    <div className="mt-1 flex items-center justify-end space-x-1 text-[10px] text-purple-200/80 font-medium">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3 h-3 text-purple-200" />
                    </div>
                  )}

                  {/* Retry Action for Failed Messages */}
                  {msg.isError && msg.failedQuery && (
                    <div className="mt-3 pt-2.5 border-t border-rose-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSendMessage(msg.failedQuery)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>পুনরায় চেষ্টা করুন (Retry)</span>
                      </button>
                    </div>
                  )}

                  {/* AI Response Action Row ([Listen] [Copy] [Save] [👍] [👎]) */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <TTSButton text={msg.text} lang={languageMode === 'en' ? 'en-US' : 'bn-BD'} />

                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="কপি করুন"
                        >
                          {copiedId === msg.id ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5"/> কপিড</span>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>কপি</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onSaveAsNote('AI Tutor Lesson Note', msg.text, selectedSubject)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors cursor-pointer"
                          title="নোট হিসেবে সংরক্ষণ করুন"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>সেভ</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => setFeedback((prev) => ({ ...prev, [msg.id]: 'up' }))}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            feedback[msg.id] === 'up'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title="সহায়ক উত্তর (Thumbs Up)"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setFeedback((prev) => ({ ...prev, [msg.id]: 'down' }))}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            feedback[msg.id] === 'down'
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title="অসহায়ক (Thumbs Down)"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow-up Prompt Suggestions */}
                {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* LOADING TYPING INDICATOR */}
        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-600 text-sm p-3.5 bg-white border border-slate-200 rounded-2xl max-w-xs shadow-xs animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-purple-700 font-bold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
              </div>
              <p className="text-xs font-semibold text-slate-700">AI উত্তর তৈরি করছে...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FLOATING SCROLL TO BOTTOM BUTTON */}
      {isScrolledUp && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-purple-400 flex items-center gap-1.5 animate-bounce cursor-pointer"
        >
          <ArrowDown className="w-4 h-4" />
          <span>↓ নতুন উত্তর</span>
        </button>
      )}

      {/* 5. QUICK PROMPT CHIPS */}
      <div className="px-3 sm:px-4 py-1.5 bg-slate-100/80 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
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
            className="text-xs bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            {qp.topic}
          </button>
        ))}
      </div>

      {/* 6. ATTACHMENT PREVIEW BANNER IF ATTACHED */}
      {imageAttachment && (
        <div className="px-4 py-2 bg-purple-50 border-t border-purple-200 flex items-center justify-between text-xs text-purple-900 shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <Paperclip className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="font-semibold truncate">সংযুক্ত ছবি: {imageFileName || 'Image attached'}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setImageAttachment(null);
              setImageFileName('');
            }}
            className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 7. FIXED BOTTOM COMPOSER */}
      <div className="p-2 sm:p-3 bg-white border-t border-slate-200 shadow-md shrink-0 z-20 pb-16 md:pb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 p-1.5 sm:p-2 rounded-2xl border-2 border-slate-200 focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-200/80 transition-all"
        >
          {/* File Attachment Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
            title="ছবি সংযুক্ত করুন (Attach image)"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Multiline Message Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isLoading ? "AI উত্তর দিচ্ছে..." : "আপনার প্রশ্ন লিখুন..."}
            className="flex-1 min-w-0 py-1.5 px-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none max-h-24 overflow-y-auto disabled:opacity-60"
            disabled={isLoading}
          />

          {/* Microphone Voice Button */}
          <div className="shrink-0">
            <VoiceInputButton
              circular={true}
              onTranscript={(t) => {
                setInputText((prev) => prev ? `${prev} ${t}` : t);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              lang={languageMode === 'en' ? 'en-US' : 'bn-BD'}
            />
          </div>

          {/* Send or Stop Button */}
          {isLoading ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all shadow-xs shrink-0 cursor-pointer animate-pulse"
              title="উত্তর তৈরি থামান (Stop generation)"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>থামুন</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={(!inputText.trim() && !imageAttachment) || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
              title="পাঠান (Send)"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
