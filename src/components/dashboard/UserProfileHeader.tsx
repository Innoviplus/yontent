
import { Link } from 'react-router-dom';
import { User, Settings, Copy } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { SocialMediaIcons } from '@/components/dashboard/SocialMediaIcons';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';
import { toast } from 'sonner';

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
  
  // Check if any social media URL contains actual content
  const hasSocialMediaContent = Object.entries({
    website_url: user?.website_url,
    facebook_url: user?.facebook_url,
    instagram_url: user?.instagram_url,
    youtube_url: user?.youtube_url,
    tiktok_url: user?.tiktok_url
  }).some(([_, value]) => value && value.trim().length > 0);

  // Generate profile URL
  const profileUrl = `${window.location.origin}/user/${user.username}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  console.log('User profile header:', { 
    bio, 
    hasSocialMedia: hasSocialMediaContent,
    socialLinks: {
      website: user?.website_url,
      facebook: user?.facebook_url,
      instagram: user?.instagram_url,
      youtube: user?.youtube_url,
      tiktok: user?.tiktok_url
    }
  });

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
          {bio && bio.trim() ? (
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

          {/* Profile URL Section */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Profile URL</p>
                <p className="text-sm font-mono text-gray-800 break-all">{profileUrl}</p>
              </div>
              <button
                onClick={handleCopyUrl}
                className="ml-4 p-2 text-gray-500 hover:text-brand-teal transition-colors"
                title="Copy URL"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* No UserStatsCard here - moved to dedicated component */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
