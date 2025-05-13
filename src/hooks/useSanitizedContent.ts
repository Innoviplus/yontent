
// Fix the import of dompurify
import DOMPurify from 'dompurify';
import { sanitizerConfig } from '@/utils/sanitizerConfig';

export const useSanitizedContent = (content: string) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, sanitizerConfig);
  
  return {
    sanitizedContent
  };
};
