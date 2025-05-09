import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReviewsTab from './ReviewsTab';
import DraftReviewsTab from './DraftReviewsTab';
import MissionsTab from './MissionsTab';
import { Review } from '@/lib/types';
import { Link } from 'react-router-dom';
interface DashboardTabsProps {
  reviews: Review[];
  draftReviews: Review[];
}
const DashboardTabs = ({
  reviews,
  draftReviews
}: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('missions');
  return <Tabs defaultValue="missions" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="missions">Missions</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="missions">
        <MissionsTab />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewsTab reviews={reviews} />
      </TabsContent>
      
      <TabsContent value="drafts">
        <DraftReviewsTab drafts={draftReviews} />
      </TabsContent>
    </Tabs>;
};
export default DashboardTabs;