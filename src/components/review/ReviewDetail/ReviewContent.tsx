
import { useEffect, useRef } from 'react';

interface ReviewContentProps {
  content: string;
}

const ReviewContent = ({ content }: ReviewContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="prose max-w-none">
      <div ref={contentRef} className="text-gray-800"></div>
    </div>
  );
};

export default ReviewContent;
