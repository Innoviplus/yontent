
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, ArrowLeft, MapPin, Users, Grid } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewCard from '@/components/ReviewCard';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Review } from '@/lib/types';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchUserProfile();
  }, [username]);
  
  const fetchUserProfile = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      setProfile(profileData);
      
      // Check if current user is following this profile
      if (user && profileData.id !== user.id) {
        const { data: followData } = await supabase
          .from('user_follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profileData.id)
          .single();
          
        setIsFollowing(!!followData);
      }
      
      // Fetch user's reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          views_count,
          likes_count,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        throw reviewsError;
      }
      
      // Transform reviews
      const transformedReviews: Review[] = reviewsData.map((review: any) => ({
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
          email: '', // Not returned for privacy
          points: 0, // Not relevant in this context
          createdAt: new Date(), // Not relevant in this context
          avatar: review.profiles.avatar
        } : undefined
      }));
      
      setReviews(transformedReviews);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFollow = async () => {
    if (!user || !profile) {
      toast.error('You must be logged in to follow users');
      return;
    }
    
    if (user.id === profile.id) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
          
        if (error) throw error;
        
        setIsFollowing(false);
        toast.success(`You unfollowed ${profile.username}`);
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert([
            { follower_id: user.id, following_id: profile.id }
          ]);
          
        if (error) throw error;
        
        setIsFollowing(true);
        toast.success(`You are now following ${profile.username}`);
      }
      
      // Refresh profile to get updated counts
      fetchUserProfile();
    } catch (error: any) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        {/* Back button */}
        <Link to="/reviews" className="flex items-center text-brand-teal mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : profile ? (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-xl overflow-hidden shadow-card mb-8">
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.username} className="w-24 h-24 object-cover" />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                  
                  {/* User info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                    
                    {profile.extended_data?.bio && (
                      <p className="text-gray-600 mt-2 mb-4">{profile.extended_data.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-4">
                      {profile.extended_data?.country && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span>{profile.extended_data.country}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
                      <div className="flex items-center">
                        <Grid className="h-4 w-4 mr-1.5 text-gray-600" />
                        <span><strong>{reviews.length}</strong> reviews</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5 text-gray-600" />
                        <span><strong>{profile.followers_count}</strong> followers</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5 text-gray-600" />
                        <span><strong>{profile.following_count}</strong> following</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Follow button - only show if not viewing own profile */}
                  {user && user.id !== profile.id && (
                    <Button 
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      disabled={followLoading}
                      className={isFollowing ? "" : "bg-brand-teal hover:bg-brand-teal/90"}
                    >
                      {followLoading ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                      ) : null}
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* User Content Tabs */}
            <Tabs defaultValue="reviews">
              <TabsList className="mb-6">
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews">
                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-card">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">
                      {user && user.id === profile.id
                        ? "You haven't posted any reviews yet. Start sharing your experiences!"
                        : `${profile.username} hasn't posted any reviews yet.`}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/reviews">
              <Button className="bg-brand-teal hover:bg-brand-teal/90">
                Back to Reviews
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
