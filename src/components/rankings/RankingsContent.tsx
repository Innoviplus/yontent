
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RankingType, RankedUser } from './types';
import { User } from '@/lib/types';
import RankingsListSkeleton from './RankingsListSkeleton';
import RankingsList from './RankingsList';

interface RankingsContentProps {
  activeTab: RankingType;
}

const RankingsContent = ({ activeTab }: RankingsContentProps) => {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      
      try {
        let data: any[] = [];
        
        if (activeTab === 'points') {
          const { data: pointsData, error: pointsError } = await supabase
            .from('profiles')
            .select('id, username, points, avatar, created_at')
            .order('points', { ascending: false })
            .limit(20);
            
          if (pointsError) throw pointsError;
          data = pointsData;
        } 
        else if (activeTab === 'views') {
          const { data: viewsData, error: viewsError } = await supabase
            .from('reviews')
            .select(`
              user_id,
              views_count,
              profiles:user_id (id, username, points, avatar, created_at)
            `)
            .gte('created_at', new Date(new Date().setDate(1)).toISOString()) // Current month
            .order('views_count', { ascending: false })
            .limit(100);
            
          if (viewsError) throw viewsError;
          
          const userViews = viewsData.reduce((acc: Record<string, any>, review) => {
            const userId = review.user_id;
            if (!acc[userId]) {
              acc[userId] = {
                ...review.profiles,
                totalViews: 0
              };
            }
            acc[userId].totalViews += review.views_count || 0;
            return acc;
          }, {});
          
          data = Object.values(userViews)
            .sort((a: any, b: any) => b.totalViews - a.totalViews)
            .slice(0, 20);
        } 
        else if (activeTab === 'likes') {
          // Fix for the "By Likes" tab - query reviews table and aggregate likes by user
          const { data: likesData, error: likesError } = await supabase
            .from('reviews')
            .select(`
              user_id,
              likes_count,
              profiles:user_id (id, username, points, avatar, created_at)
            `)
            .gte('created_at', new Date(new Date().setDate(1)).toISOString()) // Current month
            .order('likes_count', { ascending: false })
            .limit(100);
            
          if (likesError) throw likesError;
          
          const userLikes = likesData.reduce((acc: Record<string, any>, review) => {
            const userId = review.user_id;
            if (!acc[userId]) {
              acc[userId] = {
                ...review.profiles,
                totalLikes: 0
              };
            }
            acc[userId].totalLikes += review.likes_count || 0;
            return acc;
          }, {});
          
          data = Object.values(userLikes)
            .sort((a: any, b: any) => b.totalLikes - a.totalLikes)
            .slice(0, 20);
        }
        
        const transformedUsers = data.map((item, index) => {
          const user: RankedUser = {
            id: item.id || '',
            username: item.username || 'Anonymous',
            email: '',
            points: item.points || 0,
            createdAt: new Date(item.created_at),
            avatar: item.avatar,
            rank: index + 1,
            stats: activeTab === 'points' 
              ? item.points 
              : activeTab === 'views' 
                ? item.totalViews 
                : item.totalLikes
          };
          return user;
        });
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, [activeTab]);
  
  if (loading) {
    return <RankingsListSkeleton />;
  }
  
  return <RankingsList users={users} activeTab={activeTab} />;
};

export default RankingsContent;
