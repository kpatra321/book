import React from 'react';
import { BookOpen, FileText, Plus, HardDrive, Sparkles, Download, Trees, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';
import { useFileStore } from '../store/useFileStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { GlassCard } from '../components/common/GlassCard';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenExport: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab, onOpenExport }) => {
  const { books, setActiveBook, createBook } = useBookStore();
  const { files } = useFileStore();
  const { isDriveConnected, settings } = useSettingsStore();

  const handleCreateForestBook = async () => {
    await createBook('Pine Ridge Beat Handbook', 'Forest Beat Handbook', 'forest_beat_handbook');
    onNavigateTab('editor');
  };

  const handleCreateBlankBook = async () => {
    await createBook('New Custom Book', 'General', 'custom_book');
    onNavigateTab('editor');
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/20">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome to OpenBook Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Client-side PWA • Active AI: <span className="text-emerald-400 capitalize font-medium">{settings.activeProvider}</span> • Drive: <span className="text-blue-400 font-medium">{isDriveConnected ? 'Connected' : 'Not Connected'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateForestBook}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-950/50 transition-colors"
          >
            <Trees className="w-4 h-4" />
            <span>Create Forest Beat Handbook</span>
          </button>

          <button
            onClick={handleCreateBlankBook}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Blank Book</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Books</span>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{books.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Files</span>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{files.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Drive</span>
              <h3 className="text-sm font-semibold text-slate-200 mt-2">{isDriveConnected ? 'Sync Enabled' : 'Not Connected'}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PWA Status</span>
              <h3 className="text-sm font-semibold text-emerald-400 mt-2">100% Offline Ready</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Books Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">Recent Books</h2>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs text-emerald-400 font-medium hover:underline flex items-center space-x-1"
          >
            <span>View All Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.slice(0, 3).map(book => (
            <GlassCard key={book.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {book.category}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(book.updatedAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-base line-clamp-1">{book.title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{book.subtitle || book.metadata.description || 'No description'}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">{book.chapters.length} Chapters</span>
                <button
                  onClick={() => {
                    setActiveBook(book.id);
                    onNavigateTab('editor');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  Open Editor
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
