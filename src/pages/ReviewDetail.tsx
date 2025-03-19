
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Heart, Eye, ChevronLeft, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { trackReviewView } from '@/services/reviewService';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      fetchReview();
      if (user) {
        checkIfUserLiked();
      }
    }
  }, [id, user]);
  
  const fetchReview = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          views_count,
          likes_count,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review');
        return;
      }
      
      // Transform the review to match our Review type
      const transformedReview: Review = {
        id: data.id,
        userId: data.user_id,
        productName: "Review", // Default value since column no longer exists
        rating: 5, // Default value since column no longer exists
        content: data.content,
        images: data.images || [],
        viewsCount: data.views_count,
        likesCount: data.likes_count,
        createdAt: new Date(data.created_at),
        user: data.profiles ? {
          id: data.profiles.id,
          username: data.profiles.username || 'Anonymous',
          email: '', // Not returned for privacy
          points: 0, // Not relevant in this context
          createdAt: new Date(), // Not relevant in this context
          avatar: data.profiles.avatar
        } : undefined
      };
      
      setReview(transformedReview);
      
      // Track the view
      trackReviewView(id);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const checkIfUserLiked = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('review_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('review_id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking if user liked review:', error);
        return;
      }
      
      setHasLiked(!!data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
  const nextImage = () => {
    if (!review) return;
    setCurrentImageIndex((current) => 
      current === review.images.length - 1 ? 0 : current + 1
    );
  };
  
  const prevImage = () => {
    if (!review) return;
    setCurrentImageIndex((current) => 
      current === 0 ? review.images.length - 1 : current - 1
    );
  };
  
  const handleLike = async () => {
    if (!user || !review) {
      if (!user) toast.error('Please login to like reviews');
      return;
    }
    
    try {
      setLikeLoading(true);
      
      if (hasLiked) {
        // Unlike
        const { error: deleteLikeError } = await supabase
          .from('review_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('review_id', review.id);
          
        if (deleteLikeError) {
          throw deleteLikeError;
        }
        
        // Update likes count
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: Math.max(0, (review.likesCount || 0) - 1) })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
        // Update local state
        setHasLiked(false);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: Math.max(0, (prev.likesCount || 0) - 1)
          };
        });
        
        toast.success('Review unliked');
      } else {
        // Like
        const { error: insertLikeError } = await supabase
          .from('review_likes')
          .insert([{ user_id: user.id, review_id: review.id }]);
          
        if (insertLikeError) {
          throw insertLikeError;
        }
        
        // Update likes count
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: (review.likesCount || 0) + 1 })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
        // Update local state
        setHasLiked(true);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: (prev.likesCount || 0) + 1
          };
        });
        
        toast.success('Review liked!');
      }
    } catch (error: any) {
      console.error('Error liking/unliking review:', error);
      toast.error('Failed to update like status');
    } finally {
      setLikeLoading(false);
    }
  };
  
  const navigateToUserProfile = () => {
    if (review?.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };

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
            {review.images.length > 0 && (
              <div className="relative h-96 bg-gray-100">
                <img 
                  src={review.images[currentImageIndex]} 
                  alt={`Review image ${currentImageIndex + 1}`} 
                  className="w-full h-full object-contain"
                />
                
                {/* Image nav buttons (only if more than 1 image) */}
                {review.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    {/* Image indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                      {currentImageIndex + 1} / {review.images.length}
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="p-6 md:p-8">
              {/* User and date info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={navigateToUserProfile}>
                  {review.user?.avatar ? (
                    <img 
                      src={review.user.avatar} 
                      alt={review.user.username} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-brand-teal" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium hover:underline">{review.user?.username || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(review.createdAt, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleLike} 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1"
                    disabled={likeLoading}
                  >
                    <Heart className={`h-4 w-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{review.likesCount || 0}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1.5" />
                  <span>{review.viewsCount || 0} views</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-gray-800">{review.content}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Review not found</h3>
            <p className="text-gray-600 mb-6">
              The review you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/reviews">
              <Button className="bg-brand-teal hover:bg-brand-teal/90">
                Back to Reviews
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
