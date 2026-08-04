import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useFileStore } from '../../store/useFileStore';
import { useBookStore } from '../../store/useBookStore';

export const FileUploadZone: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeBookId } = useBookStore();
  const { files, uploadFile, deleteFile, isProcessing } = useFileStore();
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeBookId) return;
    const fileList = Array.from(e.target.files);
    for (const f of fileList) {
      await uploadFile(f, activeBookId);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!e.dataTransfer.files || !activeBookId) return;
    const fileList = Array.from(e.dataTransfer.files);
    for (const f of fileList) {
      await uploadFile(f, activeBookId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Target */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.docx,.doc,.csv,.xlsx,.xls,.txt,.md,.jpg,.jpeg,.png,.tiff,.bmp"
          className="hidden"
        />
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 rounded-xl bg-slate-800 text-emerald-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-slate-200 text-sm">Drag & drop source documents</span>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports PDF, DOCX, Excel, CSV, Images (with OCR), Markdown & TXT
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            100% Local Browser Parsing
          </span>
        </div>
      </div>

      {/* Uploaded Files Status List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Indexed Source Files ({files.length})
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {files.map(f => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <File className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-medium text-slate-200 block truncate">{f.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {(f.size / 1024).toFixed(1)} KB • {f.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {f.isProcessing ? (
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing...</span>
                    </span>
                  ) : f.error ? (
                    <span className="flex items-center space-x-1 text-rose-400" title={f.error}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RAG Indexed</span>
                    </span>
                  )}

                  <button
                    onClick={() => deleteFile(f.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
