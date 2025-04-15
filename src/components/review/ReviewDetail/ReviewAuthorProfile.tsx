
import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { User as UserType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatNumber } from '@/lib/formatUtils';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewAuthorProfileProps {
  userId: string;
}

const ReviewAuthorProfile = memo(({ userId }: ReviewAuthorProfileProps) => {
  const [author, setAuthor] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar, followers_count, following_count, created_at')
          .eq('id', userId)
          .single();
          
        if (profileError) throw profileError;
        
        console.log('Author profile data:', profileData);
        
        // Transform to User type
        const userProfile: UserType = {
          id: profileData.id,
          username: profileData.username || 'Anonymous',
          email: '', // Add the required email property
          avatar: profileData.avatar,
          points: 0,
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
          followingCount: profileData.following_count || 0
        });
      } catch (error) {
        console.error('Error fetching author profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorProfile();
  }, [userId, user]);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
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
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/user/${author.username}`} className="flex-shrink-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={author.avatar} alt={author.username} />
              <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                {author.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div>
            <Link to={`/user/${author.username}`}>
              <h3 className="text-lg font-semibold hover:text-brand-teal transition-colors">{author.username}</h3>
            </Link>
          </div>
        </div>
        
        {/* Stats grid with only reviews, followers, following */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Link to={`/user/${author.username}`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="text-lg font-semibold text-brand-slate hover:text-brand-teal transition-colors">
              {formatNumber(stats.reviewsCount)}
            </div>
            <div className="text-xs text-gray-500">posts</div>
          </Link>
          
          <Link to={`/user/${author.username}/followers`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="text-lg font-semibold text-brand-slate hover:text-brand-teal transition-colors">
              {formatNumber(stats.followersCount)}
            </div>
            <div className="text-xs text-gray-500">followers</div>
          </Link>
          
          <Link to={`/user/${author.username}/following`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
            <div className="text-lg font-semibold text-brand-slate hover:text-brand-teal transition-colors">
              {formatNumber(stats.followingCount)}
            </div>
            <div className="text-xs text-gray-500">following</div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

ReviewAuthorProfile.displayName = 'ReviewAuthorProfile';

export default ReviewAuthorProfile;
