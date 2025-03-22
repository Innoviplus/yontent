
import { User, Calendar, MapPin, Users, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  profile: any;
  isCurrentUser: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  handleFollow: () => void;
  reviews: any[];
}

const ProfileHeader = ({
  profile,
  isCurrentUser,
  isFollowing,
  followLoading,
  handleFollow,
  reviews
}: ProfileHeaderProps) => {
  return (
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
              <Link to={`/followers/${profile.id}`} className="flex items-center hover:text-brand-teal">
                <Users className="h-4 w-4 mr-1.5 text-gray-600" />
                <span><strong>{profile.followers_count}</strong> followers</span>
              </Link>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-gray-600" />
                <span><strong>{profile.following_count}</strong> following</span>
              </div>
            </div>
          </div>
          
          {/* Follow button - only show if not viewing own profile */}
          {!isCurrentUser && (
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
  );
};

export default ProfileHeader;
