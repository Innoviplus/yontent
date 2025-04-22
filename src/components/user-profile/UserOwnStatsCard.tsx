
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserStatsCard, { UserStats } from '@/components/user/UserStatsCard';
import MissionsTab from '@/components/dashboard/MissionsTab';
import TransactionsTab from '@/components/dashboard/TransactionsTab';
import { User as UserType } from '@/lib/types';

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
  const [tab, setTab] = useState<'missions' | 'transactions'>('missions');

  // Arrange stats in a 3x3 grid (mobile)
  return (
    <div className="bg-white rounded-xl shadow-card p-4 mt-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 mb-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-brand-slate">{reviewsCount}</div>
          <div className="text-xs text-gray-500">Reviews</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-brand-slate">{followersCount}</div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-brand-slate">{followingCount}</div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center col-span-3 sm:col-span-1 flex flex-col items-center sm:items-stretch">
          <div className="flex items-center justify-center gap-1">
            <img alt="Points" width="20" height="20" className="h-5 w-5" src="/lovable-uploads/8273d306-96cc-45cd-a7d8-ded89e18e195.png" />
            <span className="text-lg font-semibold text-brand-teal">{pointsCount}</span>
          </div>
          <div className="text-xs text-gray-500">Points</div>
        </div>
      </div>
      {/* Tabs for Missions and Reward Transactions */}
      <Tabs value={tab} onValueChange={(value: 'missions' | 'transactions') => setTab(value)} className="mt-2">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="missions" className="flex-1">My Missions</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">Reward Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="missions">
          <MissionsTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserOwnStatsCard;
