
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const FollowersList = () => {
  const { username } = useParams<{ username: string }>();
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        
        // Get the profile ID for the username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();
          
        if (profileError) throw profileError;
        setProfileId(profileData.id);
        
        // Get followers - using a direct query instead of a join
        const { data, error } = await supabase
          .from('user_follows')
          .select('follower_id')
          .eq('following_id', profileData.id);
          
        if (error) throw error;
        
        if (data.length > 0) {
          // Fetch profiles for each follower_id
          const followerProfiles = await Promise.all(
            data.map(async (item) => {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, username, avatar')
                .eq('id', item.follower_id)
                .single();
                
              if (profileError) {
                console.error('Error fetching profile:', profileError);
                return null;
              }
              
              return profile;
            })
          );
          
          // Filter out null values and set followers
          setFollowers(followerProfiles.filter(Boolean));
        } else {
          setFollowers([]);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
        toast.error('Failed to load followers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowers();
  }, [username]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        {/* Back button - Using username for navigation */}
        <Link to={`/user/${username}`} className="flex items-center text-brand-teal mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {username}'s Profile
        </Link>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <h1 className="text-2xl font-bold mb-6 text-left">Followers of {username}</h1>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : followers.length === 0 ? (
            <div className="text-left py-8 text-gray-500">
              No followers yet
            </div>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <Link to={`/user/${follower.username}`} className="flex items-center gap-3 hover:text-brand-teal">
                    <Avatar>
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                        {follower.username[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{follower.username}</span>
                  </Link>
                  
                  {user && user.id !== follower.id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="ml-auto"
                      asChild
                    >
                      <Link to={`/user/${follower.username}`}>View Profile</Link>
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

export default FollowersList;
