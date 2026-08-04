import Fuse from 'fuse.js';
import { db } from '../db/indexDB';
import { RAGChunkIndex, RAGQueryResult, Citation } from '../../types/rag';
import { ExtractedDocumentData } from '../../types/file';

export class RAGEngine {
  /**
   * Index document chunks into the IndexedDB RAG database
   */
  async indexDocument(bookId: string, fileId: string, fileName: string, data: ExtractedDocumentData): Promise<number> {
    // Clear old chunks for this file to avoid duplicate indexes
    await db.ragChunks.where({ bookId, fileId }).delete();

    const ragItems: RAGChunkIndex[] = data.chunks.map((chunk, idx) => {
      // Extract keywords for fast client-side searching
      const words = chunk.content.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
      const uniqueKeywords = Array.from(new Set(words));

      return {
        id: `${fileId}-rag-${idx}`,
        bookId,
        fileId,
        fileName,
        content: chunk.content,
        type: chunk.type,
        pageNumber: chunk.pageNumber,
        sheetName: chunk.sheetName,
        rowNumber: chunk.rowNumber,
        keywords: uniqueKeywords,
        createdAt: Date.now(),
      };
    });

    if (ragItems.length > 0) {
      await db.ragChunks.bulkAdd(ragItems);
    }

    return ragItems.length;
  }

  /**
   * Perform client-side RAG search over indexed document chunks
   */
  async searchKnowledgeBase(bookId: string, query: string, limit: number = 6): Promise<Citation[]> {
    const allChunks = await db.ragChunks.where('bookId').equals(bookId).toArray();

    if (allChunks.length === 0) {
      return [];
    }

    const fuse = new Fuse(allChunks, {
      keys: ['content', 'fileName', 'sheetName', 'keywords'],
      threshold: 0.4,
      includeScore: true,
    });

    const results = fuse.search(query, { limit });

    return results.map(res => ({
      fileId: res.item.fileId,
      fileName: res.item.fileName,
      pageNumber: res.item.pageNumber,
      sheetName: res.item.sheetName,
      rowNumber: res.item.rowNumber,
      snippet: res.item.content,
      score: 1 - (res.score || 0),
    }));
  }

  /**
   * Generate evidence-backed context string for LLM prompts with exact source citations
   */
  buildPromptContext(citations: Citation[]): string {
    return citations.map((c, i) => {
      let location = '';
      if (c.pageNumber) location += `Page ${c.pageNumber}`;
      if (c.sheetName) location += `Sheet: ${c.sheetName}`;
      if (c.rowNumber) location += `, Row ${c.rowNumber}`;
      
      return `[Citation ${i + 1} | Source: "${c.fileName}" ${location}]\n${c.snippet}`;
    }).join('\n\n');
  }
}

export const ragEngine = new RAGEngine();
