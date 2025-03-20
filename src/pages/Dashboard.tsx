
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { sampleUserData, sampleReviews, sampleMissions } from '@/data/sampleData';
import { Review } from '@/lib/types';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Fetch user's reviews
  const { isLoading: isLoadingReviews } = useQuery({
    queryKey: ['userReviews', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
      
      // Transform the data to match our Review type
      const transformedReviews: Review[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        content: review.content,
        images: review.images || [],
        viewsCount: review.views_count,
        likesCount: review.likes_count,
        createdAt: new Date(review.created_at),
        user: review.profiles ? {
          id: review.profiles.id,
          username: review.profiles.username || 'Anonymous',
          email: '',
          points: 0,
          createdAt: new Date(),
          avatar: review.profiles.avatar
        } : undefined
      }));
      
      setReviews(transformedReviews);
      return transformedReviews;
    },
    enabled: !!user
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* User profile header - use real user data if available */}
          <UserProfileHeader user={userProfile || sampleUserData} />
          
          {/* Quick actions */}
          <QuickActions />
          
          {/* Tabs for Reviews and Missions */}
          <DashboardTabs 
            reviews={reviews.length > 0 ? reviews : sampleReviews} 
            missions={sampleMissions} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
