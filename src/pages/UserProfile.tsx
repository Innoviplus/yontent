
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';
import ProfileNotFound from '@/components/user-profile/ProfileNotFound';
import ProfileSkeleton from '@/components/user-profile/ProfileSkeleton';
import { useUserProfile } from '@/hooks/useUserProfile';
import ReviewsGrid from '@/components/review/ReviewsGrid';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const {
    profile,
    reviews,
    loading,
    isFollowing,
    followLoading,
    handleFollow,
    user,
    isCurrentUser
  } = useUserProfile(username);

  // Prepare stats for UserStatsCard
  const userStats: UserStats = {
    reviewsCount: reviews.length,
    followersCount: profile?.followers_count || 0,
    followingCount: profile?.following_count || 0,
    pointsCount: profile?.points || 0
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
          <ProfileSkeleton />
        ) : profile ? (
          <>
            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              isCurrentUser={isCurrentUser}
              isFollowing={isFollowing}
              followLoading={followLoading}
              handleFollow={handleFollow}
              reviews={reviews}
            />

            {/* Stats & Reviews */}
            {isCurrentUser ? (
              <div className="hidden">
                {/* This intentionally left hidden to maintain existing code structure */}
              </div>
            ) : (
              <>
                <UserStatsCard
                  user={{
                    id: profile.id,
                    username: profile.username,
                    email: '',
                    points: profile.points || 0,
                    createdAt: new Date(profile.created_at),
                    avatar: profile.avatar
                  }}
                  stats={userStats}
                  className="mb-8"
                  isCurrentUser={false}
                />
                <div>
                  <h2 className="text-lg font-semibold mb-4">{profile.username}&apos;s Reviews</h2>
                  {reviews.length > 0 ? (
                    <ReviewsGrid reviews={reviews} />
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center shadow-card">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">
                        {profile.username} hasn&apos;t posted any reviews yet.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <ProfileNotFound />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
