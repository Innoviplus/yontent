
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
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .prose a {
            color: #39C494;  /* Brand Teal Green */
            text-decoration: underline;
            transition: color 0.3s ease;
          }
          .prose a:hover {
            color: #2DAB7E;  /* Darker Green on Hover */
          }
        `
      }} />
    </div>
  );
};

export default HTMLContent;
