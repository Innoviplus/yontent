
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review } from '@/lib/types';

export const fetchReviews = async (sortBy: string, userId?: string): Promise<Review[]> => {
  try {
    let query = supabase
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
        profiles:user_id (
          id,
          username,
          avatar
        )
      `)
      .eq('status', 'PUBLISHED'); // Only fetch PUBLISHED reviews

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'relevant' && userId) {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to load reviews');
    }
    
    const transformedReviews: Review[] = data.map(review => ({
      id: review.id,
      userId: review.user_id,
      productName: "Review",
      rating: 5,
      content: review.content,
      images: review.images || [],
      videos: review.videos || [],
      viewsCount: review.views_count || 0, // Ensure it's never undefined
      likesCount: review.likes_count || 0, // Ensure it's never undefined
      createdAt: new Date(review.created_at),
      user: review.profiles ? {
        id: review.profiles.id || review.user_id,
        username: review.profiles.username || 'Anonymous',
        email: '',
        points: 0,
        createdAt: new Date(),
        avatar: review.profiles.avatar
      } : undefined
    }));
    
    return transformedReviews;
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};

// Track viewed reviews in session storage to avoid counting multiple views
const viewedReviews = new Set<string>(); 

export const trackReviewView = async (reviewId: string) => {
  try {
    // Only count a view once per session for each review
    if (viewedReviews.has(reviewId)) {
      return;
    }
    
    // Add to viewed reviews set
    viewedReviews.add(reviewId);
    
    const { error } = await supabase.rpc('increment_view_count', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking review view:', error);
    }
  } catch (error) {
    console.error('Unexpected error tracking view:', error);
  }
};

export const submitReview = async ({ 
  userId, 
  content, 
  images,
  videos, // Added videos parameter
  isDraft = false 
}: { 
  userId: string; 
  content: string; 
  images: File[];
  videos?: File | null; // Added videos parameter
  isDraft?: boolean;
}) => {
  try {
    // Upload images
    const imageUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the image to the review-images bucket
      const { error: uploadError, data } = await supabase
        .storage
        .from('review-images')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Get the public URL of the uploaded image
      const { data: publicURL } = supabase
        .storage
        .from('review-images')
        .getPublicUrl(filePath);
        
      if (publicURL) {
        imageUrls.push(publicURL.publicUrl);
      }
    }
    
    // Upload video if provided
    const videoUrls: string[] = [];
    
    if (videos) {
      const fileExt = videos.name.split('.').pop();
      const fileName = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload the video to the review-videos bucket
      const { error: uploadError } = await supabase
        .storage
        .from('review-videos')
        .upload(fileName, videos, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        throw new Error(`Failed to upload video: ${uploadError.message}`);
      }
      
      // Get the public URL of the uploaded video
      const { data: publicURL } = supabase
        .storage
        .from('review-videos')
        .getPublicUrl(fileName);
        
      if (publicURL) {
        videoUrls.push(publicURL.publicUrl);
      }
    }
    
    // Insert review
    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        content,
        images: imageUrls,
        videos: videoUrls,
        views_count: 0,
        likes_count: 0,
        status: isDraft ? 'DRAFT' : 'PUBLISHED'
      });
      
    if (insertError) {
      console.error('Error creating review:', insertError);
      throw new Error(`Failed to create review: ${insertError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to submit review');
    }
    throw error;
  }
};
