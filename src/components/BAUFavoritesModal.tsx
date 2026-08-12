import React from 'react';
import { Star, X, BookmarkCheck, ArrowRight, Trash2 } from 'lucide-react';
import { BAUBookmark, LanguageMode, BAUCourse } from '../types';

interface BAUFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BAUBookmark[];
  courses: BAUCourse[];
  onRemoveBookmark: (id: string) => void;
  onSelectCourse: (course: BAUCourse) => void;
  languageMode: LanguageMode;
}

export const BAUFavoritesModal: React.FC<BAUFavoritesModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  courses,
  onRemoveBookmark,
  onSelectCourse,
  languageMode
}) => {
  const isBn = languageMode === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-amber-500 text-slate-950">
          <div className="flex items-center space-x-2 font-black text-sm">
            <Star className="w-5 h-5 fill-slate-950" />
            <h3>⭐ আমার ফেভারিট বুকমার্কস (My Favorites)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/10 text-slate-950">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Favorites list */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <p>আপনার কোনো বুকমার্ক সেভ করা নেই।</p>
              <p className="text-[11px] text-slate-400">কোর্স বা লেসনে স্টার আইকনে চেপে সেভ করুন!</p>
            </div>
          ) : (
            bookmarks.map((bm) => {
              const matchedCourse = courses.find(c => c.id === bm.itemId);
              return (
                <div
                  key={bm.id}
                  className="p-3.5 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {bm.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{bm.title}</h4>
                    {bm.subtitle && <p className="text-[11px] text-slate-500">{bm.subtitle}</p>}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {matchedCourse && (
                      <button
                        onClick={() => {
                          onSelectCourse(matchedCourse);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 text-xs font-bold transition-all"
                        title="Open Course"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="p-2 rounded-xl bg-slate-200/70 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-all"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
