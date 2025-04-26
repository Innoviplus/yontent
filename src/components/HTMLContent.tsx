
import { useSanitizedContent } from '@/hooks/useSanitizedContent';
import { useEffect } from 'react';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent = ({ content, className = '' }: HTMLContentProps) => {
  const sanitizedContent = useSanitizedContent(content);
  
  // Add the CSS styles for links to the document head instead of as a child
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .prose a {
        color: #39C494;  /* Brand Teal Green */
        text-decoration: underline;
        transition: color 0.3s ease;
      }
      .prose a:hover {
        color: #2DAB7E;  /* Darker Green on Hover */
      }
    `;
    
    // Add an id to identify this specific style
    styleElement.id = 'html-content-link-styles';
    
    // Check if the style already exists
    const existingStyle = document.getElementById('html-content-link-styles');
    if (!existingStyle) {
      // If not, append it to the head
      document.head.appendChild(styleElement);
    }
    
    // Clean up function to remove the style when the component unmounts
    return () => {
      // Only remove if no other HTMLContent components are still mounted
      // This is a simplistic approach; for more complex cases, a counter could be used
      const remainingComponents = document.querySelectorAll('.prose');
      if (remainingComponents.length <= 1) {
        const style = document.getElementById('html-content-link-styles');
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
