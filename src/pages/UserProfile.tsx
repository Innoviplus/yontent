
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
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

            {/* Reviews Section - Always show for any user */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {isCurrentUser ? 'My Reviews' : `${profile.username}'s Reviews`}
              </h2>
              {reviews.length > 0 ? (
                <ReviewsGrid reviews={reviews} />
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-card">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">
                    {isCurrentUser 
                      ? "You haven't posted any reviews yet." 
                      : `${profile.username} hasn't posted any reviews yet.`}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ProfileNotFound />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
