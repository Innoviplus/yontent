
import { useEffect, useRef } from 'react';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content || '';
    }
  }, [content]);

  return (
    <div className={`prose max-w-none ${className}`}>
      <div ref={contentRef}></div>
    </div>
  );
};

export default HTMLContent;
