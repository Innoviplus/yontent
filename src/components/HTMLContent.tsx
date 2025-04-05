
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  // Basic sanitization configuration
  const sanitizeConfig = {
    ALLOWED_TAGS: ['p', 'br', 'div'],
    ALLOWED_ATTR: ['class'],
  };
  
  // Ensure content is sanitized before rendering
  const sanitizedContent = content ? DOMPurify.sanitize(content, sanitizeConfig) : '';
  
  // Format text - replace line breaks with <br> tags for simple formatting
  const formattedContent = sanitizedContent
    .replace(/\n/g, '<br>');
  
  return (
    <div 
      className={`whitespace-pre-wrap ${className}`} 
      dangerouslySetInnerHTML={{ __html: formattedContent }} 
      style={{ wordBreak: 'break-word' }}
    />
  );
};

export default HTMLContent;
