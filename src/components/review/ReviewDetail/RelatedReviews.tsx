
import { Link } from 'react-router-dom';
import { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        <CardTitle className="text-lg">You May Also Like</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {relatedReviews.slice(0, 5).map((review) => (
            <Link 
              key={review.id} 
              to={`/review/${review.id}`} 
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors"
            >
              {review.images && review.images.length > 0 ? (
                <div className="w-16 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={review.images[0]} 
                    alt="Review image" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-24 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                  <div className="text-gray-400 text-xs">No image</div>
                </div>
              )}
              
              <div className="flex-1 overflow-hidden">
                {/* Author with Avatar */}
                <div className="flex items-center mb-2">
                  {review.user?.avatar ? (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={review.user.avatar} alt={review.user?.username || 'User'} />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {review.user?.username || 'Anonymous'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {review.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedReviews;
