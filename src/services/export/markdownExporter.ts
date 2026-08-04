import { Book } from '../../types/book';

export function exportBookToMarkdown(book: Book): string {
  let output = `# ${book.title}\n\n`;
  if (book.metadata.subtitle) output += `*${book.metadata.subtitle}*\n\n`;
  output += `**Author:** ${book.metadata.author}\n`;
  if (book.metadata.organization) output += `**Organization:** ${book.metadata.organization}\n`;
  output += `**Date:** ${new Date(book.updatedAt).toLocaleDateString()}\n\n---\n\n`;

  for (const chapter of book.chapters) {
    output += `\n# ${chapter.title}\n\n`;
    output += chapter.content + '\n\n';
  }

  return output;
}

export function exportBookToHTML(book: Book): string {
  const md = exportBookToMarkdown(book);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${book.title}</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #222; }
    h1, h2, h3 { color: #1e3a2b; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f2f7f4; }
  </style>
</head>
<body>
  ${md.replace(/\n\n/g, '<br/><br/>').replace(/# (.*?)\n/g, '<h1>$1</h1>').replace(/## (.*?)\n/g, '<h2>$2</h2>')}
</body>
</html>`;
}
