import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedDocumentData, DocumentChunk, DocumentTable } from '../../types/file';

// Setup pdf.js worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function parsePDF(file: Blob, filename: string): Promise<ExtractedDocumentData> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const headings: string[] = [];
  const chunks: DocumentChunk[] = [];
  const tables: DocumentTable[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item: any) => item.str).filter(Boolean);
    const pageText = pageStrings.join(' ');
    
    fullText += `\n--- Page ${i} ---\n` + pageText;

    // Detect headings (heuristic based on short uppercase or capitalized lines)
    const lines = pageText.split(/(?<=[.!?])\s+/);
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length > 3 && trimmed.length < 80 && /^[A-Z0-9\s:-]+$/.test(trimmed)) {
        headings.push(trimmed);
      }

      if (trimmed.length > 0) {
        chunks.push({
          id: `${filename}-p${i}-c${index}`,
          fileId: filename,
          fileName: filename,
          content: trimmed,
          type: trimmed.length < 60 && /^[A-Z]/.test(trimmed) ? 'heading' : 'paragraph',
          pageNumber: i,
        });
      }
    });
  }

  return {
    text: fullText,
    headings: Array.from(new Set(headings)),
    chunks,
    tables,
    images: [],
    metadata: {
      pageCount: pdf.numPages,
      wordCount: fullText.split(/\s+/).length,
    },
  };
}
