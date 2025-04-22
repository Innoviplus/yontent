
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReviewsTab from './ReviewsTab';
import DraftReviewsTab from './DraftReviewsTab';
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
      </TabsList>
      
      <TabsContent value="reviews">
        <ReviewsTab reviews={reviews} />
      </TabsContent>
      
      <TabsContent value="drafts">
        <DraftReviewsTab drafts={draftReviews} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

