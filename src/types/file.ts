export type FileType =
  | 'pdf'
  | 'docx'
  | 'doc'
  | 'odt'
  | 'txt'
  | 'rtf'
  | 'markdown'
  | 'csv'
  | 'excel'
  | 'image'
  | 'gdrive'
  | 'json';

export interface DocumentTable {
  id: string;
  title?: string;
  headers: string[];
  rows: string[][];
  sheetName?: string;
  pageNumber?: number;
}

export interface DocumentImage {
  id: string;
  caption?: string;
  dataUrl: string; // Base64
  pageNumber?: number;
  width?: number;
  height?: number;
}

export interface DocumentChunk {
  id: string;
  fileId: string;
  fileName: string;
  content: string;
  type: 'paragraph' | 'heading' | 'table' | 'image' | 'list';
  pageNumber?: number;
  sheetName?: string;
  rowNumber?: number;
  tableId?: string;
  metadata?: Record<string, any>;
}

export interface ExtractedDocumentData {
  text: string;
  headings: string[];
  chunks: DocumentChunk[];
  tables: DocumentTable[];
  images: DocumentImage[];
  metadata: {
    pageCount?: number;
    wordCount?: number;
    author?: string;
    creationDate?: string;
    sheets?: string[];
  };
}

export interface UploadedFile {
  id: string;
  bookId?: string;
  name: string;
  size: number;
  type: FileType;
  mimeType: string;
  rawBlob?: Blob;
  extractedData?: ExtractedDocumentData;
  source: 'upload' | 'gdrive' | 'clipboard';
  gdriveId?: string;
  gdriveModifiedTime?: string;
  isProcessing: boolean;
  error?: string;
  uploadedAt: number;
}
