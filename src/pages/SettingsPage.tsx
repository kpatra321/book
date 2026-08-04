import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Key, Cpu, Moon, Sun, Download, Upload, ShieldCheck, Check, Database } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { GlassCard } from '../components/common/GlassCard';
import { AIProviderType } from '../types/ai';
import { db } from '../services/db/indexDB';
import saveAs from 'file-saver';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, theme, setTheme } = useSettingsStore();

  const [activeProvider, setActiveProvider] = useState<AIProviderType>(settings.activeProvider || 'none');
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiKey || '');
  const [claudeKey, setClaudeKey] = useState(settings.claudeKey || '');
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl || 'http://localhost:11434');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setActiveProvider(settings.activeProvider || 'none');
    setOpenaiKey(settings.openaiKey || '');
    setGeminiKey(settings.geminiKey || '');
    setClaudeKey(settings.claudeKey || '');
    setOllamaUrl(settings.ollamaUrl || 'http://localhost:11434');
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      activeProvider,
      openaiKey,
      geminiKey,
      claudeKey,
      ollamaUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = async () => {
    const books = await db.books.toArray();
    const files = await db.files.toArray();
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      books,
      files,
      settings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    saveAs(blob, `openbook_ai_backup_${Date.now()}.json`);
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure pluggable AI providers, theme preferences, local IndexedDB backups, and privacy parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Provider Section */}
        <GlassCard className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3>Pluggable AI Model Configuration</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'none', label: 'AI Disabled (Manual Editing)', desc: '100% manual writing & format tools' },
              { id: 'webllm', label: 'Local WebLLM', desc: 'Runs in browser memory via WebGPU' },
              { id: 'openai', label: 'OpenAI API Key', desc: 'Connect gpt-4o or gpt-4o-mini' },
              { id: 'gemini', label: 'Google Gemini API Key', desc: 'Connect gemini-1.5-flash' },
              { id: 'claude', label: 'Anthropic Claude API Key', desc: 'Connect claude-3-5-haiku' },
              { id: 'ollama', label: 'Local Ollama Endpoint', desc: 'Connect localhost:11434' },
            ].map(p => (
              <div
                key={p.id}
                onClick={() => setActiveProvider(p.id as AIProviderType)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeProvider === p.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="font-semibold text-xs block">{p.label}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{p.desc}</span>
              </div>
            ))}
          </div>

          {/* Key Inputs */}
          {activeProvider === 'openai' && (
            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-medium">OpenAI API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {activeProvider === 'gemini' && (
            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-medium">Google Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {activeProvider === 'claude' && (
            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-medium">Anthropic Claude API Key</label>
              <input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {activeProvider === 'ollama' && (
            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-medium">Ollama Server URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </GlassCard>

        {/* Theme Settings */}
        <GlassCard className="space-y-3">
          <h3 className="font-bold text-slate-100 text-sm">Theme Appearance</h3>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
                theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Theme</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
                theme === 'light' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Theme</span>
            </button>
          </div>
        </GlassCard>

        {/* Data Backup & Restore */}
        <GlassCard className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3>Local IndexedDB Data Backup</h3>
          </div>
          <p className="text-xs text-slate-400">
            Export all your local books, files, and settings into a JSON backup file to move between browsers or computers.
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Full Data Backup (.json)</span>
            </button>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3">
          {savedSuccess && (
            <span className="flex items-center space-x-1 text-emerald-400 text-xs font-medium">
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
