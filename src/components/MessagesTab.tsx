import React, { useState, useEffect } from 'react';
import { UserProfile, Conversation, DirectMessage } from '../types';
import { 
  MessageSquare, 
  Users, 
  UserCheck, 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Shield, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Lock, 
  Bell, 
  CheckCheck,
  ChevronRight,
  UserX,
  PhoneCall,
  Video,
  Key
} from 'lucide-react';
import { 
  fetchCurrentProfile, 
  fetchConversations, 
  fetchMessages, 
  createDirectConversation, 
  searchUsers, 
  seedLogin, 
  loginUser, 
  registerUser,
  setupRealtimeStream,
  getStoredToken,
  setStoredToken
} from '../services/messagingApi';
import { ChatWindow } from './chat/ChatWindow';
import { UserProfileModal } from './chat/UserProfileModal';
import { ReportUserModal } from './chat/ReportUserModal';
import { GroupCreateModal } from './chat/GroupCreateModal';

interface MessagesTabProps {
  languageMode?: string;
  onUnreadCountChange?: (count: number) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  languageMode = 'bilingual',
  onUnreadCountChange
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Conversations & Messages State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<DirectMessage[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chats' | 'teachers' | 'groups' | 'search'>('chats');

  // Directory Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [directoryUsers, setDirectoryUsers] = useState<UserProfile[]>([]);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{ userId: string; userName: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [facultyName, setFacultyName] = useState('Faculty of Veterinary Science');
  const [departmentName, setDepartmentName] = useState('Dept of Anatomy & Histology');
  const [authError, setAuthError] = useState<string | null>(null);

  // Mobile View
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Toast Notification
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const isBn = languageMode === 'bn';

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      // Setup Realtime SSE Listener
      const cleanup = setupRealtimeStream((event) => {
        if (event.type === 'message:new') {
          const { conversationId, message } = event.payload;
          setNotificationToast(`🔔 ${message.senderName}: ${message.content.substring(0, 30)}...`);
          setTimeout(() => setNotificationToast(null), 4000);

          loadConversations();
          if (activeConvId === conversationId) {
            loadMessages(conversationId);
          }
        } else if (event.type === 'message:deleted' || event.type === 'message:read') {
          loadConversations();
          if (activeConvId === event.payload.conversationId) {
            loadMessages(event.payload.conversationId);
          }
        }
      });
      return cleanup;
    }
  }, [currentUser, activeConvId]);

  useEffect(() => {
    if (currentUser && activeSidebarTab === 'search') {
      loadDirectoryUsers();
    } else if (currentUser && activeSidebarTab === 'teachers') {
      loadDirectoryUsers('teacher');
    }
  }, [searchQuery, activeSidebarTab, currentUser]);

  const initAuth = async () => {
    setLoadingProfile(true);
    const token = getStoredToken();
    if (token) {
      try {
        const res = await fetchCurrentProfile();
        setCurrentUser(res.user);
      } catch {
        // Fallback to default demo student account
        autoSeedLogin('usr_student_tanvir');
      }
    } else {
      // Auto seed login as Tanvir Ahmed (student) by default for instant trial
      autoSeedLogin('usr_student_tanvir');
    }
    setLoadingProfile(false);
  };

  const autoSeedLogin = async (seedId: string) => {
    try {
      const res = await seedLogin(seedId);
      setCurrentUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await fetchConversations();
      setConversations(res.conversations);

      const totalUnread = res.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      if (onUnreadCountChange) onUnreadCountChange(totalUnread);

      if (!activeConvId && res.conversations.length > 0) {
        setActiveConvId(res.conversations[0].id);
        loadMessages(res.conversations[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetchMessages(convId);
      setActiveMessages(res.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDirectoryUsers = async (roleFilter?: string) => {
    try {
      const res = await searchUsers(searchQuery, roleFilter);
      setDirectoryUsers(res.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    loadMessages(convId);
    setShowMobileChat(true);
  };

  const handleStartDirectChat = async (targetUserId: string) => {
    try {
      const res = await createDirectConversation(targetUserId);
      await loadConversations();
      setActiveConvId(res.conversation.id);
      loadMessages(res.conversation.id);
      setShowMobileChat(true);
      setActiveSidebarTab('chats');
    } catch (err: any) {
      alert(err.message || 'চ্যাট শুরু করতে সমস্যা হয়েছে');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        const res = await loginUser(email, password);
        setCurrentUser(res.user);
      } else {
        const res = await registerUser({
          name,
          email,
          password,
          role,
          facultyName,
          departmentName
        });
        setCurrentUser(res.user);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    autoSeedLogin('usr_student_tanvir');
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 h-[calc(100dvh-11rem)] md:h-[calc(100vh-8.5rem)] min-h-[520px] flex flex-col">
      
      {/* Toast Notification Banner */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-indigo-500/50 flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <Bell className="w-5 h-5 text-indigo-400 animate-bounce" />
          <span className="text-xs font-bold">{notificationToast}</span>
        </div>
      )}

      {/* Top Header / User Switcher Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Branding & Current User */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm text-slate-900">
                {isBn ? 'ইউইআই সিকিউর মেসেজিং' : 'UEI Secure Academic Messaging'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Auth Encrypted
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isBn ? 'শিক্ষার্থী ও শিক্ষকদের নিরাপদ কমিউনিকেশন প্ল্যাটফর্ম' : 'Secure student-to-student and student-to-teacher communication'}
            </p>
          </div>
        </div>

        {/* Right: Active Account & Fast Demo Switcher */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Demo Switcher Dropdown */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-2 font-bold text-slate-500 text-[10px] uppercase">
              {isBn ? 'সুইচ অ্যাকাউন্ট:' : 'Switch Account:'}
            </span>
            <button
              onClick={() => autoSeedLogin('usr_student_tanvir')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentUser?.id === 'usr_student_tanvir' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎓 Tanvir (Student)
            </button>
            <button
              onClick={() => autoSeedLogin('usr_teacher_salma')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentUser?.id === 'usr_teacher_salma' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              👨‍🏫 Dr. Salma (Teacher)
            </button>
            <button
              onClick={() => autoSeedLogin('usr_teacher_rafiq')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentUser?.id === 'usr_teacher_rafiq' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              👨‍🏫 Prof. Rafiq
            </button>
          </div>

          {/* User Profile Button */}
          {currentUser ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center space-x-2 p-1.5 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-colors"
            >
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover" />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[9px] font-semibold text-indigo-600 uppercase">{currentUser.role}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200"
            >
              <Key className="w-4 h-4" />
              <span>{isBn ? 'লগইন / রেজিস্টার' : 'Login / Register'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Workspace (Split Sidebar + Chat Window) */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex">
        
        {/* Sidebar: Navigation & Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Navigation Sub-Tabs */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveSidebarTab('chats')}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                activeSidebarTab === 'chats' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isBn ? 'মেসেজেস' : 'Chats'}</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('teachers')}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                activeSidebarTab === 'teachers' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'শিক্ষকগণ' : 'Teachers'}</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('groups')}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                activeSidebarTab === 'groups' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isBn ? 'গ্রুপসমূহ' : 'Groups'}</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('search')}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-all ${
                activeSidebarTab === 'search' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'সার্চ' : 'Search'}</span>
            </button>
          </div>

          {/* Search Box / Action Header */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম, ডিপার্টমেন্ট বা ইমেইল খুঁজুন...' : 'Search name, department...'}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs rounded-xl text-slate-800"
              />
            </div>

            {activeSidebarTab === 'groups' && (
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="w-full mt-2 flex items-center justify-center space-x-1.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'নতুন গ্রুপ চ্যানেল খুলুন' : 'Create Group Channel'}</span>
              </button>
            )}
          </div>

          {/* List Content Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            
            {/* TAB 1: ALL CONVERSATIONS */}
            {activeSidebarTab === 'chats' && (
              conversations.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-xs">{isBn ? 'কোনো একটি চ্যাট তৈরি করুন' : 'No conversations yet'}</p>
              ) : (
                conversations.map(c => {
                  const isSelected = c.id === activeConvId;
                  const other = c.type === 'direct' ? c.participants?.find(p => p.id !== currentUser?.id) : null;
                  const title = c.type === 'group' ? c.name : (other ? other.name : 'Direct Chat');
                  const avatar = c.type === 'group' ? c.avatarUrl : other?.avatarUrl;

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectConversation(c.id)}
                      className={`p-3 flex items-center space-x-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img src={avatar} alt={title} className="w-10 h-10 rounded-2xl object-cover bg-slate-100 shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{title}</h4>
                          {c.lastMessage && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                          {c.lastMessage ? `${c.lastMessage.senderName}: ${c.lastMessage.content}` : 'No messages yet'}
                        </p>
                      </div>

                      {c.unreadCount ? c.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  );
                })
              )
            )}

            {/* TAB 2: TEACHERS DIRECTORY */}
            {activeSidebarTab === 'teachers' && (
              directoryUsers.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-xs">{isBn ? 'কোনো শিক্ষক পাওয়া যায়নি' : 'No teachers found'}</p>
              ) : (
                directoryUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => handleStartDirectChat(u.id)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-2xl object-cover bg-slate-100" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-xs text-slate-900">{u.name}</h4>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">
                            Teacher
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {u.departmentName || u.facultyName}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              )
            )}

            {/* TAB 3: GROUP CHANNELS */}
            {activeSidebarTab === 'groups' && (
              conversations.filter(c => c.type === 'group').map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConversation(c.id)}
                  className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-slate-50"
                >
                  <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 rounded-2xl object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{c.description || 'Public Community Channel'}</p>
                  </div>
                </div>
              ))
            )}

            {/* TAB 4: SEARCH PEOPLE */}
            {activeSidebarTab === 'search' && (
              directoryUsers.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-xs">{isBn ? 'কোনো শিক্ষার্থী বা শিক্ষক পাওয়া যায়নি' : 'No users found'}</p>
              ) : (
                directoryUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => handleStartDirectChat(u.id)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-2xl object-cover bg-slate-100" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-xs text-slate-900">{u.name}</h4>
                          <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                            u.role === 'teacher' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {u.role === 'teacher' ? 'Teacher' : 'Student'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {u.departmentName || u.facultyName || u.email}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className={`flex-1 flex flex-col h-full ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConv && currentUser ? (
            <ChatWindow
              conversation={activeConv}
              currentUser={currentUser}
              messages={activeMessages}
              onBackMobile={() => setShowMobileChat(false)}
              onOpenReportModal={(userId, userName) => setReportModalData({ userId, userName })}
              onRefreshMessages={() => {
                if (activeConvId) loadMessages(activeConvId);
                loadConversations();
              }}
              languageMode={languageMode}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isBn ? 'মেসেজিং সেন্টারে স্বাগতম' : 'UEI Academic Messaging Center'}
              </h3>
              <p className="text-xs max-w-sm mt-1">
                {isBn ? 'বামপাশের তালিকা থেকে যেকোনো চ্যাট নির্বাচন করুন অথবা শিক্ষক নির্দেশিকা থেকে সরাসরি প্রশ্ন করুন।' : 'Select a conversation from the sidebar or reach out directly to BAU faculty members.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {currentUser && isProfileModalOpen && (
        <UserProfileModal
          user={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
          languageMode={languageMode}
        />
      )}

      {/* Report User Modal */}
      {reportModalData && (
        <ReportUserModal
          targetUserId={reportModalData.userId}
          targetUserName={reportModalData.userName}
          isOpen={!!reportModalData}
          onClose={() => setReportModalData(null)}
          languageMode={languageMode}
        />
      )}

      {/* Group Create Modal */}
      {isGroupModalOpen && (
        <GroupCreateModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onGroupCreated={(newGrp) => {
            loadConversations();
            setActiveConvId(newGrp.id);
            loadMessages(newGrp.id);
          }}
          languageMode={languageMode}
        />
      )}

      {/* Login / Register Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {authMode === 'login' ? (isBn ? 'ইউজার লগইন' : 'User Login') : (isBn ? 'নতুন শিক্ষার্থী/শিক্ষক রেজিস্টার' : 'User Registration')}
              </h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-5 space-y-3 text-xs">
              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-bold">
                  {authError}
                </div>
              )}

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold mb-1">{isBn ? 'পূর্ণ নাম' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{isBn ? 'রোল (Role)' : 'Role'}</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    >
                      <option value="student">{isBn ? 'শিক্ষার্থী (Student)' : 'Student'}</option>
                      <option value="teacher">{isBn ? 'শিক্ষক (Teacher)' : 'Teacher'}</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold mb-1">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200"
              >
                {authMode === 'login' ? (isBn ? 'লগইন করুন' : 'Login') : (isBn ? 'রেজিস্ট্রেশন করুন' : 'Register')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  {authMode === 'login' 
                    ? (isBn ? 'অ্যাকাউন্ট নেই? নতুন অ্যাকাউন্ট খুলুন' : "Don't have an account? Register")
                    : (isBn ? 'অ্যাকাউন্ট আছে? লগইন করুন' : 'Already registered? Login')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
