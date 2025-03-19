
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviewDetail } from '@/hooks/useReviewDetail';
import ReviewImages from '@/components/review/ReviewDetail/ReviewImages';
import ReviewUserInfo from '@/components/review/ReviewDetail/ReviewUserInfo';
import ReviewActionButtons from '@/components/review/ReviewDetail/ReviewActionButtons';
import ReviewStats from '@/components/review/ReviewDetail/ReviewStats';
import ReviewContent from '@/components/review/ReviewDetail/ReviewContent';
import ReviewNotFound from '@/components/review/ReviewDetail/ReviewNotFound';

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    review,
    loading,
    likeLoading,
    hasLiked,
    handleLike,
    navigateToUserProfile
  } = useReviewDetail(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        {/* Back button */}
        <Link to="/reviews" className="flex items-center text-brand-teal mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>
        
        {loading ? (
          <div className="space-y-6">
            {/* Loading skeletons */}
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : review ? (
          <div className="bg-white rounded-xl overflow-hidden shadow-subtle">
            {/* Review images */}
            <ReviewImages images={review.images} />
            
            <div className="p-6 md:p-8">
              {/* User and date info */}
              <div className="flex items-center justify-between mb-6">
                <ReviewUserInfo 
                  user={review.user} 
                  createdAt={review.createdAt} 
                  onUserClick={navigateToUserProfile} 
                />
                
                {/* Action buttons */}
                <ReviewActionButtons
                  likesCount={review.likesCount || 0}
                  hasLiked={hasLiked}
                  onLike={handleLike}
                  likeLoading={likeLoading}
                />
              </div>
              
              {/* Stats */}
              <ReviewStats viewsCount={review.viewsCount || 0} />
              
              {/* Content */}
              <ReviewContent content={review.content} />
            </div>
          </div>
        ) : (
          <ReviewNotFound />
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
