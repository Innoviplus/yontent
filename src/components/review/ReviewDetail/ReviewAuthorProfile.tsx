
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User as UserType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';

interface ReviewAuthorProfileProps {
  userId: string;
}

const ReviewAuthorProfile = ({ userId }: ReviewAuthorProfileProps) => {
  const [author, setAuthor] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    pointsCount: 0
  });

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, followers_count, following_count')
          .eq('id', userId)
          .single();
          
        if (profileError) throw profileError;
        
        // Transform to User type
        const userProfile: UserType = {
          id: profileData.id,
          username: profileData.username || 'Anonymous',
          email: '', // Add the required email property even though it's not in profile data
          avatar: profileData.avatar,
          points: profileData.points || 0,
          createdAt: new Date(profileData.created_at),
        };
        
        setAuthor(userProfile);
        
        // Fetch stats (reviews count)
        const { count: reviewsCount, error: reviewsError } = await supabase
          .from('reviews')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (reviewsError) throw reviewsError;
        
        // Use the actual follower and following counts from the database
        setStats({
          reviewsCount: reviewsCount || 0,
          followersCount: profileData.followers_count || 0,
          followingCount: profileData.following_count || 0,
          pointsCount: profileData.points || 0
        });
      } catch (error) {
        console.error('Error fetching author profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorProfile();
  }, [userId]);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!author) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={author.avatar} alt={author.username} />
            <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
              {author.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{author.username}</h3>
            <UserStatsCard user={author} stats={stats} variant="compact" />
          </div>
          
          <Button asChild variant="outline" size="sm" className="self-start">
            <Link to={`/user/${author.username}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewAuthorProfile;
