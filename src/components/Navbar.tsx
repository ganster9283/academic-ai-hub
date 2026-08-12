import React, { useState } from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  Camera, 
  FileText, 
  Award, 
  BookMarked,
  Sparkles,
  Layers,
  Calendar,
  Languages,
  Lightbulb,
  Timer,
  BarChart3,
  Globe,
  User,
  Bell,
  ShieldAlert,
  Search,
  Menu,
  X,
  Home,
  Bot
} from 'lucide-react';
import { GradeLevel, LanguageMode, TabType } from '../types';
import { GRADE_OPTIONS } from '../data/presets';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  gradeLevel: GradeLevel;
  setGradeLevel: (grade: GradeLevel) => void;
  savedNotesCount: number;
  onOpenSavedNotes: () => void;
  onOpenSearch?: () => void;
  currentUserRole?: string;
  unreadMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  languageMode,
  setLanguageMode,
  gradeLevel,
  setGradeLevel,
  savedNotesCount,
  onOpenSavedNotes,
  onOpenSearch,
  currentUserRole,
  unreadMessagesCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAITab = ['tutor', 'snap', 'notes', 'assignment', 'quiz', 'exam', 'planner', 'explainer', 'translator', 'dashboard'].includes(activeTab);

  const tabs: { id: TabType; labelBn: string; labelEn: string; icon: React.ElementType }[] = [
    { id: 'home', labelBn: '🏠 হোম', labelEn: 'Home', icon: Home },
    { id: 'bau_hub', labelBn: '🎓 BAU হাব', labelEn: 'BAU Hub', icon: GraduationCap },
    { id: 'tutor', labelBn: '🤖 AI টিউটর', labelEn: 'AI Tutor', icon: Sparkles },
    { id: 'community', labelBn: '🌐 কমিউনিটি', labelEn: 'Community', icon: Globe },
    { id: 'messages', labelBn: '💬 মেসেজেস', labelEn: 'Messages', icon: MessageSquare },
    { id: 'notifications', labelBn: '🔔 নোটিফিকেশন', labelEn: 'Alerts', icon: Bell },
    { id: 'profile', labelBn: '👤 প্রোফাইল', labelEn: 'Profile', icon: User },
    ...(currentUserRole === 'admin' ? [{ id: 'admin' as TabType, labelBn: '🚨 অ্যাডমিন', labelEn: 'Admin', icon: ShieldAlert }] : []),
    { id: 'snap', labelBn: '📷 স্ন্যাপ সলভ', labelEn: 'Snap & Solve', icon: Camera },
    { id: 'notes', labelBn: '📝 লেসন নোটস', labelEn: 'Notes Gen', icon: FileText },
    { id: 'assignment', labelBn: '📄 অ্যাসাইনমেন্ট', labelEn: 'Assignment', icon: Layers },
    { id: 'quiz', labelBn: '🏆 কুইজ ও MCQ', labelEn: 'Quizzes', icon: Award },
    { id: 'exam', labelBn: '⏱️ পরীক্ষা মোড', labelEn: 'Exam Mode', icon: Timer },
    { id: 'planner', labelBn: '📅 স্টাডি প্ল্যানার', labelEn: 'Planner', icon: Calendar },
    { id: 'explainer', labelBn: '💡 সহজ ব্যাখ্যা', labelEn: 'Explain Simply', icon: Lightbulb },
    { id: 'translator', labelBn: '🌐 অনুবাদক', labelEn: 'Translator', icon: Languages },
    { id: 'dashboard', labelBn: '📊 ড্যাশবোর্ড', labelEn: 'Dashboard', icon: BarChart3 }
  ];

  const aiSubTools = [
    { id: 'tutor' as TabType, labelBn: 'এআই টিউটর', icon: Bot },
    { id: 'snap' as TabType, labelBn: 'স্ন্যাপ সলভ', icon: Camera },
    { id: 'notes' as TabType, labelBn: 'নোটস জেন', icon: FileText },
    { id: 'quiz' as TabType, labelBn: 'কুইজ ও MCQ', icon: Award },
    { id: 'assignment' as TabType, labelBn: 'অ্যাসাইনমেন্ট', icon: Layers },
    { id: 'planner' as TabType, labelBn: 'স্টাডি প্ল্যানার', icon: Calendar },
    { id: 'explainer' as TabType, labelBn: 'সহজ ব্যাখ্যা', icon: Lightbulb },
    { id: 'translator' as TabType, labelBn: 'অনুবাদক', icon: Languages },
    { id: 'dashboard' as TabType, labelBn: 'ড্যাশবোর্ড', icon: BarChart3 }
  ];

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Android Purple/Blue Gradient Accent Branding */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0" 
            onClick={() => handleSelectTab('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">UEI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Android AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">Universal Education AI</p>
            </div>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 max-w-2xl overflow-x-auto no-scrollbar">
            {tabs.slice(0, 8).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.labelBn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Top Header Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Grade Selector Dropdown */}
            <select
              id="grade-level-select"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold py-1.5 px-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {GRADE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.labelBn}
                </option>
              ))}
            </select>

            {/* Language Mode Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                id="lang-btn-bn"
                title="বাংলা ভাষা"
                onClick={() => setLanguageMode('bn')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  languageMode === 'bn' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                id="lang-btn-bilingual"
                title="উভয় ভাষা (Bilingual)"
                onClick={() => setLanguageMode('bilingual')}
                className={`hidden sm:inline-block px-2 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  languageMode === 'bilingual' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Both
              </button>
              <button
                id="lang-btn-en"
                title="English Language"
                onClick={() => setLanguageMode('en')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  languageMode === 'en' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Global Search Button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                title="গ্লোবাল অনুসন্ধান (Search)"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Saved Notes Button */}
            <button
              id="btn-saved-notes"
              onClick={onOpenSavedNotes}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="সংরক্ষিত নোটস (Saved Notes)"
            >
              <BookMarked className="w-5 h-5" />
              {savedNotesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {savedNotesCount}
                </span>
              )}
            </button>

            {/* Notifications Alert Button */}
            <button
              onClick={() => handleSelectTab('notifications')}
              className="relative p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              title="নোটিফিকেশন (Alerts)"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* AI Sub-Tools Horizontal Scroll Bar when AI tab is active */}
        {isAITab && (
          <div className="flex items-center space-x-1.5 py-2 overflow-x-auto no-scrollbar border-t border-slate-100">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              AI টুলস:
            </span>
            {aiSubTools.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = activeTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectTab(sub.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSubActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.labelBn}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 shadow-xl animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            UEI অ্যাপ এরিয়া
          </p>
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-purple-500" />
                  <span className="truncate">{tab.labelBn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Fixed Android Bottom Navigation Bar (Requested 5 Sections: Home | AI | Community | Messages | Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-2xl flex justify-around items-center">
        {[
          { id: 'home', label: 'হোম', icon: Home },
          { id: 'tutor', label: 'AI টিউটর', icon: Sparkles, isAi: true },
          { id: 'community', label: 'কমিউনিটি', icon: Globe },
          { id: 'messages', label: 'মেসেজেস', icon: MessageSquare, badge: unreadMessagesCount },
          { id: 'profile', label: 'প্রোফাইল', icon: User }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = item.isAi ? isAITab : activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id as TabType)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                isActive 
                  ? 'text-purple-600 font-extrabold bg-purple-50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600 animate-pulse' : ''}`} />
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </header>
  );
};

