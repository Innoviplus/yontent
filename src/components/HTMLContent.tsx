
import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && content) {
      // Sanitize the HTML content to prevent XSS attacks
      const sanitizedContent = DOMPurify.sanitize(content);
      contentRef.current.innerHTML = sanitizedContent;
    }
  }, [content]);

  return (
    <div className={`prose max-w-none ${className}`}>
      <div ref={contentRef}></div>
    </div>
  );
};

export default HTMLContent;
