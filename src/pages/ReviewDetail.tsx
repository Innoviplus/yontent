
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
import ReviewAuthorProfile from '@/components/review/ReviewDetail/ReviewAuthorProfile';
import RelatedReviews from '@/components/review/ReviewDetail/RelatedReviews';
import ReviewComments from '@/components/review/ReviewDetail/ReviewComments';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const {
    review,
    loading,
    likeLoading,
    hasLiked,
    handleLike,
    navigateToUserProfile,
    relatedReviews
  } = useReviewDetail(id);

  // Check if current user is the author of the review
  const isAuthor = user && review && user.id === review.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-16' : 'pt-28'} pb-16 max-w-5xl`}>
        {/* Back button */}
        <Link to="/reviews" className={`flex items-center text-brand-teal ${isMobile ? 'mb-3' : 'mb-6'} hover:underline`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>
        
        {loading ? (
          <div className="space-y-6">
            {/* Loading skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-8 w-1/3 mt-4" />
                <Skeleton className="h-6 w-1/4 mt-2" />
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div>
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl mt-6" />
              </div>
            </div>
          </div>
        ) : review ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content - left side (2/3 width on desktop) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-subtle">
                {/* Review images and videos */}
                <ReviewImages images={review.images} videos={review.videos} />
                
                <div className="p-4 md:p-8">
                  {/* User and date info */}
                  <div className="mb-4">
                    <ReviewUserInfo 
                      user={review.user} 
                      createdAt={review.createdAt} 
                      onUserClick={navigateToUserProfile} 
                    />
                  </div>
                  
                  {/* Stats and action buttons on the same row */}
                  <div className="flex items-center justify-between mb-4">
                    <ReviewStats viewsCount={review.viewsCount || 0} />
                    
                    {/* Action buttons with isAuthor prop */}
                    <ReviewActionButtons
                      likesCount={review.likesCount || 0}
                      hasLiked={hasLiked}
                      onLike={handleLike}
                      likeLoading={likeLoading}
                      isAuthor={isAuthor}
                      reviewId={review.id}
                    />
                  </div>
                  
                  {/* Content */}
                  <ReviewContent content={review.content} />
                </div>
              </div>
              
              {/* Comments section */}
              {id && <ReviewComments reviewId={id} />}
              
              {/* Author profile section */}
              {review.user && (
                <ReviewAuthorProfile userId={review.userId} />
              )}
            </div>
            
            {/* Sidebar - right side (1/3 width on desktop) */}
            <div className="space-y-6">
              {/* Related Reviews - moved to top right */}
              <RelatedReviews 
                reviewId={review.id} 
                relatedReviews={relatedReviews} 
              />
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
