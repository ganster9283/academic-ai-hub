import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  Lock, 
  UserCheck, 
  Edit3, 
  Check, 
  Bookmark, 
  UserX, 
  Send,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { updateProfile, requestTeacherVerification, unblockUser, fetchCommunityPosts } from '../services/messagingApi';

interface ProfileTabProps {
  languageMode?: string;
  currentUser: UserProfile | null;
  onProfileUpdated?: (user: UserProfile) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  languageMode = 'bilingual',
  currentUser,
  onProfileUpdated
}) => {
  const isBn = languageMode === 'bn';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [facultyName, setFacultyName] = useState(currentUser?.facultyName || 'Faculty of Veterinary Science');
  const [departmentName, setDepartmentName] = useState(currentUser?.departmentName || 'Dept of Anatomy & Histology');
  const [designationOrYear, setDesignationOrYear] = useState(currentUser?.designationOrYear || 'Level 1, Semester 2');
  const [privacyWhoCanMessage, setPrivacyWhoCanMessage] = useState<'everyone' | 'teachers_only' | 'department_only'>(
    currentUser?.privacyWhoCanMessage || 'everyone'
  );

  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'privacy'>('profile');

  // Teacher Verification Request Modal
  const [isTeacherVerifyModalOpen, setIsTeacherVerifyModalOpen] = useState(false);
  const [teacherIdInput, setTeacherIdInput] = useState('');
  const [designationInput, setDesignationInput] = useState('');
  const [verifySubmitting, setVerifySubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setBio(currentUser.bio || '');
      setFacultyName(currentUser.facultyName || 'Faculty of Veterinary Science');
      setDepartmentName(currentUser.departmentName || 'Dept of Anatomy & Histology');
      setDesignationOrYear(currentUser.designationOrYear || 'Level 1, Semester 2');
      setPrivacyWhoCanMessage(currentUser.privacyWhoCanMessage || 'everyone');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedPosts();
    }
  }, [activeTab]);

  const loadSavedPosts = async () => {
    setLoadingSaved(true);
    try {
      const data = await fetchCommunityPosts({ savedOnly: true });
      setSavedPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch saved posts:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const data = await updateProfile({
        name,
        bio,
        facultyName,
        departmentName,
        designationOrYear,
        privacyWhoCanMessage
      });
      if (onProfileUpdated) onProfileUpdated(data.user);
      setIsEditing(false);
      alert(isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handleTeacherVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherIdInput || !designationInput) return;

    setVerifySubmitting(true);
    try {
      await requestTeacherVerification({
        teacherId: teacherIdInput,
        designation: designationInput,
        facultyName,
        departmentName
      });
      alert(isBn ? 'শিক্ষক ভেরিফিকেশন আবেদন জমা নেওয়া হয়েছে।' : 'Teacher verification request submitted to BAU Admin.');
      setIsTeacherVerifyModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit verification.');
    } finally {
      setVerifySubmitting(false);
    }
  };

  const handleUnblock = async (blockedId: string) => {
    try {
      const res = await unblockUser(blockedId);
      if (currentUser && onProfileUpdated) {
        onProfileUpdated({ ...currentUser, blockedUserIds: res.blockedUserIds });
      }
    } catch (err) {
      alert('Failed to unblock user.');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-white rounded-2xl border border-slate-200 mt-6 space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          {isBn ? 'অনুগ্রহ করে লগইন করুন' : 'Please Sign In'}
        </h2>
        <p className="text-slate-500 text-sm">
          {isBn ? 'আপনার স্টুডেন্ট প্রোফাইল দেখতে অ্যাকাউন্টে লগইন করুন।' : 'Log in to manage your BAU academic profile, privacy, and saved posts.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 relative">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              BAU Academic Hub
            </span>
          </div>
        </div>

        <div className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg bg-white"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
                  {currentUser.isVerifiedTeacher && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Teacher</span>
                    </span>
                  )}
                  {currentUser.role === 'admin' && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">
                      BAU Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-0.5 font-mono">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'teacher' && !currentUser.isVerifiedTeacher && (
                <button
                  onClick={() => setIsTeacherVerifyModalOpen(true)}
                  className="bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-amber-700 transition"
                >
                  ✓ Request Teacher Verification
                </button>
              )}
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? (isBn ? 'সম্পাদনা বাতিল' : 'Cancel Edit') : (isBn ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile')}</span>
              </button>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-sm text-slate-700 italic border-t border-slate-100 pt-3">
            "{currentUser.bio || 'Bangladesh Agricultural University student passionate about academic excellence.'}"
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'profile' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎓 {isBn ? 'একাডেমিক তথ্য' : 'Academic Profile'}
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'saved' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🔖 {isBn ? 'সংরক্ষিত পোস্ট' : 'Saved Posts'}
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'privacy' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🔒 {isBn ? 'গোপনীয়তা ও নিরাপত্তা' : 'Privacy & Security'}
        </button>
      </div>

      {/* TAB 1: ACADEMIC PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              <span>{isBn ? 'একাডেমিক বিবরণী' : 'BAU Academic Record'}</span>
            </h3>
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Year</label>
                <input
                  type="text"
                  value={designationOrYear}
                  onChange={(e) => setDesignationOrYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-emerald-700 transition"
              >
                Save Profile Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isBn ? 'অনুষদ' : 'Faculty'}</span>
                <p className="font-bold text-slate-800 text-sm">{currentUser.facultyName || 'Faculty of Veterinary Science'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isBn ? 'বিভাগ' : 'Department'}</span>
                <p className="font-bold text-slate-800 text-sm">{currentUser.departmentName || 'Dept of Anatomy & Histology'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isBn ? 'বর্ষ / পদবি' : 'Level / Designation'}</span>
                <p className="font-bold text-slate-800 text-sm">{currentUser.designationOrYear || 'Level 1, Semester 2'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">{isBn ? 'স্টুডেন্ট / টিচার আইডি' : 'Student/Teacher ID'}</span>
                <p className="font-bold text-slate-800 text-sm font-mono">{currentUser.studentOrTeacherId || 'BAU-2023-0142'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED POSTS */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            <span>{isBn ? 'সংরক্ষিত পোস্টসমূহ' : 'Your Bookmarked Posts'}</span>
          </h3>

          {loadingSaved ? (
            <div className="text-center py-6 text-slate-400 text-xs">Loading saved posts...</div>
          ) : savedPosts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {isBn ? 'আপনার কোন সংরক্ষিত পোস্ট নেই।' : 'You have not saved any community posts yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {savedPosts.map(post => (
                <div key={post.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs font-semibold text-emerald-700">{post.category}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRIVACY & SECURITY */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-700" />
            <span>{isBn ? 'মেসেজিং ও নিরাপত্তা সেটিংস' : 'Messaging & Privacy Controls'}</span>
          </h3>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isBn ? 'কারা আপনাকে সরাসরি বার্তা পাঠাতে পারবে?' : 'Who can send you direct messages?'}
              </label>
              <select
                value={privacyWhoCanMessage}
                onChange={(e: any) => setPrivacyWhoCanMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="everyone">🌐 Everyone (সবাই)</option>
                <option value="teachers_only">🎓 Verified Teachers Only (শুধুমাত্র শিক্ষকগণ)</option>
                <option value="department_only">🏛️ My Department Only (নিজের বিভাগ)</option>
              </select>
            </div>

            <button
              onClick={handleSaveProfile}
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700"
            >
              Save Privacy Settings
            </button>

            {/* Blocked Users Section */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                🚫 Blocked Users ({currentUser.blockedUserIds?.length || 0})
              </h4>
              {(!currentUser.blockedUserIds || currentUser.blockedUserIds.length === 0) ? (
                <p className="text-xs text-slate-400">No blocked users.</p>
              ) : (
                <div className="space-y-2">
                  {currentUser.blockedUserIds.map(uid => (
                    <div key={uid} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                      <span className="font-mono text-slate-700">{uid}</span>
                      <button
                        onClick={() => handleUnblock(uid)}
                        className="text-emerald-700 hover:underline font-bold"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TEACHER VERIFICATION MODAL */}
      {isTeacherVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'শিক্ষক ভেরিফিকেশন আবেদন' : 'Teacher Verification Request'}</span>
            </h3>

            <form onSubmit={handleTeacherVerificationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Teacher ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAU-FAC-0490"
                  value={teacherIdInput}
                  onChange={(e) => setTeacherIdInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor"
                  value={designationInput}
                  onChange={(e) => setDesignationInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherVerifyModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifySubmitting}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
