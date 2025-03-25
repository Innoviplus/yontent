
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReviewsTab from './ReviewsTab';
import DraftReviewsTab from './DraftReviewsTab';
import MissionsTab from './MissionsTab';
import TransactionsTab from './TransactionsTab';
import { Review } from '@/lib/types';

interface DashboardTabsProps {
  reviews: Review[];
  draftReviews: Review[];
}

const DashboardTabs = ({ reviews, draftReviews }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        <TabsTrigger value="drafts">My Drafts</TabsTrigger>
        <TabsTrigger value="missions">My Missions</TabsTrigger>
        <TabsTrigger value="transactions">Reward Transactions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="reviews">
        <ReviewsTab reviews={reviews} />
      </TabsContent>
      
      <TabsContent value="drafts">
        <DraftReviewsTab drafts={draftReviews} />
      </TabsContent>
      
      <TabsContent value="missions">
        <MissionsTab />
      </TabsContent>
      
      <TabsContent value="transactions">
        <TransactionsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
