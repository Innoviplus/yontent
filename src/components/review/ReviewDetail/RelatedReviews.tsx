
import { Link } from 'react-router-dom';
import { Review } from '@/lib/types';
import { formatTimeAgo } from '@/lib/formatUtils';
import { Eye } from 'lucide-react';

interface RelatedReviewsProps {
  reviewId: string;
  relatedReviews: Review[];
}

const RelatedReviews = ({ reviewId, relatedReviews }: RelatedReviewsProps) => {
  if (relatedReviews.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
      <h3 className="text-lg font-medium p-4 border-b">You May Also Like</h3>
      <div className="space-y-0">
        {relatedReviews.map((review) => (
          <Link 
            key={review.id} 
            to={`/review/${review.id}`} 
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="p-4 border-b last:border-b-0">
              <div className="flex gap-3">
                {review.images && review.images.length > 0 && (
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={review.images[0]} 
                      alt="Review thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium line-clamp-2">
                    {review.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{review.user?.username || 'Anonymous'}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimeAgo(review.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>{review.viewsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedReviews;
