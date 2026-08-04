import { create } from 'zustand';
import { AISettings } from '../types/ai';
import { getSettings, saveSettings } from '../services/db/indexDB';
import { googleDriveService } from '../services/google-drive/googleDriveService';

interface SettingsState {
  settings: AISettings;
  theme: 'dark' | 'light' | 'system';
  isDriveConnected: boolean;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AISettings>) => Promise<void>;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  connectGoogleDrive: (accessToken: string) => void;
  disconnectGoogleDrive: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    activeProvider: 'none',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3',
    openaiModel: 'gpt-4o-mini',
    geminiModel: 'gemini-1.5-flash',
    claudeModel: 'claude-3-5-haiku-20241022',
  },
  theme: 'dark',
  isDriveConnected: false,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    const settings = await getSettings();
    set({ settings, isLoading: false });
  },

  updateSettings: async (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    await saveSettings(updated);
    set({ settings: updated });
  },

  setTheme: (theme) => {
    set({ theme });
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    }
  },

  connectGoogleDrive: (accessToken) => {
    googleDriveService.setAccessToken(accessToken);
    set({ isDriveConnected: true });
  },

  disconnectGoogleDrive: () => {
    googleDriveService.setAccessToken('');
    set({ isDriveConnected: false });
  },
}));
