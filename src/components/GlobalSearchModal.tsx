import React, { useState } from 'react';
import { Search, X, User, FileText, Building2, BookOpen, ChevronRight } from 'lucide-react';
import { globalSearch } from '../services/messagingApi';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string, relatedId?: string) => void;
  onOpenMessageWithUser: (userId: string) => void;
  languageMode?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenMessageWithUser,
  languageMode = 'bilingual'
}) => {
  const isBn = languageMode === 'bn';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: any[]; posts: any[]; communities: any[]; groups: any[] } | null>(null);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await globalSearch(q);
      setResults(res);
    } catch (err) {
      console.error('Global search error:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col border border-slate-200">
        
        {/* Search Header Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isBn ? 'গ্লোবাল সার্চ: ইউজার, কমিউনিটি পোস্ট, বিষয় বা অনুষদ খুঁজুন...' : 'Global Search: Find students, teachers, posts, courses, or faculty groups...'}
            className="flex-1 text-sm font-medium border-0 focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {searching ? (
            <div className="text-center py-8 text-xs text-slate-400">Searching BAU Hub...</div>
          ) : !results ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">{isBn ? 'টাইপ করা শুরু করুন...' : 'Type to search across users, posts, and courses.'}</p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Users */}
              {results.users.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Users ({results.users.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.users.map(u => (
                      <div
                        key={u.id}
                        onClick={() => { onOpenMessageWithUser(u.id); onClose(); }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl cursor-pointer border border-slate-100 flex items-center justify-between transition"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.facultyName} • {u.role}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Posts */}
              {results.posts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Community Posts ({results.posts.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.posts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => { onNavigateTab('community', post.id); onClose(); }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl cursor-pointer border border-slate-100 transition space-y-1"
                      >
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{post.category}</span>
                        <h5 className="font-bold text-xs text-slate-900">{post.title}</h5>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty Communities */}
              {results.communities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Faculty Groups ({results.communities.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.communities.map(g => (
                      <div
                        key={g.id}
                        onClick={() => { onNavigateTab('community'); onClose(); }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl cursor-pointer border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900">{g.name}</p>
                          <p className="text-[10px] text-slate-500">{g.facultyName}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
