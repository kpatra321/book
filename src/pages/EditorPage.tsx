import React, { useState } from 'react';
import { ChapterTree } from '../components/book/ChapterTree';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { AIAssistantPanel } from '../components/ai/AIAssistantPanel';
import { FileUploadZone } from '../components/files/FileUploadZone';
import { FileText, Sparkles, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export const EditorPage: React.FC = () => {
  const [rightTab, setRightTab] = useState<'ai' | 'files'>('ai');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="h-full flex overflow-hidden bg-slate-950">
      {/* Left Chapter Tree Pane */}
      {leftOpen && (
        <div className="w-64 h-full shrink-0">
          <ChapterTree />
        </div>
      )}

      {/* Toggle Left Button */}
      <button
        onClick={() => setLeftOpen(!leftOpen)}
        className="h-10 my-auto px-1 bg-slate-900 border border-slate-800 rounded-r text-slate-400 hover:text-slate-100 z-10"
        title="Toggle Chapter Tree"
      >
        {leftOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Center Rich Text Editor Pane */}
      <div className="flex-1 h-full min-w-0">
        <RichTextEditor />
      </div>

      {/* Toggle Right Button */}
      <button
        onClick={() => setRightOpen(!rightOpen)}
        className="h-10 my-auto px-1 bg-slate-900 border border-slate-800 rounded-l text-slate-400 hover:text-slate-100 z-10"
        title="Toggle AI Assistant & Files"
      >
        {rightOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Right AI & Files Drawer */}
      {rightOpen && (
        <div className="w-80 h-full shrink-0 flex flex-col bg-slate-900/60 border-l border-slate-800">
          {/* Right Header Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setRightTab('ai')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                rightTab === 'ai'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setRightTab('files')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                rightTab === 'files'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'ai' ? (
              <AIAssistantPanel />
            ) : (
              <div className="p-4 space-y-4">
                <FileUploadZone />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
