
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import ProfileTabs from '@/components/user-profile/ProfileTabs';
import UserOwnStatsCard from '@/components/user-profile/UserOwnStatsCard';
import ProfileNotFound from '@/components/user-profile/ProfileNotFound';
import ProfileSkeleton from '@/components/user-profile/ProfileSkeleton';
import { useUserProfile } from '@/hooks/useUserProfile';

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
            {isCurrentUser ? (
              <UserOwnStatsCard
                user={profile}
                reviewsCount={reviews.length}
                followersCount={profile.followers_count || 0}
                followingCount={profile.following_count || 0}
                pointsCount={profile.points || 0}
              />
            ) : (
              <ProfileTabs
                reviews={reviews}
                user={user}
                profile={profile}
                isCurrentUser={isCurrentUser}
              />
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
