import React from 'react';
import { X, Bookmark, Trash2, Copy, Download, Check, BookOpen } from 'lucide-react';
import { SubjectCategory } from '../types';
import { cleanMathAndMarkdown } from '../utils/mathFormatter';

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  subject: SubjectCategory;
  createdAt: number;
}

interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNote[];
  onDeleteNote: (id: string) => void;
}

export const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onDeleteNote
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (note: SavedNote) => {
    const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_note.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">সংরক্ষিত নোটস (Saved Notes Library)</h3>
              <p className="text-xs text-slate-500">{savedNotes.length} টি সংরক্ষিত নোট রয়েছে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {savedNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">কোনো সংরক্ষিত নোটস নেই</p>
              <p className="text-xs">AI Tutor বা Lesson Notes থেকে পছন্দের নোটস সেভ করো!</p>
            </div>
          ) : (
            savedNotes.map((note) => (
              <div key={note.id} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {note.subject}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{note.title}</h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopy(note.id, note.content)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                      title="কপি"
                    >
                      {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDownloadTxt(note)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                      title="ডাউনলোড"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-100 break-words">
                  {cleanMathAndMarkdown(note.content)}
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
