import mammoth from 'mammoth';
import { ExtractedDocumentData, DocumentChunk } from '../../types/file';

export async function parseDOCX(file: Blob, filename: string): Promise<ExtractedDocumentData> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Extract HTML and plain text using mammoth
  const rawTextResult = await mammoth.extractRawText({ arrayBuffer });
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

  const rawText = rawTextResult.value || '';
  const htmlContent = htmlResult.value || '';

  const headings: string[] = [];
  const chunks: DocumentChunk[] = [];

  const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  paragraphs.forEach((para, idx) => {
    const isHeading = para.length < 80 && (para.startsWith('Chapter') || para.startsWith('Section') || /^[0-9.]+\s+[A-Z]/.test(para));
    if (isHeading) {
      headings.push(para);
    }
    chunks.push({
      id: `${filename}-chunk-${idx}`,
      fileId: filename,
      fileName: filename,
      content: para,
      type: isHeading ? 'heading' : 'paragraph',
    });
  });

  return {
    text: rawText,
    headings: Array.from(new Set(headings)),
    chunks,
    tables: [],
    images: [],
    metadata: {
      wordCount: rawText.split(/\s+/).length,
    },
  };
}
