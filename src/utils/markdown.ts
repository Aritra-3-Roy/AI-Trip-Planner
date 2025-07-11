
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const renderMarkdown = (markdown: string): string => {
  // Convert markdown to HTML
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  return sanitizedHtml;
};
