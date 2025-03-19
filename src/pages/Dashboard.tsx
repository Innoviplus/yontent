
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { sampleUserData, sampleReviews, sampleMissions } from '@/data/sampleData';
import { Review, Mission } from '@/lib/types';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  
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
  
  // Fetch user's active missions
  const { isLoading: isLoadingMissions } = useQuery({
    queryKey: ['userMissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the missions this user is participating in
      const { data: participations, error: partError } = await supabase
        .from('mission_participations')
        .select('mission_id')
        .eq('user_id', user.id)
        .eq('status', 'IN_PROGRESS');
        
      if (partError) {
        console.error('Error fetching mission participations:', partError);
        return [];
      }
      
      if (participations.length === 0) {
        setMissions([]);
        return [];
      }
      
      // Then get the actual mission details
      const missionIds = participations.map(p => p.mission_id);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .in('id', missionIds);
        
      if (error) {
        console.error('Error fetching missions:', error);
        return [];
      }
      
      // Transform the data to match our Mission type
      const transformedMissions: Mission[] = data.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        pointsReward: mission.points_reward,
        type: mission.type as 'REVIEW' | 'RECEIPT',
        status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
        expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
        requirementDescription: mission.requirement_description,
        merchantName: mission.merchant_name,
        merchantLogo: mission.merchant_logo,
        bannerImage: mission.banner_image,
        maxSubmissionsPerUser: mission.max_submissions_per_user,
        termsConditions: mission.terms_conditions,
        startDate: new Date(mission.start_date),
        createdAt: new Date(mission.created_at),
        updatedAt: new Date(mission.updated_at)
      }));
      
      setMissions(transformedMissions);
      return transformedMissions;
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
            missions={missions.length > 0 ? missions : sampleMissions} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
