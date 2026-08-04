import React, { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { EditorPage } from './pages/EditorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { GoogleDrivePage } from './pages/GoogleDrivePage';
import { SettingsPage } from './pages/SettingsPage';
import { ExportCenterModal } from './components/export/ExportCenterModal';
import { useBookStore } from './store/useBookStore';
import { useSettingsStore } from './store/useSettingsStore';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { loadBooks } = useBookStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    loadBooks();
    loadSettings();
  }, [loadBooks, loadSettings]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onLaunchApp={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <DashboardPage onNavigateTab={setActiveTab} onOpenExport={() => setIsExportOpen(true)} />;
      case 'library':
        return <LibraryPage onNavigateTab={setActiveTab} />;
      case 'editor':
        return <EditorPage />;
      case 'templates':
        return <TemplatesPage onNavigateTab={setActiveTab} />;
      case 'drive':
        return <GoogleDrivePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigateTab={setActiveTab} onOpenExport={() => setIsExportOpen(true)} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenDrive={() => setActiveTab('drive')}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Content Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden bg-slate-950 relative">
          {renderTabContent()}
        </main>
      </div>

      {/* Modals */}
      <ExportCenterModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

export default App;
