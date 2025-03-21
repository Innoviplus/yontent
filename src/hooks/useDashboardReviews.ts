
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';

export const useDashboardReviews = (userId: string | undefined) => {
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [draftReviews, setDraftReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchReviews = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPublishedReviews(userId),
        fetchDraftReviews(userId)
      ]);
      setIsLoading(false);
    };
    
    fetchReviews();
  }, [userId]);

  const fetchPublishedReviews = async (userId: string) => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the Review type
      const transformedReviews: Review[] = (reviews || []).map(review => ({
        id: review.id,
        userId: review.user_id,
        content: review.content,
        images: review.images || [],
        createdAt: new Date(review.created_at),
        viewsCount: review.views_count,
        likesCount: review.likes_count
      }));

      setUserReviews(transformedReviews);
    } catch (error: any) {
      console.error('Error fetching user reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const fetchDraftReviews = async (userId: string) => {
    try {
      const { data: drafts, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'DRAFT')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the Review type
      const transformedDrafts: Review[] = (drafts || []).map(draft => ({
        id: draft.id,
        userId: draft.user_id,
        content: draft.content,
        images: draft.images || [],
        createdAt: new Date(draft.created_at),
        viewsCount: draft.views_count,
        likesCount: draft.likes_count
      }));

      setDraftReviews(transformedDrafts);
    } catch (error: any) {
      console.error('Error fetching draft reviews:', error);
      toast.error('Failed to load draft reviews.');
    }
  };

  return { userReviews, draftReviews, isLoading };
};
