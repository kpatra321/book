import { create } from 'zustand';
import { UploadedFile, FileType } from '../types/file';
import { db } from '../services/db/indexDB';
import { parseDocumentFile } from '../services/parsers/parserEngine';
import { ragEngine } from '../services/ai/ragEngine';

interface FileState {
  files: UploadedFile[];
  isProcessing: boolean;
  
  loadFiles: (bookId?: string) => Promise<void>;
  uploadFile: (file: File, bookId: string) => Promise<UploadedFile>;
  deleteFile: (fileId: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  isProcessing: false,

  loadFiles: async (bookId) => {
    let files: UploadedFile[];
    if (bookId) {
      files = await db.files.where('bookId').equals(bookId).toArray();
    } else {
      files = await db.files.toArray();
    }
    set({ files });
  },

  uploadFile: async (file: File, bookId: string) => {
    set({ isProcessing: true });
    
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: FileType = 'txt';
    if (extension === 'pdf') fileType = 'pdf';
    else if (['docx', 'doc', 'odt', 'rtf'].includes(extension)) fileType = 'docx';
    else if (['xlsx', 'xls', 'csv'].includes(extension)) fileType = 'excel';
    else if (['jpg', 'jpeg', 'png', 'tiff', 'bmp'].includes(extension)) fileType = 'image';
    else if (['md', 'markdown'].includes(extension)) fileType = 'markdown';

    const newFile: UploadedFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      bookId,
      name: file.name,
      size: file.size,
      type: fileType,
      mimeType: file.type,
      source: 'upload',
      isProcessing: true,
      uploadedAt: Date.now(),
    };

    await db.files.add(newFile);
    set(state => ({ files: [newFile, ...state.files] }));

    try {
      // Parse file client-side
      const extractedData = await parseDocumentFile(file, file.name, fileType);
      
      const updatedFile = {
        ...newFile,
        extractedData,
        isProcessing: false,
      };

      await db.files.put(updatedFile);

      // Index file chunks into RAG Knowledge Base
      await ragEngine.indexDocument(bookId, updatedFile.id, updatedFile.name, extractedData);

      set(state => ({
        files: state.files.map(f => f.id === newFile.id ? updatedFile : f),
        isProcessing: false,
      }));

      return updatedFile;
    } catch (err: any) {
      const errorFile = {
        ...newFile,
        isProcessing: false,
        error: err.message || 'Parsing failed',
      };
      await db.files.put(errorFile);
      set(state => ({
        files: state.files.map(f => f.id === newFile.id ? errorFile : f),
        isProcessing: false,
      }));
      return errorFile;
    }
  },

  deleteFile: async (fileId) => {
    await db.files.delete(fileId);
    await db.ragChunks.where('fileId').equals(fileId).delete();
    set(state => ({ files: state.files.filter(f => f.id !== fileId) }));
  },
}));
