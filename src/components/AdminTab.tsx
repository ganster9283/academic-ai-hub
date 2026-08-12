import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  AlertTriangle, 
  Users, 
  FileText, 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Ban, 
  ShieldCheck, 
  Search,
  Building2
} from 'lucide-react';
import { 
  fetchAdminStats, 
  fetchAdminReports, 
  actionAdminReport, 
  fetchAdminTeacherVerifications, 
  actionAdminTeacherVerification, 
  fetchAdminUsers 
} from '../services/messagingApi';
import { UserProfile } from '../types';

interface AdminTabProps {
  languageMode?: string;
  currentUser: UserProfile | null;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  languageMode = 'bilingual',
  currentUser
}) => {
  const isBn = languageMode === 'bn';

  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'verifications' | 'reports' | 'users'>('verifications');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetchAdminStats();
      setStats(statsRes);

      const reportsRes = await fetchAdminReports();
      setReports(reportsRes.reports || []);

      const verifRes = await fetchAdminTeacherVerifications();
      setVerifications(verifRes.verifications || []);

      const usersRes = await fetchAdminUsers();
      setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'dismiss' | 'remove_content' | 'ban_user') => {
    try {
      await actionAdminReport(reportId, action);
      alert('Report action processed.');
      loadAdminData();
    } catch (err) {
      alert('Failed to process report action.');
    }
  };

  const handleVerificationAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await actionAdminTeacherVerification(id, action);
      alert(action === 'approve' ? 'Teacher approved with Verified badge!' : 'Verification rejected.');
      loadAdminData();
    } catch (err) {
      alert('Failed to process verification.');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center bg-white rounded-2xl border border-slate-200 mt-8 space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {isBn ? 'অ্যাডমিন অ্যাক্সেস সংরক্ষিত' : 'Admin Access Restricted'}
        </h2>
        <p className="text-slate-500 text-sm">
          {isBn ? 'এই ড্যাশবোর্ডটি শুধুমাত্র বাকৃবি মডারেশন অ্যাডমিনের জন্য।' : 'This panel is restricted to official BAU Academic AI Hub & UEI Administrators.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>BAU AI Governance & Moderation</span>
          </div>
          <h1 className="text-2xl font-extrabold">
            🚨 {isBn ? 'বাকৃবি অ্যাডমিন মডারেশন পোর্টাল' : 'BAU Academic Hub Admin Portal'}
          </h1>
          <p className="text-purple-100/80 text-xs mt-1">
            {isBn ? 'শিক্ষক ভেরিফিকেশন মঞ্জুর, রিপোর্ট পর্যালোচিত এবং কমিউনিটি কনটেন্ট মডারেশন।' : 'Approve teacher verification requests, review student reports, and manage user accounts.'}
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isBn ? 'মোট ইউজার' : 'Total Users'}</span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-semibold">{isBn ? 'কমিউনিটি পোস্ট' : 'Community Posts'}</span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalPosts}</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm space-y-1">
            <span className="text-xs text-amber-800 font-semibold">{isBn ? 'অপেক্ষমান টিচার ভেরিফিকেশন' : 'Pending Teacher Verification'}</span>
            <p className="text-2xl font-extrabold text-amber-900">{stats.pendingTeacherVerificationsCount}</p>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-sm space-y-1">
            <span className="text-xs text-rose-800 font-semibold">{isBn ? 'অপেক্ষমান রিপোর্ট' : 'Pending Reports'}</span>
            <p className="text-2xl font-extrabold text-rose-900">{stats.pendingReportsCount}</p>
          </div>
        </div>
      )}

      {/* Admin Section Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveSection('verifications')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeSection === 'verifications' ? 'border-purple-600 text-purple-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎓 Teacher Verifications ({verifications.filter(v => v.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveSection('reports')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeSection === 'reports' ? 'border-purple-600 text-purple-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🚨 Moderation Reports ({reports.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeSection === 'users' ? 'border-purple-600 text-purple-800' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          👥 User Directory ({users.length})
        </button>
      </div>

      {/* SECTION 1: TEACHER VERIFICATIONS */}
      {activeSection === 'verifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>Pending Teacher Verification Requests</span>
          </h3>

          {verifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No pending teacher verification requests.</p>
          ) : (
            <div className="space-y-3">
              {verifications.map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.userName}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">{req.teacherId}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{req.designation} • {req.facultyName} ({req.departmentName})</p>
                    <p className="text-[11px] text-slate-400">{req.userEmail}</p>
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerificationAction(req.id, 'approve')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Teacher</span>
                      </button>
                      <button
                        onClick={() => handleVerificationAction(req.id, 'reject')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {req.status.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: REPORTS */}
      {activeSection === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Community Content & User Reports</span>
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No active reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{rep.reason}</span>
                    <span className="text-slate-400">{new Date(rep.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold">Target ({rep.targetType}): {rep.targetId}</p>
                  {rep.details && <p className="text-xs text-slate-600 italic">"{rep.details}"</p>}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleReportAction(rep.id, 'dismiss')}
                      className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, 'remove_content')}
                      className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-xs"
                    >
                      Remove Post
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, 'ban_user')}
                      className="px-3 py-1 rounded bg-slate-900 text-white font-bold text-xs"
                    >
                      Ban User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: USERS */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900 text-md">User Accounts Management</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Faculty / Dept</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase())).map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {u.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="p-3 capitalize font-semibold">{u.role}</td>
                    <td className="p-3 text-slate-600">{u.facultyName} ({u.departmentName})</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === 'banned' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
