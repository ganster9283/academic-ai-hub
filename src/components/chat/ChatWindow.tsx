import React, { useState, useEffect, useRef } from 'react';
import { DirectMessage, Conversation, UserProfile } from '../../types';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Mic, 
  Trash2, 
  ShieldAlert, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  ArrowLeft, 
  Download, 
  Play, 
  Pause, 
  X,
  Lock,
  Globe
} from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { sendMessage, deleteMessage, uploadFile, markConversationRead } from '../../services/messagingApi';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: UserProfile;
  messages: DirectMessage[];
  onBackMobile?: () => void;
  onOpenReportModal: (userId: string, userName: string) => void;
  onRefreshMessages: () => void;
  languageMode?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  messages,
  onBackMobile,
  onOpenReportModal,
  onRefreshMessages,
  languageMode = 'bilingual'
}) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceRecordingMode, setIsVoiceRecordingMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [actionMenuMsgId, setActionMenuMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const isBn = languageMode === 'bn';

  useEffect(() => {
    scrollToBottom();
    markConversationRead(conversation.id).catch(() => {});
  }, [messages, conversation.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Other participant in direct chat
  const otherParticipant = conversation.type === 'direct'
    ? conversation.participants?.find(p => p.id !== currentUser.id)
    : null;

  const title = conversation.type === 'group' 
    ? conversation.name 
    : (otherParticipant ? otherParticipant.name : 'Direct Message');

  const subtitle = conversation.type === 'group'
    ? `${conversation.participantIds.length} members • ${conversation.description || 'Community Group'}`
    : (otherParticipant ? `${otherParticipant.departmentName || otherParticipant.role} • ${otherParticipant.designationOrYear || ''}` : '');

  const avatar = conversation.type === 'group'
    ? (conversation.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(conversation.name || '')}`)
    : (otherParticipant?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(title || '')}`);

  // Send Text Message
  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');
    try {
      await sendMessage(conversation.id, textToSend, 'text');
      onRefreshMessages();
    } catch (err: any) {
      alert(err.message || 'মেসেজ পাঠাতে সমস্যা হয়েছে');
      setInputText(textToSend);
    }
  };

  // Upload & Send Image or PDF
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ফাইল সাইজ ১০MB এর বেশি হতে পারবে না।');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        const uploadRes = await uploadFile(base64Data, file.name, file.type);
        
        const isPdf = file.type === 'application/pdf';
        const msgType = isPdf ? 'pdf' : 'image';

        await sendMessage(
          conversation.id, 
          file.name, 
          msgType, 
          {
            type: msgType,
            url: uploadRes.url,
            fileName: uploadRes.fileName,
            fileSize: uploadRes.fileSize,
            mimeType: uploadRes.mimeType
          }
        );

        onRefreshMessages();
      } catch (err: any) {
        alert(err.message || 'ফাইল আপলোড করতে সমস্যা হয়েছে');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
  };

  // Send Voice Note
  const handleSendVoiceNote = async (audioBase64: string, durationSeconds: number) => {
    setIsVoiceRecordingMode(false);
    try {
      await sendMessage(
        conversation.id,
        '🎤 Voice Message',
        'voice',
        {
          type: 'voice',
          url: audioBase64,
          durationSeconds
        }
      );
      onRefreshMessages();
    } catch (err: any) {
      alert(err.message || 'ভয়েস মেসেজ পাঠাতে সমস্যা হয়েছে');
    }
  };

  // Handle Play Voice Note
  const handleToggleVoicePlay = (msgId: string, audioUrl: string) => {
    if (activeAudioId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setActiveAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      audioPlayerRef.current = newAudio;
      newAudio.onended = () => setActiveAudioId(null);
      newAudio.play();
      setActiveAudioId(msgId);
    }
  };

  // Delete Message
  const handleDeleteMsg = async (msgId: string, mode: 'for_me' | 'for_everyone') => {
    setActionMenuMsgId(null);
    try {
      await deleteMessage(conversation.id, msgId, mode);
      onRefreshMessages();
    } catch (err: any) {
      alert(err.message || 'মেসেজ মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center space-x-3">
          {onBackMobile && (
            <button 
              onClick={onBackMobile}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <img src={avatar} alt={title} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-100 bg-slate-100" />
            {conversation.type === 'direct' && otherParticipant?.onlineStatus === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-slate-900">{title}</h3>
              {otherParticipant && (
                <span className={`px-2 py-0.2 text-[10px] font-bold rounded-full ${
                  otherParticipant.role === 'teacher' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {otherParticipant.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-xs sm:max-w-md">{subtitle}</p>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-1">
          {otherParticipant && (
            <button
              onClick={() => onOpenReportModal(otherParticipant.id, otherParticipant.name)}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="রিপোর্ট ও ব্লক (Report & Block)"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        
        {/* Encryption Banner */}
        <div className="flex justify-center my-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[11px] font-medium">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? 'সুরক্ষিত অ্যান্ড-টু-অ্যান্ড কমিউনিকেশন প্ল্যাটফর্ম' : 'Messages are authenticated & secure'}</span>
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <p className="font-semibold text-slate-600">{isBn ? 'এখনো কোনো বার্তা নেই।' : 'No messages yet.'}</p>
            <p>{isBn ? 'আপনার প্রথম বার্তা টাইপ করে কথা শুরু করুন!' : 'Send a message to start the conversation!'}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const isRead = msg.readBy.length > 1;

            return (
              <div 
                key={msg.id} 
                className={`flex items-end space-x-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img 
                    src={msg.senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(msg.senderName)}`} 
                    alt={msg.senderName} 
                    className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" 
                  />
                )}

                <div className={`relative group max-w-[85%] sm:max-w-md rounded-2xl p-3 text-xs shadow-xs transition-all ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}>
                  
                  {/* Sender Name in Groups */}
                  {!isMe && conversation.type === 'group' && (
                    <p className="text-[10px] font-bold text-indigo-600 mb-1 flex items-center gap-1">
                      <span>{msg.senderName}</span>
                      <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600">
                        {msg.senderRole === 'teacher' ? 'Teacher' : 'Student'}
                      </span>
                    </p>
                  )}

                  {/* Text Content */}
                  {msg.content && (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}

                  {/* Attachment: Image */}
                  {msg.attachment?.type === 'image' && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-black/10 cursor-pointer" onClick={() => setLightboxImageUrl(msg.attachment!.url)}>
                      <img src={msg.attachment.url} alt="Attachment" className="max-h-60 w-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  )}

                  {/* Attachment: PDF */}
                  {msg.attachment?.type === 'pdf' && (
                    <a
                      href={msg.attachment.url}
                      download={msg.attachment.fileName || 'document.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2 flex items-center space-x-2 p-2.5 rounded-xl border transition-colors ${
                        isMe ? 'bg-indigo-700/60 border-indigo-500 text-white hover:bg-indigo-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <FileText className="w-6 h-6 shrink-0 text-rose-500" />
                      <div className="flex-1 truncate">
                        <p className="font-bold text-xs truncate">{msg.attachment.fileName || 'Document.pdf'}</p>
                        <p className="text-[10px] opacity-80">PDF Document</p>
                      </div>
                      <Download className="w-4 h-4 shrink-0" />
                    </a>
                  )}

                  {/* Attachment: Voice Note */}
                  {msg.attachment?.type === 'voice' && (
                    <div className={`mt-2 flex items-center space-x-3 p-2 rounded-xl ${isMe ? 'bg-indigo-700/60' : 'bg-indigo-50'}`}>
                      <button
                        onClick={() => handleToggleVoicePlay(msg.id, msg.attachment!.url)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-xs ${
                          isMe ? 'bg-white text-indigo-700' : 'bg-indigo-600'
                        }`}
                      >
                        {activeAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                          <div className={`h-full ${isMe ? 'bg-white' : 'bg-indigo-600'} ${activeAudioId === msg.id ? 'animate-pulse w-full' : 'w-1/3'}`} />
                        </div>
                        <span className="text-[10px] font-medium opacity-80 mt-0.5 block">
                          🎤 Voice Note ({msg.attachment.durationSeconds || 0}s)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Message Footer: Timestamp & Read Status */}
                  <div className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {isMe && (
                      <span>
                        {isRead ? <CheckCheck className="w-3.5 h-3.5 text-sky-300" /> : <Check className="w-3.5 h-3.5 text-indigo-300" />}
                      </span>
                    )}
                  </div>

                  {/* Action Menu Toggle Button */}
                  <button
                    onClick={() => setActionMenuMsgId(actionMenuMsgId === msg.id ? null : msg.id)}
                    className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                      isMe ? 'hover:bg-indigo-700 text-indigo-200' : 'hover:bg-slate-200 text-slate-500'
                    }`}
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Context Popup Menu for Delete */}
                  {actionMenuMsgId === msg.id && (
                    <div className="absolute top-8 right-2 z-20 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 text-xs w-36 animate-in fade-in duration-150">
                      <button
                        onClick={() => handleDeleteMsg(msg.id, 'for_me')}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center space-x-1.5 text-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'আমার জন্য মুছুন' : 'Delete for me'}</span>
                      </button>

                      {isMe && (
                        <button
                          onClick={() => handleDeleteMsg(msg.id, 'for_everyone')}
                          className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center space-x-1.5 text-rose-600 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'সবার জন্য মুছুন' : 'Delete for all'}</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        
        {isVoiceRecordingMode ? (
          <VoiceRecorder
            onSendVoiceNote={handleSendVoiceNote}
            onCancel={() => setIsVoiceRecordingMode(false)}
            languageMode={languageMode}
          />
        ) : (
          <form onSubmit={handleSendText} className="flex items-center space-x-2">
            
            {/* File Attachment Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,application/pdf"
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
              title={isBn ? 'ছবি বা PDF আপলোড করুন' : 'Attach Image or PDF'}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={() => setIsVoiceRecordingMode(true)}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title={isBn ? 'ভয়েস বার্তা পাঠান' : 'Record Voice Note'}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isBn ? 'আপনার বার্তা টাইপ করুন (বাংলা বা ইংরেজি)...' : 'Type a secure message...'}
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs px-4 py-2.5 rounded-2xl text-slate-800 font-medium transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all disabled:opacity-40 disabled:hover:bg-indigo-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImageUrl(null)}>
          <button className="absolute top-4 right-4 p-2 text-white bg-white/10 rounded-full hover:bg-white/20">
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImageUrl} alt="Full view" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};
