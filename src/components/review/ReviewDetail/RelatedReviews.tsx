
import { Link } from 'react-router-dom';
import { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface RelatedReviewsProps {
  reviewId: string;
  relatedReviews: Review[];
}

const RelatedReviews = ({ reviewId, relatedReviews }: RelatedReviewsProps) => {
  if (!relatedReviews || relatedReviews.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Related Reviews</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {relatedReviews.slice(0, 5).map((review) => (
            <Link 
              key={review.id} 
              to={`/reviews/${review.id}`} 
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
            >
              {review.images && review.images.length > 0 ? (
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={review.images[0]} 
                    alt={review.productName || 'Product'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                  <div className="text-gray-400 text-xs">No image</div>
                </div>
              )}
              
              <div className="flex-1 overflow-hidden">
                <h4 className="font-medium truncate">
                  {review.productName || 'Review'}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {review.content}
                </p>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedReviews;
