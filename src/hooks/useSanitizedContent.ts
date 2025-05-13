
import DOMPurify from 'dompurify';
import { sanitizerConfig } from '@/utils/sanitizerConfig';

export const useSanitizedContent = (content: string | undefined) => {
  if (!content) return '';
  return DOMPurify.sanitize(content, sanitizerConfig);
};
