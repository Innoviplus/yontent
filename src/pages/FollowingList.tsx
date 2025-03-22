
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const FollowingList = () => {
  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get the username of the profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', id)
          .single();
          
        if (profileError) throw profileError;
        setUsername(profileData.username);
        
        // Get following users
        const { data, error } = await supabase
          .from('user_follows')
          .select(`
            following_id,
            profiles:following_id (
              id,
              username,
              avatar
            )
          `)
          .eq('follower_id', id);
          
        if (error) throw error;
        
        const transformedFollowing = data.map((item: any) => ({
          id: item.profiles.id,
          username: item.profiles.username,
          avatar: item.profiles.avatar
        }));
        
        setFollowing(transformedFollowing);
      } catch (error) {
        console.error('Error fetching following users:', error);
        toast.error('Failed to load following users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowing();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        {/* Back button */}
        <Link to={`/user/${username}`} className="flex items-center text-brand-teal mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {username}'s Profile
        </Link>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <h1 className="text-2xl font-bold mb-6">Users {username} is Following</h1>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Not following anyone yet
            </div>
          ) : (
            <div className="space-y-4">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <Link to={`/user/${followedUser.username}`} className="flex items-center gap-3 hover:text-brand-teal">
                    <Avatar>
                      <AvatarImage src={followedUser.avatar} />
                      <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                        {followedUser.username[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{followedUser.username}</span>
                  </Link>
                  
                  {user && user.id !== followedUser.id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="ml-auto"
                    >
                      View Profile
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingList;
