import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, GripVertical, FileText, Folder, BookOpen } from 'lucide-react';
import { useBookStore } from '../../store/useBookStore';
import { Chapter } from '../../types/book';

export const ChapterTree: React.FC = () => {
  const { activeBookId, books, activeChapterId, setActiveChapter, addChapter, deleteChapter, reorderChapters } = useBookStore();
  const activeBook = books.find(b => b.id === activeBookId);

  const [newTitle, setNewTitle] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  if (!activeBook) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeBookId) return;
    addChapter(activeBookId, newTitle.trim());
    setNewTitle('');
    setShowAddInput(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border-r border-slate-800 p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Book Structure</span>
        </div>
        <button
          onClick={() => setShowAddInput(!showAddInput)}
          className="p-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
          title="Add Chapter"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Input */}
      {showAddInput && (
        <form onSubmit={handleAdd} className="flex items-center space-x-1 px-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Chapter Title..."
            autoFocus
            className="flex-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium"
          >
            Add
          </button>
        </form>
      )}

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {activeBook.chapters.map((chapter, idx) => {
          const isActive = chapter.id === activeChapterId;
          return (
            <div
              key={chapter.id}
              onClick={() => setActiveChapter(chapter.id)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="truncate">{chapter.title}</span>
              </div>

              {activeBook.chapters.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeBookId) deleteChapter(activeBookId, chapter.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  title="Delete Chapter"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
