import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { X, Users, Check, Plus, Search } from 'lucide-react';
import { searchUsers, createGroupConversation } from '../../services/messagingApi';

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: any) => void;
  languageMode?: string;
}

export const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
  languageMode = 'bilingual'
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBn = languageMode === 'bn';

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      const res = await searchUsers(searchQuery);
      setAvailableUsers(res.users);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(isBn ? 'গ্রুপের নাম প্রদান করুন।' : 'Please enter a group name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createGroupConversation(name, description, undefined, selectedUserIds);
      onGroupCreated(res.conversation);
      onClose();
    } catch (err: any) {
      alert(err.message || 'গ্রুপ তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-200" />
            <h3 className="font-bold text-base">{isBn ? 'নতুন গ্রুপ চ্যানেল তৈরি করুন' : 'Create New Group / Channel'}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-slate-800 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700">
              {isBn ? 'গ্রুপের নাম' : 'Group Name'} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DVM Level-1 Study Group or BAU Agro Club"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700">
              {isBn ? 'গ্রুপের বিবরণ' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Group for course notes and lab discussions..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Select Members */}
          <div>
            <label className="block font-bold mb-1 text-slate-700">
              {isBn ? 'মেম্বারদের যুক্ত করুন' : 'Add Members'}
            </label>
            
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম বা ডিপার্টমেন্ট দিয়ে খুঁজুন...' : 'Search student or teacher...'}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 p-1">
              {availableUsers.length === 0 ? (
                <p className="p-3 text-center text-slate-400">{isBn ? 'কোনো ইউজার পাওয়া যায়নি' : 'No users found'}</p>
              ) : (
                availableUsers.map(u => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleSelectUser(u.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.departmentName || u.role}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

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
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? (isBn ? 'তৈরি হচ্ছে...' : 'Creating...') : (isBn ? 'গ্রুপ তৈরি করুন' : 'Create Group')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
