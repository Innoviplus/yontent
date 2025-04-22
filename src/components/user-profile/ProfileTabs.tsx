
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProfileTabsProps {
  reviews: Review[];
  user: any;
  profile: any;
  isCurrentUser: boolean;
}

const ProfileTabs = ({ reviews, user, profile, isCurrentUser }: ProfileTabsProps) => {
  if (isCurrentUser) {
    // Own profile: don't render review tab here (moved elsewhere)
    return null;
  }
  return (
    <Tabs defaultValue="reviews">
      <TabsList className="mb-6">
        <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">
              {isCurrentUser
                ? "You haven't posted any reviews yet. Start sharing your experiences!"
                : `${profile.username} hasn't posted any reviews yet.`}
            </p>
            {isCurrentUser && (
              <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                <Link to="/submit-review">
                  Submit Your First Review
                </Link>
              </Button>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
