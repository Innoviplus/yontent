
import { useNavigate } from "react-router-dom";
import { User as UserType } from '@/lib/types';
import { Book, Award, Star, Users, ArrowRight, Coins } from "lucide-react";

interface UserOwnStatsCardProps {
  user: UserType;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
  pointsCount: number;
}

const iconClass = "w-5 h-5 mr-1 text-brand-teal inline-block align-middle";

const UserOwnStatsCard = ({
  user,
  reviewsCount,
  followersCount,
  followingCount,
  pointsCount,
}: UserOwnStatsCardProps) => {
  const navigate = useNavigate();

  // Layout: 2 rows x 3 columns grid for mobile, 3x2 or 6-in-row for larger
  return (
    <div className="bg-white rounded-xl shadow-card p-4 mt-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-2">
        {/* Reviews */}
        <div className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center">
          <Star className={iconClass} />
          <div className="text-lg font-semibold text-brand-slate">{reviewsCount}</div>
          <div className="text-xs text-gray-500">Reviews</div>
        </div>
        {/* Followers */}
        <div className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center">
          <Users className={iconClass} />
          <div className="text-lg font-semibold text-brand-slate">{followersCount}</div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        {/* Following */}
        <div className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center">
          <Users className={iconClass} />
          <div className="text-lg font-semibold text-brand-slate">{followingCount}</div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
        {/* My Missions (entry point) */}
        <button 
          type="button"
          onClick={() => navigate("/my-missions")}
          className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <Book className={iconClass} />
          <div className="flex items-center justify-center text-lg font-semibold text-brand-slate">
            <span>View</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
          <div className="text-xs text-gray-500">My Missions</div>
        </button>
        {/* My Reward Transactions (entry point) */}
        <button
          type="button"
          onClick={() => navigate("/my-reward-transactions")}
          className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <Award className={iconClass} />
          <div className="flex items-center justify-center text-lg font-semibold text-brand-slate">
            <span>View</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>
          <div className="text-xs text-gray-500">Reward Transactions</div>
        </button>
        {/* Points */}
        <div className="bg-gray-50 rounded-lg p-2 text-center flex flex-col items-center">
          <Coins className={iconClass} />
          <div className="flex items-center justify-center gap-1">
            <img alt="Points" width="20" height="20" className="h-5 w-5" src="/lovable-uploads/8273d306-96cc-45cd-a7d8-ded89e18e195.png" />
            <span className="text-lg font-semibold text-brand-teal">{pointsCount}</span>
          </div>
          <div className="text-xs text-gray-500">Points</div>
        </div>
      </div>
    </div>
  );
};

export default UserOwnStatsCard;
