import React, { useState } from 'react';
import { HardDrive, RefreshCw, CheckCircle2, FileText, AlertCircle, Key, FolderSync } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { googleDriveService, GoogleDriveFile } from '../services/google-drive/googleDriveService';
import { GlassCard } from '../components/common/GlassCard';

export const GoogleDrivePage: React.FC = () => {
  const { isDriveConnected, connectGoogleDrive, disconnectGoogleDrive } = useSettingsStore();
  const [tokenInput, setTokenInput] = useState('');
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    connectGoogleDrive(tokenInput.trim());
    setTokenInput('');
    handleFetchFiles();
  };

  const handleFetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const files = await googleDriveService.listFiles('root');
      setDriveFiles(files);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Google Drive files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <HardDrive className="w-6 h-6 text-blue-400" />
          <span>Google Drive Integration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Connect your own Google Drive using client-side OAuth token. No user account or backend required.
        </p>
      </div>

      {/* Connection Status Card */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${isDriveConnected ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Status: {isDriveConnected ? 'Connected to Google Drive' : 'Disconnected'}
              </h3>
              <p className="text-xs text-slate-400">
                {isDriveConnected ? 'Drive REST API active. Ready to sync files.' : 'Provide an OAuth Access Token to access your Google Drive.'}
              </p>
            </div>
          </div>

          {isDriveConnected ? (
            <button
              onClick={disconnectGoogleDrive}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Disconnect
            </button>
          ) : null}
        </div>

        {!isDriveConnected && (
          <form onSubmit={handleConnect} className="space-y-3 pt-3 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Google OAuth Access Token
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste OAuth Access Token (ya29...)"
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Connect Drive
                </button>
              </div>
            </div>
          </form>
        )}
      </GlassCard>

      {/* Drive File Browser */}
      {isDriveConnected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Google Drive Files & Sync</h3>
            <button
              onClick={handleFetchFiles}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Files</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            {driveFiles.map(file => (
              <GlassCard key={file.id} className="p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 truncate">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-medium text-slate-200 block truncate">{file.name}</span>
                    <span className="text-[11px] text-slate-500">Modified: {new Date(file.modifiedTime).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Importing ${file.name} to active book...`)}
                  className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium text-xs transition-colors"
                >
                  Import to Book
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
