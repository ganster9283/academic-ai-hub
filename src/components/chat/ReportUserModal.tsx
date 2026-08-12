import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Send } from 'lucide-react';
import { reportUser, blockUser } from '../../services/messagingApi';

interface ReportUserModalProps {
  targetUserId: string;
  targetUserName: string;
  isOpen: boolean;
  onClose: () => void;
  languageMode?: string;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  targetUserId,
  targetUserName,
  isOpen,
  onClose,
  languageMode = 'bilingual'
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState('Harassment / Abuse');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBn = languageMode === 'bn';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportUser(targetUserId, reason, details);
      if (alsoBlock) {
        await blockUser(targetUserId);
      }
      alert(isBn ? 'রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে।' : 'Report submitted successfully.');
      onClose();
    } catch (err: any) {
      alert(err.message || 'রিপোর্ট পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-rose-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-200" />
            <h3 className="font-bold text-base">{isBn ? 'ব্যবহারকারী রিপোর্ট করুন' : 'Report & Block User'}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-800 text-xs">
          <p className="text-slate-600">
            {isBn ? `আপনি ${targetUserName} কে রিপোর্ট করছেন। অনুগ্রহ করে কারণ নির্বাচন করুন:` : `You are reporting ${targetUserName}. Please select the reason:`}
          </p>

          <div>
            <label className="block font-bold mb-1 text-slate-700">
              {isBn ? 'রিপোর্টের কারণ' : 'Reason for report'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Harassment / Abuse">{isBn ? 'আক্রমণাত্মক ভাষা / হয়রানি' : 'Harassment / Offensive behavior'}</option>
              <option value="Spam / Unsolicited Messages">{isBn ? 'স্প্যাম / অপ্রয়োজনীয় মেসেজ' : 'Spam messages'}</option>
              <option value="Inappropriate Content">{isBn ? 'অনুপযুক্ত তথ্য বা কনটেন্ট' : 'Inappropriate content'}</option>
              <option value="Impersonation">{isBn ? 'ভুয়া বা ছদ্মবেশী অ্যাকাউন্ট' : 'Impersonation'}</option>
              <option value="Other">{isBn ? 'অন্যান্য কারণ' : 'Other'}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700">
              {isBn ? 'বিস্তারিত বর্ণনা (ঐচ্ছিক)' : 'Details (Optional)'}
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={isBn ? 'কী ঘটেছিল সংক্ষেপে লিখুন...' : 'Describe what happened...'}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="font-semibold text-slate-700">
              {isBn ? 'একইসাথে এই ব্যবহারকারীকে ব্লক করুন' : 'Also block this user from messaging me'}
            </span>
          </label>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (isBn ? 'পাঠানো হচ্ছে...' : 'Submitting...') : (isBn ? 'জমা দিন' : 'Submit Report')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
