import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } from 'docx';
import { Book } from '../../types/book';

export async function exportBookToDOCX(book: Book): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      text: book.metadata.title || book.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
  ];

  if (book.metadata.subtitle) {
    children.push(
      new Paragraph({
        text: book.metadata.subtitle,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 400 },
      })
    );
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Author: `, bold: true }),
        new TextRun(book.metadata.author || 'Departmental Record'),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new PageBreak()]
    })
  );

  // Add chapters
  for (const chapter of book.chapters) {
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    const paragraphs = chapter.content.split(/\n\s*\n/);
    for (const p of paragraphs) {
      const clean = p.replace(/^#+\s*/, '').trim();
      if (clean) {
        children.push(
          new Paragraph({
            text: clean,
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
