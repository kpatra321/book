import { Book } from '../../types/book';
import { exportBookToPDF, PDFExportOptions } from './pdfExporter';
import { exportBookToDOCX } from './docxExporter';
import { exportBookTablesToSpreadsheet } from './excelExporter';
import { exportBookToMarkdown, exportBookToHTML } from './markdownExporter';

export type ExportFormat = 'pdf' | 'docx' | 'xlsx' | 'html' | 'markdown' | 'txt' | 'json';

export async function exportBook(book: Book, format: ExportFormat, options?: PDFExportOptions): Promise<{ blob: Blob; filename: string }> {
  const sanitize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const baseName = sanitize(book.title || 'book');

  switch (format) {
    case 'pdf': {
      const blob = await exportBookToPDF(book, options);
      return { blob, filename: `${baseName}.pdf` };
    }
    case 'docx': {
      const blob = await exportBookToDOCX(book);
      return { blob, filename: `${baseName}.docx` };
    }
    case 'xlsx': {
      const blob = await exportBookTablesToSpreadsheet(book);
      return { blob, filename: `${baseName}_tables.xlsx` };
    }
    case 'html': {
      const htmlStr = exportBookToHTML(book);
      const blob = new Blob([htmlStr], { type: 'text/html' });
      return { blob, filename: `${baseName}.html` };
    }
    case 'markdown': {
      const mdStr = exportBookToMarkdown(book);
      const blob = new Blob([mdStr], { type: 'text/markdown' });
      return { blob, filename: `${baseName}.md` };
    }
    case 'txt': {
      const mdStr = exportBookToMarkdown(book);
      const blob = new Blob([mdStr], { type: 'text/plain' });
      return { blob, filename: `${baseName}.txt` };
    }
    case 'json': {
      const jsonStr = JSON.stringify(book, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      return { blob, filename: `${baseName}.json` };
    }
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
