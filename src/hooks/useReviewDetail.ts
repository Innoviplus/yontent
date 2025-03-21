import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { trackReviewView } from '@/services/reviewService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useReviewDetail = (id: string | undefined) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [relatedReviews, setRelatedReviews] = useState<Review[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
      
      const transformedReview: Review = {
        id: data.id,
        userId: data.user_id,
        productName: "Review",
        rating: 5,
        content: data.content,
        images: data.images || [],
        viewsCount: data.views_count,
        likesCount: data.likes_count,
        createdAt: new Date(data.created_at),
        user: data.profiles ? {
          id: data.profiles.id,
          username: data.profiles.username || 'Anonymous',
          email: '',
          points: 0,
          createdAt: new Date(),
          avatar: data.profiles.avatar
        } : undefined
      };
      
      setReview(transformedReview);
      
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
  
  const handleLike = async () => {
    if (!user || !review) {
      if (!user) toast.error('Please login to like reviews');
      return;
    }
    
    try {
      setLikeLoading(true);
      
      if (hasLiked) {
        const { error: deleteLikeError } = await supabase
          .from('review_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('review_id', review.id);
          
        if (deleteLikeError) {
          throw deleteLikeError;
        }
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: Math.max(0, (review.likesCount || 0) - 1) })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
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
        const { error: insertLikeError } = await supabase
          .from('review_likes')
          .insert([{ user_id: user.id, review_id: review.id }]);
          
        if (insertLikeError) {
          throw insertLikeError;
        }
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: (review.likesCount || 0) + 1 })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
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
  
  const fetchRelatedReviews = async (reviewData: Review) => {
    try {
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
            avatar,
            points,
            created_at
          )
        `)
        .neq('id', reviewData.id)
        .order('likes_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const transformedReviews: Review[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        productName: "Review",
        rating: 5,
        content: item.content,
        images: item.images || [],
        viewsCount: item.views_count,
        likesCount: item.likes_count,
        createdAt: new Date(item.created_at),
        user: item.profiles ? {
          id: item.profiles.id,
          username: item.profiles.username || 'Anonymous',
          email: '',
          points: item.profiles.points || 0,
          createdAt: new Date(item.profiles.created_at),
          avatar: item.profiles.avatar
        } : undefined
      }));
      
      setRelatedReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching related reviews:', error);
    }
  };
  
  const navigateToUserProfile = () => {
    if (review?.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchReview();
      if (user) {
        checkIfUserLiked();
      }
    }
  }, [id, user]);
  
  useEffect(() => {
    if (review) {
      fetchRelatedReviews(review);
    }
  }, [review]);
  
  return {
    review,
    loading,
    likeLoading,
    hasLiked,
    handleLike,
    navigateToUserProfile,
    relatedReviews
  };
};
