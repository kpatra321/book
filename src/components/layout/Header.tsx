import React from 'react';
import { BookOpen, Sparkles, Download, Settings, HardDrive, Moon, Sun } from 'lucide-react';
import { useBookStore } from '../../store/useBookStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface HeaderProps {
  onOpenExport: () => void;
  onOpenDrive: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport, onOpenDrive, onOpenSettings }) => {
  const { books, activeBookId } = useBookStore();
  const { theme, setTheme, settings, isDriveConnected } = useSettingsStore();
  const activeBook = books.find(b => b.id === activeBookId);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left Title & Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-100 tracking-tight">OpenBook <span className="text-emerald-400">AI</span></span>
        </div>

        {activeBook && (
          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeBook.category}
            </span>
            <span className="text-sm text-slate-300 font-medium truncate max-w-[200px]">
              {activeBook.title}
            </span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* AI Provider Status Pill */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium capitalize">{settings.activeProvider} AI</span>
        </div>

        {/* Google Drive Link Button */}
        <button
          onClick={onOpenDrive}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDriveConnected
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDriveConnected ? 'Drive Connected' : 'Google Drive'}</span>
        </button>

        {/* Export Center Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Center</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
