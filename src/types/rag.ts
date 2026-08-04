export interface Citation {
  fileId: string;
  fileName: string;
  pageNumber?: number;
  sheetName?: string;
  rowNumber?: number;
  snippet: string;
  score: number;
}

export interface RAGQueryResult {
  answer: string;
  citations: Citation[];
  usedChunks: number;
  query: string;
}

export interface RAGChunkIndex {
  id: string;
  bookId: string;
  fileId: string;
  fileName: string;
  content: string;
  type: string;
  pageNumber?: number;
  sheetName?: string;
  rowNumber?: number;
  tableNumber?: number;
  imageNumber?: number;
  chapterId?: string;
  keywords: string[];
  createdAt: number;
}
