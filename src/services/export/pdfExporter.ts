import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Book } from '../../types/book';

export interface PDFExportOptions {
  pageSize?: 'A4' | 'Letter' | 'Legal';
  watermark?: string;
  showPageNumbers?: boolean;
  headerText?: string;
  footerText?: string;
}

export async function exportBookToPDF(book: Book, options: PDFExportOptions = {}): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Set page dimensions (default A4: 595.28 x 841.89 points)
  let width = 595.28;
  let height = 841.89;
  if (options.pageSize === 'Letter') {
    width = 612.0;
    height = 792.0;
  } else if (options.pageSize === 'Legal') {
    width = 612.0;
    height = 1008.0;
  }

  // Cover Page
  const coverPage = pdfDoc.addPage([width, height]);
  coverPage.drawText(book.metadata.title || book.title, {
    x: 50,
    y: height - 200,
    size: 28,
    font: boldFont,
    color: rgb(0.08, 0.27, 0.18),
  });

  if (book.metadata.subtitle) {
    coverPage.drawText(book.metadata.subtitle, {
      x: 50,
      y: height - 240,
      size: 16,
      font,
      color: rgb(0.3, 0.4, 0.35),
    });
  }

  coverPage.drawText(`Author: ${book.metadata.author || 'Departmental Record'}`, {
    x: 50,
    y: 120,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  if (book.metadata.organization) {
    coverPage.drawText(`Organization: ${book.metadata.organization}`, {
      x: 50,
      y: 100,
      size: 11,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Iterate chapters and add pages
  let pageNumber = 1;
  for (const chapter of book.chapters) {
    const page = pdfDoc.addPage([width, height]);
    pageNumber++;

    // Draw Header
    const header = options.headerText || book.title;
    page.drawText(header, {
      x: 50,
      y: height - 35,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Draw Chapter Title
    page.drawText(chapter.title, {
      x: 50,
      y: height - 80,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.27, 0.18),
    });

    // Draw Chapter Content (simplified wrapped lines)
    const cleanText = chapter.content.replace(/#+/g, '').replace(/\*+/g, '');
    const lines = wrapText(cleanText, 70);
    let y = height - 120;

    for (const line of lines.slice(0, 35)) {
      page.drawText(line, {
        x: 50,
        y,
        size: 10,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= 16;
      if (y < 60) break;
    }

    // Draw Footer / Page Number
    if (options.showPageNumbers !== false) {
      page.drawText(`Page ${pageNumber}`, {
        x: width / 2 - 20,
        y: 30,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // Draw Watermark if specified
    if (options.watermark) {
      page.drawText(options.watermark, {
        x: width / 4,
        y: height / 2,
        size: 36,
        font: boldFont,
        color: rgb(0.9, 0.9, 0.9),
        rotate: { angle: 45, type: 'degrees' } as any,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
