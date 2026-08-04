import React, { useState } from 'react';
import { Download, FileText, Table, Code, FileSpreadsheet, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useBookStore } from '../../store/useBookStore';
import { exportBook, ExportFormat } from '../../services/export/exportEngine';
import saveAs from 'file-saver';

interface ExportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportCenterModal: React.FC<ExportCenterModalProps> = ({ isOpen, onClose }) => {
  const { activeBookId, books } = useBookStore();
  const activeBook = books.find(b => b.id === activeBookId);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [watermark, setWatermark] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!activeBook) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await exportBook(activeBook, selectedFormat, {
        pageSize,
        watermark: watermark.trim() || undefined,
        showPageNumbers: true,
      });
      saveAs(blob, filename);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const formats: { id: ExportFormat; label: string; icon: any; desc: string }[] = [
    { id: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Professional CMYK ready PDF with TOC & Page Numbers' },
    { id: 'docx', label: 'Microsoft Word (DOCX)', icon: FileText, desc: 'Editable Word file with headers, footers & tables' },
    { id: 'xlsx', label: 'Excel Workbook (XLSX)', icon: FileSpreadsheet, desc: 'Extracted book tables & plantation data registers' },
    { id: 'html', label: 'Web Page (HTML)', icon: Code, desc: 'Standalone HTML document with embedded CSS' },
    { id: 'markdown', label: 'Markdown (.md)', icon: FileText, desc: 'Clean Markdown for GitHub or static site generators' },
    { id: 'txt', label: 'Plain Text (.txt)', icon: FileText, desc: 'Unformatted plain text book export' },
    { id: 'json', label: 'JSON Data (.json)', icon: Code, desc: 'Complete book metadata & structure JSON' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Center" maxWidth="xl">
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Export Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formats.map(fmt => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-slate-100 font-semibold text-sm">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{fmt.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{fmt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Specific Options */}
        {selectedFormat === 'pdf' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">PDF Options</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="Letter">US Letter</option>
                  <option value="Legal">US Legal</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Watermark (Optional)</label>
                <input
                  type="text"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  placeholder="e.g. DRAFT or CONFIDENTIAL"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 disabled:opacity-50 transition-all"
          >
            {success ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Exported Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating File...' : `Export ${selectedFormat.toUpperCase()}`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
