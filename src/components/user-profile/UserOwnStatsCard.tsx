
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface UserOwnStatsCardProps {
  user: UserType;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
  pointsCount: number;
}

const UserOwnStatsCard = ({
  user,
  reviewsCount,
  followersCount,
  followingCount,
  pointsCount,
}: UserOwnStatsCardProps) => {
  const navigate = useNavigate();
  const [missionCount, setMissionCount] = useState<number>(0);
  const [transactionsCount, setTransactionsCount] = useState<number>(0);

  useEffect(() => {
    const fetchMissionCount = async () => {
      if (!user?.id) return;
      
      try {
        const { count, error } = await supabase
          .from('mission_participations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (error) throw error;
        setMissionCount(count || 0);
      } catch (error) {
        setMissionCount(0);
      }
    };
    
    const fetchTransactionsCount = async () => {
      if (!user?.id) return;
      
      try {
        const { count, error } = await supabase
          .from('point_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (error) throw error;
        setTransactionsCount(count || 0);
      } catch (error) {
        setTransactionsCount(0);
      }
    };
    
    fetchMissionCount();
    fetchTransactionsCount();
  }, [user?.id]);

  return (
    <div className="bg-white rounded-xl shadow-card p-4 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Reviews */}
        <div className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center">
          <div className="text-lg font-semibold text-brand-slate">{reviewsCount}</div>
          <div className="text-xs text-gray-500">Reviews</div>
        </div>
        
        {/* Followers - clickable, with username parameter */}
        <button 
          type="button"
          onClick={() => navigate(`/user/${user.username}/followers`)}
          className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <div className="text-lg font-semibold text-brand-slate">
            {followersCount}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </button>
        
        {/* Following - clickable, with username parameter */}
        <button 
          type="button"
          onClick={() => navigate(`/user/${user.username}/following`)}
          className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <div className="text-lg font-semibold text-brand-slate">
            {followingCount}
          </div>
          <div className="text-xs text-gray-500">Following</div>
        </button>

        {/* My Missions - clickable, shows count */}
        <button 
          type="button"
          onClick={() => navigate("/my-missions")}
          className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <div className="text-lg font-semibold text-brand-slate">
            {missionCount}
          </div>
          <div className="text-xs text-gray-500">My Missions</div>
        </button>
        
        {/* Reward Transactions - clickable, shows count */}
        <button
          type="button"
          onClick={() => navigate("/my-reward-transactions")}
          className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center hover:bg-brand-teal/10 transition-colors"
        >
          <div className="text-lg font-semibold text-brand-slate">
            {transactionsCount}
          </div>
          <div className="text-xs text-gray-500">Transactions</div>
        </button>

        {/* Points */}
        <div className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-1">
            <img alt="Points" width="20" height="20" className="h-5 w-5" src="/lovable-uploads/8273d306-96cc-45cd-a7d8-ded89e18e195.png" />
            <span className="text-lg font-semibold text-brand-teal">{pointsCount}</span>
          </div>
          <div className="text-xs text-gray-500">Point Balance</div>
        </div>
      </div>
    </div>
  );
};

export default UserOwnStatsCard;
