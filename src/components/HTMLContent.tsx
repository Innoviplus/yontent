
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  // Configure DOMPurify to allow Quill's formatting tags and br tags
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'b', 'i', 'u', 'strong', 'em', 'strike', 'a', 'ul', 'ol', 'li',
      'blockquote', 'pre', 'code'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOWED_STYLES: [
      'color', 'background-color', 'text-align', 'font-size',
      'font-family', 'margin', 'padding', 'text-decoration'
    ]
  };
  
  // Process content to replace newlines with <br> tags
  // First check if it's already HTML content (contains tags)
  const isHTML = content?.includes('<') && content?.includes('>');
  
  // If it's plain text, replace newlines with <br> tags
  const processedContent = content && !isHTML 
    ? content.replace(/\n/g, '<br />') 
    : content || '';
  
  // Ensure content is sanitized before rendering
  const sanitizedContent = processedContent ? DOMPurify.sanitize(processedContent, sanitizeConfig) : '';
  
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default HTMLContent;
