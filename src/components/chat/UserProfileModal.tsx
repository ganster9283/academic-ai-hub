import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, User, GraduationCap, Shield, Lock, Save, Camera, Check, LogOut } from 'lucide-react';
import { updateProfile } from '../../services/messagingApi';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  languageMode?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
  onLogout,
  languageMode = 'bilingual'
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [designationOrYear, setDesignationOrYear] = useState(user.designationOrYear || '');
  const [studentOrTeacherId, setStudentOrTeacherId] = useState(user.studentOrTeacherId || '');
  const [facultyName, setFacultyName] = useState(user.facultyName || 'Faculty of Veterinary Science');
  const [departmentName, setDepartmentName] = useState(user.departmentName || 'Dept of Anatomy & Histology');
  const [privacy, setPrivacy] = useState(user.privacyWhoCanMessage || 'everyone');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile({
        name,
        bio,
        designationOrYear,
        studentOrTeacherId,
        facultyName,
        departmentName,
        privacyWhoCanMessage: privacy as any,
        avatarUrl
      });
      onProfileUpdated(res.user);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  const isBn = languageMode === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/30 bg-white"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                  user.role === 'teacher' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'
                }`}>
                  {user.role === 'teacher' ? (isBn ? '👨‍🏫 শিক্ষক' : 'Teacher') : (isBn ? '🎓 শিক্ষার্থী' : 'Student')}
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Avatar URL / Preset Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'প্রোফাইল ছবি (Image URL/Avatar)' : 'Profile Photo URL'}
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'নাম (Full Name)' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'বায়ো (Bio / About Me)' : 'Bio / Short Introduction'}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={isBn ? 'আপনার শিক্ষাগত লক্ষ্য বা বিষয়ের বর্ণনা...' : 'Brief academic bio...'}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Academic Information Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs border-b border-slate-200 pb-2">
              <GraduationCap className="w-4 h-4" />
              <span>{isBn ? 'অ্যাকাডেমিক তথ্য (BAU Info)' : 'Academic Information'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isBn ? 'ফ্যাকাল্টি (Faculty)' : 'Faculty'}
                </label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isBn ? 'ডিপার্টমেন্ট (Department)' : 'Department'}
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {user.role === 'teacher' ? (isBn ? 'পদবী (Designation)' : 'Designation') : (isBn ? 'বর্ষ/লেভেল (Year/Level)' : 'Year / Semester')}
                </label>
                <input
                  type="text"
                  value={designationOrYear}
                  onChange={(e) => setDesignationOrYear(e.target.value)}
                  placeholder="e.g. Level 1, Semester 2"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {user.role === 'teacher' ? (isBn ? 'শিক্ষক আইডি' : 'Teacher ID') : (isBn ? 'স্টুডেন্ট আইডি' : 'Student ID')}
                </label>
                <input
                  type="text"
                  value={studentOrTeacherId}
                  onChange={(e) => setStudentOrTeacherId(e.target.value)}
                  placeholder="e.g. BAU-2023-0142"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>{isBn ? 'প্রাইভেসি সেটিং (Privacy)' : 'Messaging Privacy'}</span>
            </div>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="everyone">{isBn ? 'সবাই মেসেজ পাঠাতে পারবে' : 'Everyone can message me'}</option>
              <option value="teachers_only">{isBn ? 'শুধু শিক্ষকরা মেসেজ পাঠাতে পারবেন' : 'Teachers only'}</option>
              <option value="department_only">{isBn ? 'শুধু নিজ ডিপার্টমেন্টের মেম্বাররা' : 'Same Department members only'}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{isBn ? 'লগআউট' : 'Logout'}</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{isBn ? 'সংরক্ষিত!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? (isBn ? 'সেভ হচ্ছে...' : 'Saving...') : (isBn ? 'সংরক্ষণ করুন' : 'Save Profile')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
