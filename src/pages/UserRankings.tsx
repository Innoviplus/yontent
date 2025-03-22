
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Trophy, Eye, Heart, Award } from 'lucide-react';
import { format } from 'date-fns';

type RankingType = 'points' | 'views' | 'likes';

const UserRankings = () => {
  const [activeTab, setActiveTab] = useState<RankingType>('points');
  const [users, setUsers] = useState<(User & { rank: number, stats: number })[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      
      try {
        let data: any[] = [];
        
        if (activeTab === 'points') {
          // Fetch users with most points this month
          const { data: pointsData, error: pointsError } = await supabase
            .from('profiles')
            .select('id, username, points, avatar, created_at')
            .order('points', { ascending: false })
            .limit(20);
            
          if (pointsError) throw pointsError;
          data = pointsData;
        } 
        else if (activeTab === 'views') {
          // Fetch users with most views this month
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
          
          // Aggregate views by user
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
          // Fetch users with most likes this month
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
          
          // Aggregate likes by user
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
        
        // Transform data to User type with rank
        const transformedUsers = data.map((item, index) => {
          const user: User & { rank: number, stats: number } = {
            id: item.id || '',
            username: item.username || 'Anonymous',
            email: '', // Not needed for display
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
  
  const getRankingIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="text-yellow-500 h-5 w-5" />;
    } else if (rank === 2) {
      return <Trophy className="text-gray-400 h-5 w-5" />;
    } else if (rank === 3) {
      return <Trophy className="text-amber-700 h-5 w-5" />;
    }
    return <span className="text-gray-500 font-medium">{rank}</span>;
  };
  
  const getTabIcon = () => {
    switch (activeTab) {
      case 'points': 
        return <Award className="h-5 w-5 mr-2" />;
      case 'views': 
        return <Eye className="h-5 w-5 mr-2" />;
      case 'likes': 
        return <Heart className="h-5 w-5 mr-2" />;
    }
  };
  
  const getTabLabel = () => {
    switch (activeTab) {
      case 'points': 
        return 'Monthly Points';
      case 'views': 
        return 'Monthly Views';
      case 'likes': 
        return 'Monthly Likes';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Rankings</h1>
          <p className="text-lg text-gray-600">
            Top users ranked by monthly achievements.
          </p>
          
          <Tabs 
            defaultValue="points" 
            className="mt-6"
            onValueChange={(value) => setActiveTab(value as RankingType)}
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <div className="flex items-center mb-6">
                {getTabIcon()}
                <h2 className="text-xl font-semibold">
                  Top Users by {getTabLabel()} - {format(new Date(), 'MMMM yyyy')}
                </h2>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24 mt-2" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <Link 
                      key={user.id} 
                      to={`/user/${user.username}`}
                      className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 mr-4">
                        {getRankingIcon(user.rank)}
                      </div>
                      
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{user.username}</h3>
                        <p className="text-sm text-gray-500">
                          Joined {format(user.createdAt, 'MMM yyyy')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        {activeTab === 'points' ? (
                          <div className="flex items-center">
                            <img 
                              src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
                              alt="Points" 
                              className="w-4 h-4 mr-1"
                            />
                            <span className="font-medium">{user.stats}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-700">
                            {activeTab === 'views' ? (
                              <Eye className="h-4 w-4" /> 
                            ) : (
                              <Heart className="h-4 w-4" />
                            )}
                            <span className="font-medium">{user.stats}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserRankings;
