
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  // Configure DOMPurify to allow style attributes
  const sanitizeConfig = {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  };
  
  // Ensure content is sanitized before rendering
  const sanitizedContent = content ? DOMPurify.sanitize(content, sanitizeConfig) : '';
  
  return (
    <div 
      className={`prose max-w-none whitespace-pre-wrap ${className}`} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
      style={{ wordBreak: 'break-word' }}
    />
  );
};

export default HTMLContent;
