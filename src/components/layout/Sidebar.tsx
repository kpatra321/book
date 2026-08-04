import React from 'react';
import { Home, LayoutDashboard, Library, BookOpen, LayoutTemplate, HardDrive, Sparkles, Download, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'landing', label: 'Home Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'Book Library', icon: Library },
    { id: 'editor', label: 'Book Editor', icon: BookOpen },
    { id: 'templates', label: 'Templates & Forest Mode', icon: LayoutTemplate },
    { id: 'drive', label: 'Google Drive', icon: HardDrive },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'export', label: 'Export Center', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
          OpenBook Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* PWA & Open Source Footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>Client-Side PWA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-slate-500 text-[11px]">
            100% browser-based. Zero server required.
          </p>
        </div>
      </div>
    </aside>
  );
};
