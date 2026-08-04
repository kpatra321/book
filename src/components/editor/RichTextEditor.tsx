import React, { useState, useEffect } from 'react';
import { Bold, Italic, List, Table, Heading1, Heading2, Eye, Edit3, Save, Check, Sparkles } from 'lucide-react';
import { useBookStore } from '../../store/useBookStore';
import { marked } from 'marked';

export const RichTextEditor: React.FC = () => {
  const { activeBookId, books, activeChapterId, updateChapterContent } = useBookStore();
  const activeBook = books.find(b => b.id === activeBookId);
  const activeChapter = activeBook?.chapters.find(c => c.id === activeChapterId);

  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (activeChapter) {
      setContent(activeChapter.content || '');
    }
  }, [activeChapterId, activeChapter?.content]);

  if (!activeBook || !activeChapter) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
        Select a book and chapter to start editing.
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (activeBookId && activeChapterId) {
      updateChapterContent(activeBookId, activeChapterId, val);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const insertMarkdown = (syntax: string) => {
    setContent(prev => prev + '\n' + syntax + '\n');
    if (activeBookId && activeChapterId) {
      updateChapterContent(activeBookId, activeChapterId, content + '\n' + syntax + '\n');
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="h-full flex flex-col bg-slate-950 border-x border-slate-800">
      {/* Editor Toolbar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => insertMarkdown('**Bold Text**')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('*Italic Text*')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('## Heading 2')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Heading 2"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('### Heading 3')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Heading 3"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('- Bullet list item')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertMarkdown('| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Data 1 | Data 2 | Data 3 |')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Table"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>

        {/* Status & View Mode */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          {isSaved && (
            <span className="flex items-center space-x-1 text-emerald-400 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Autosaved</span>
            </span>
          )}
          <span>{wordCount} words</span>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {isPreview ? (
          <div
            className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: marked.parse(content || '') as string }}
          />
        ) : (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Type your chapter content in Markdown or HTML..."
            className="w-full h-full min-h-[500px] bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
        )}
      </div>
    </div>
  );
};
