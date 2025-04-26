
import { useSanitizedContent } from '@/hooks/useSanitizedContent';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  const sanitizedContent = useSanitizedContent(content);
  
  return (
    <div 
      className={`${className} prose`} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default HTMLContent;
