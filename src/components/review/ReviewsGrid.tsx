
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewsGridProps {
  reviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const ReviewsGrid = memo(({ reviews }: ReviewsGridProps) => {
  const navigate = useNavigate();
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Only set reviews when the data is available
  useEffect(() => {
    if (reviews.length > 0) {
      setLoadedReviews(reviews);
      setIsLoading(false);
    }
  }, [reviews]);

  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
    navigate(`/review/${reviewId}`);
  };

  // Initialize and clean up the masonry layout
  useEffect(() => {
    // Clean up any existing observer
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Set up the masonry layout with ResizeObserver after reviews are loaded
  useEffect(() => {
    if (isLoading || !gridRef.current) return;

    const initMasonry = () => {
      const grid = gridRef.current;
      if (!grid) return;

      // Calculate column width based on viewport
      const columns = window.innerWidth < 640 ? 2 : 
                     window.innerWidth < 768 ? 3 : 
                     window.innerWidth < 1024 ? 4 : 5;
      
      const items = Array.from(grid.children) as HTMLElement[];
      const columnHeights = Array(columns).fill(0);
      
      // Position each item
      items.forEach((item) => {
        // Find the shortest column
        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
        const x = `${(shortestColumn / columns) * 100}%`;
        const y = `${columnHeights[shortestColumn]}px`;
        
        // Set the position
        item.style.position = 'absolute';
        item.style.left = x;
        item.style.top = y;
        item.style.width = `${100 / columns}%`;
        item.style.padding = '0 6px';
        
        // Update the column height
        columnHeights[shortestColumn] += item.offsetHeight + 12; // 12px for gap
      });
      
      // Set the grid height to the tallest column
      grid.style.height = `${Math.max(...columnHeights)}px`;
    };
    
    // Initial layout
    initMasonry();
    
    // Create resize observer
    resizeObserverRef.current = new ResizeObserver(() => {
      requestAnimationFrame(initMasonry);
    });
    
    // Observe the grid and all its children
    if (gridRef.current) {
      resizeObserverRef.current.observe(gridRef.current);
      
      Array.from(gridRef.current.children).forEach(child => {
        resizeObserverRef.current?.observe(child);
      });
    }
    
    // Also add window resize listener
    window.addEventListener('resize', initMasonry);
    
    // Clean up
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', initMasonry);
    };
  }, [isLoading, loadedReviews]);

  // Render loading skeleton when no reviews are available
  if (isLoading && reviews.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="mb-3">
            <Skeleton className="h-40 rounded-lg mb-2" />
            <Skeleton className="h-4 rounded mb-2 w-3/4" />
            <Skeleton className="h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="masonry-container"
    >
      {loadedReviews.map((review) => (
        <div 
          key={review.id} 
          className="masonry-item"
          onClick={() => handleReviewClick(review.id)}
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
