
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { SocialMediaIcons } from '@/components/dashboard/SocialMediaIcons';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';

interface UserProfileHeaderProps {
  user: UserType & {
    completedReviews: number;
    completedMissions: number;
    first_name?: string;
    last_name?: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
    website_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    tiktok_url?: string;
  };
}

const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  // Extract profile data
  const bio = user?.bio || '';
  const hasSocialMedia = !!user?.website_url || !!user?.facebook_url ||
    !!user?.instagram_url || !!user?.youtube_url ||
    !!user?.tiktok_url;

  // Check if any social media URL contains actual content
  const hasSocialMediaContent = hasSocialMedia && Object.entries({
    website_url: user?.website_url,
    facebook_url: user?.facebook_url,
    instagram_url: user?.instagram_url,
    youtube_url: user?.youtube_url,
    tiktok_url: user?.tiktok_url
  }).some(([_, value]) => value && value.trim().length > 0);

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in relative">
      {/* Settings icon on top right */}
      <div className="absolute right-4 top-4">
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
          {/* Bio or prompt to add bio - text aligned left */}
          {bio ? (
            <p className="text-gray-600 mt-2 mb-4 text-left">{bio}</p>
          ) : (
            <Link
              to="/settings"
              className="block text-brand-teal font-medium mt-2 mb-4 hover:underline text-left"
            >
              Update your profile information to receive welcome reward points &gt;
            </Link>
          )}

          {/* Social Media Icons */}
          {hasSocialMediaContent ? (
            <SocialMediaIcons user={user} className="mb-4" />
          ) : (
            <Link to="/settings" className="block text-brand-teal text-sm mb-4 hover:underline text-left">
              Add your social media links
            </Link>
          )}

          {/* No UserStatsCard here - moved to dedicated component */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
