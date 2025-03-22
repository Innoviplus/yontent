
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
  
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <User className="h-12 w-12" />
          )}
        </div>
        
        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          
          {/* Bio */}
          {bio && <p className="text-gray-600 mt-2 mb-4">{bio}</p>}
          
          {/* Social Media Icons */}
          <SocialMediaIcons extendedData={extendedData} className="mb-4" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-semibold text-brand-slate">{user.completedReviews}</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-semibold text-brand-slate">{user.followersCount || 0}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-semibold text-brand-slate">{user.followingCount || 0}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-semibold text-brand-slate">{user.points}</div>
              <div className="text-sm text-gray-500">Points</div>
            </div>
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
