import React, { useState } from 'react';
import { Sparkles, Send, FileText, CheckCircle2, ListTree, BookOpen, AlertCircle, Bookmark } from 'lucide-react';
import { aiService } from '../../services/ai/aiService';
import { useBookStore } from '../../store/useBookStore';
import { useFileStore } from '../../store/useFileStore';
import { RAGQueryResult } from '../../types/rag';

export const AIAssistantPanel: React.FC = () => {
  const { activeBookId, books, updateChapterContent, activeChapterId } = useBookStore();
  const { files } = useFileStore();
  const activeBook = books.find(b => b.id === activeBookId);
  const activeChapter = activeBook?.chapters.find(c => c.id === activeChapterId);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RAGQueryResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !activeBookId) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await aiService.askWithRAG(activeBookId, query);
      setResult(res);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToChapter = () => {
    if (!result || !activeBookId || !activeChapterId || !activeChapter) return;
    const newContent = activeChapter.content + `\n\n### AI Generated Note (Evidence Backed)\n` + result.answer;
    updateChapterContent(activeBookId, activeChapterId, newContent);
    setStatusMessage('Added to current chapter!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleCleanFormatting = async () => {
    if (!activeBookId || !activeChapterId || !activeChapter) return;
    setLoading(true);
    try {
      const cleaned = await aiService.cleanFormatting(activeChapter.content);
      await updateChapterContent(activeBookId, activeChapterId, cleaned);
      setStatusMessage('Chapter formatting cleaned!');
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleGenerateGlossary = async () => {
    if (!activeBookId || !activeChapterId || !activeChapter) return;
    setLoading(true);
    try {
      const glossary = await aiService.generateGlossary(activeChapter.content);
      const newContent = activeChapter.content + '\n\n' + glossary;
      await updateChapterContent(activeBookId, activeChapterId, newContent);
      setStatusMessage('Glossary added!');
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border-l border-slate-800 p-4 space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-slate-100 text-sm">AI Assistant & RAG Engine</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {files.length} Docs Indexed
        </span>
      </div>

      {/* Quick Action Tools */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCleanFormatting}
          disabled={loading || !activeChapter}
          className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Clean Formatting</span>
        </button>

        <button
          onClick={handleGenerateGlossary}
          disabled={loading || !activeChapter}
          className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors disabled:opacity-50"
        >
          <ListTree className="w-3.5 h-3.5 text-blue-400" />
          <span>Gen Glossary</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* RAG Query Answer Area */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
            <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
            <p>Searching RAG knowledge base & generating answer...</p>
          </div>
        ) : result ? (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <span className="font-semibold text-amber-400 text-xs block">AI Answer (Evidence Backed)</span>
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{result.answer}</p>
            </div>

            {/* Citations List */}
            {result.citations.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider block">
                  Source Evidence Citations ({result.citations.length})
                </span>
                {result.citations.map((c, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 text-emerald-400">
                        <Bookmark className="w-3 h-3" />
                        <span>{c.fileName}</span>
                      </span>
                      <span>{c.pageNumber ? `Pg ${c.pageNumber}` : c.sheetName ? `Sheet: ${c.sheetName}` : ''}</span>
                    </div>
                    <p className="text-slate-300 italic text-[11px]">"{c.snippet}"</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleApplyToChapter}
              className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-xs flex items-center justify-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Insert Response into Current Chapter</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-600" />
            <p>Ask any question about your uploaded documents.</p>
            <p className="text-[11px] text-slate-600">OpenBook AI only uses your uploaded evidence and never invents facts.</p>
          </div>
        )}
      </div>

      {/* Query Form */}
      <form onSubmit={handleAsk} className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI using uploaded files..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
