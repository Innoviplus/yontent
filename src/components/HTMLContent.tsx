
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  // Ensure content is sanitized before rendering
  const sanitizedContent = content ? DOMPurify.sanitize(content) : '';
  
  return (
    <div 
      className={`prose max-w-none ${className}`} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default HTMLContent;
