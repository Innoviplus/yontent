
import { useSanitizedContent } from '@/hooks/useSanitizedContent';
import { useEffect } from 'react';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  const sanitizedContent = useSanitizedContent(content);
  
  // Add the CSS styles for links and images to the document head
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .prose a {
        color: #39C494 !important;  /* Brand Teal Green with !important */
        text-decoration: underline;
        transition: color 0.3s ease;
      }
      .prose a:hover {
        color: #2DAB7E !important;  /* Darker Green on Hover with !important */
      }
      .prose img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
        display: block;
      }
      .prose p img {
        display: inline-block;
        vertical-align: middle;
      }
    `;
    
    // Add an id to identify this specific style
    styleElement.id = 'html-content-styles';
    
    // Check if the style already exists
    const existingStyle = document.getElementById('html-content-styles');
    if (!existingStyle) {
      // If not, append it to the head
      document.head.appendChild(styleElement);
    }
    
    // Clean up function to remove the style when the component unmounts
    return () => {
      const remainingComponents = document.querySelectorAll('.prose');
      if (remainingComponents.length <= 1) {
        const style = document.getElementById('html-content-styles');
        if (style) {
          document.head.removeChild(style);
        }
      }
    };
  }, []);
  
  return (
    <div 
      className={`${className} prose`} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HTMLContent;
