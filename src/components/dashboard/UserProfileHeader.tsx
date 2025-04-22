
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { SocialMediaIcons } from '@/components/dashboard/SocialMediaIcons';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';

interface UserProfileHeaderProps {
  user: UserType & {
    completedReviews: number;
    completedMissions: number;
    extendedData?: any;
    followersCount?: number;
    followingCount?: number;
  };
}

const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  // Extract extended data for bio and social links
  const extendedData = user?.extendedData || {};
  const bio = extendedData?.bio || '';
  const hasSocialMedia = !!extendedData?.websiteUrl || !!extendedData?.facebookUrl ||
    !!extendedData?.instagramUrl || !!extendedData?.youtubeUrl ||
    !!extendedData?.tiktokUrl;

  // Prepare stats for UserStatsCard
  const userStats: UserStats = {
    reviewsCount: user.completedReviews,
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
    pointsCount: user.points
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in relative">
      {/* Settings icon on top right for mobile */}
      <div className="absolute right-4 top-4 sm:static sm:relative flex gap-2">
        <Link to="/settings" className="btn-outline py-2 px-3">
          <Settings className="h-5 w-5" />
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <User className="h-12 w-12" />
          )}
        </div>

        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          {/* Bio or prompt to add bio */}
          {bio ? (
            <p className="text-gray-600 mt-2 mb-4">{bio}</p>
          ) : (
            <Link
              to="/settings"
              className="block text-brand-teal font-medium mt-2 mb-4 hover:underline text-left sm:text-left"
              style={{ textAlign: 'left' }}
            >
              <span className="block sm:inline">
                Update your profile information to receive welcome reward points &gt;
              </span>
            </Link>
          )}

          {/* Social Media Icons */}
          {hasSocialMedia ? (
            <SocialMediaIcons extendedData={extendedData} className="mb-4" />
          ) : (
            <Link to="/settings" className="block text-brand-teal text-sm mb-4 hover:underline">
              Add your social media links
            </Link>
          )}

          <UserStatsCard user={user} stats={userStats} className="mt-6" isCurrentUser={true} />
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
