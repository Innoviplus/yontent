
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

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
  
  useEffect(() => {
    if (review) {
      fetchRelatedReviews(review);
    }
  }, [review]);
  
  return { relatedReviews };
};
