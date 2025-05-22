
import { useEffect } from 'react';

export const usePageTitle = (title: string, description?: string) => {
  useEffect(() => {
    // Update the document title
    document.title = title;
    
    // Update meta description if provided
    if (description) {
      // Look for existing meta description tag
      let metaDescription = document.querySelector('meta[name="description"]');
      
      // If it doesn't exist, create it
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      // Set the content attribute
      metaDescription.setAttribute('content', description);
      
      // Log for debugging
      console.log('Meta description set to:', description);
    }
    
    return () => {
      // Reset title on unmount
      document.title = 'Yontent Singapore';
      
      // Reset meta description to default on unmount
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Share reviews. Earn rewards. Get Recognised for Your Brand Love');
      }
    };
  }, [title, description]);
};
