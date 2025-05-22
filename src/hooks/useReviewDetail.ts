
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect, useRef, useState } from 'react';
import { usePageTitle } from './usePageTitle';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const initialLoadRef = useRef(false);
  const [pageTitle, setPageTitle] = useState('Yontent Singapore');
  const [pageDescription, setPageDescription] = useState('Share reviews. Earn rewards. Get Recognised for Your Brand Love');
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { navigateToUserProfile, relatedReviews } = useReviewNavigation(review);
  
  // Use the hook at the top level
  usePageTitle(pageTitle, pageDescription);
  
  // Set the page title and description based on review content
  useEffect(() => {
    if (review?.user?.username && review.content) {
      // Set title to "[username] | Yontent Singapore"
      const newPageTitle = `${review.user.username} | Yontent Singapore`;
      
      // Set description to first 150 characters of review content (strip HTML tags if any)
      const plainTextContent = review.content.replace(/<[^>]*>/g, '');
      const truncatedContent = plainTextContent.length > 150 
        ? plainTextContent.substring(0, 147) + '...'
        : plainTextContent;
      
      // Update the state to trigger usePageTitle
      setPageTitle(newPageTitle);
      setPageDescription(truncatedContent);
      
      // Update Open Graph tags for social sharing
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${review.user.username}'s Review | Yontent`);
      
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', truncatedContent);
    }
  }, [review]);
  
  // Only refresh data periodically to update data, but don't track view again
  useEffect(() => {
    if (!id || !review) return;
    
    // Skip the initial refresh since useFetchReview already fetched the data
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    // Disable periodic refreshes
    
    return () => {
      // Nothing to clean up
    };
  }, [id, review, refetchReview]);
  
  return {
    review,
    loading,
    navigateToUserProfile,
    relatedReviews,
    refetchReview: (skipViewTracking = false) => refetchReview(skipViewTracking)
  };
};
