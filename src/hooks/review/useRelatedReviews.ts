
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRelatedReviews = (review: Review | null) => {
  const [relatedReviews, setRelatedReviews] = useState<Review[]>([]);
  
  const fetchRelatedReviews = async (reviewData: Review) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          videos,
          views_count,
          likes_count,
          created_at,
          profiles(
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
      
      if (error) {
        console.error('Error fetching related reviews:', error);
        toast.error('Failed to load related reviews');
        throw error;
      }
      
      if (!data) {
        setRelatedReviews([]);
        return;
      }
      
      const transformedReviews: Review[] = data.map(item => {
        const profile = item.profiles as any; // Cast to any to safely access properties
        
        return {
          id: item.id,
          userId: item.user_id,
          productName: "Review",
          rating: 5,
          content: item.content,
          images: item.images || [],
          videos: item.videos || [],
          viewsCount: item.views_count,
          likesCount: item.likes_count,
          createdAt: new Date(item.created_at),
          user: profile ? {
            id: profile.id || item.user_id,
            username: profile.username || 'Anonymous',
            email: '',
            points: profile.points || 0,
            createdAt: profile.created_at ? new Date(profile.created_at) : new Date(item.created_at),
            avatar: profile.avatar
          } : undefined
        };
      });
      
      setRelatedReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching related reviews:', error);
      // Don't show toast here as it's already handled above
    }
  };
  
  useEffect(() => {
    if (review) {
      fetchRelatedReviews(review);
    }
  }, [review]);
  
  return { relatedReviews };
};
