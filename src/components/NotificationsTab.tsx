import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  ThumbsUp, 
  Megaphone, 
  UserCheck, 
  Sparkles,
  Clock,
  ExternalLink
} from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/messagingApi';

interface NotificationsTabProps {
  languageMode?: string;
  onNavigateTab?: (tab: string, relatedId?: string) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  languageMode = 'bilingual',
  onNavigateTab
}) => {
  const isBn = languageMode === 'bn';

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string, linkTab?: string, relatedId?: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      if (linkTab && onNavigateTab) {
        onNavigateTab(linkTab, relatedId);
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'comment':
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'reaction':
        return <ThumbsUp className="w-4 h-4 text-blue-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'teacher_message':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              🔔 {isBn ? 'নোটিফিকেশন সেন্টার' : 'Notifications Center'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn ? 'কমিউনিটি কমেন্ট, রিঅ্যাকশন ও টিচার মেসেজের আপডেট' : 'Real-time updates from community discussions and teachers'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{isBn ? 'সবগুলো পড়া হয়েছে চিহ্নিত করুন' : 'Mark All as Read'}</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-3xl">🔕</div>
            <p className="text-sm font-bold text-slate-700">
              {isBn ? 'কোন নোটিফিকেশন নেই' : 'No notifications yet'}
            </p>
            <p className="text-xs text-slate-400">
              {isBn ? 'আপনার পোস্টে নতুন কমেন্ট বা আপডেট আসলে এখানে দেখা যাবে।' : 'Updates will appear here when students or teachers interact with you.'}
            </p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id, notif.linkTab, notif.relatedId)}
              className={`p-4 transition cursor-pointer flex items-start justify-between gap-4 hover:bg-slate-50 ${
                !notif.isRead ? 'bg-emerald-50/40 font-medium' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-2 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
