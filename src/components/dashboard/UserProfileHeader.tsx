
import { Link } from 'react-router-dom';
import { User, Settings, FileText, Users } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { SocialMediaIcons } from '@/components/dashboard/SocialMediaIcons';

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
  
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in">
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
            <Link to="/settings" className="block text-brand-teal font-medium mt-2 mb-4 hover:underline">
              Click here to fill in your profile &gt;
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
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3 text-center cursor-pointer">
              <div className="text-2xl font-semibold text-brand-slate">{user.completedReviews}</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
            <Link to={`/followers/${user.id}`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
              <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors">{user.followersCount || 0}</div>
              <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Followers</div>
            </Link>
            <Link to={`/following/${user.id}`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
              <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors">{user.followingCount || 0}</div>
              <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Following</div>
            </Link>
            <Link to="/redeem-points" className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
              <div className="flex items-center justify-center gap-1">
                <img 
                  src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
                  alt="Points" 
                  className="w-4 h-4"
                />
                <span className="text-2xl font-semibold text-brand-teal group-hover:text-brand-teal/80 transition-colors">{user.points}</span>
              </div>
              <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Points</div>
            </Link>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link to="/settings" className="btn-outline py-2 px-3">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
