
import { Link } from 'react-router-dom';
import { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Eye, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/formatUtils';
import { memo } from 'react';

interface RelatedReviewsProps {
  reviewId: string;
  relatedReviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const RelatedReviews = memo(({ reviewId, relatedReviews }: RelatedReviewsProps) => {
  if (!relatedReviews || relatedReviews.length === 0) {
    return null;
  }
  
  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">You May Also Like</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {relatedReviews.slice(0, 5).map((review) => (
            <Link 
              key={review.id} 
              to={`/review/${review.id}`} 
              className="block hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-start gap-3 p-3">
                {review.images && review.images.length > 0 ? (
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={review.images[0]} 
                      alt="Review image" 
                      className="w-full h-full object-cover"
                      loading="lazy" // Add lazy loading
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                    <div className="text-gray-400 text-xs">No image</div>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden">
                  {/* Author with Avatar */}
                  <div className="flex items-center mb-1.5">
                    <Avatar className="h-5 w-5 mr-1.5">
                      <AvatarImage src={review.user?.avatar} alt={review.user?.username || 'User'} />
                      <AvatarFallback>
                        <User className="h-2.5 w-2.5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-700 font-medium truncate">
                      {review.user?.username || 'Anonymous'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
                    {stripHtml(review.content)}
                  </p>
                  
                  {/* Stats: Views and Likes */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-0.5" />
                      <span>{formatNumber(review.viewsCount || 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-0.5 text-red-500" />
                      <span>{formatNumber(review.likesCount || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

RelatedReviews.displayName = 'RelatedReviews';

export default RelatedReviews;
