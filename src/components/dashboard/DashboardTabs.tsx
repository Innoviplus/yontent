
import { useState } from 'react';
import { Review } from '@/lib/types';
import ReviewsTab from './ReviewsTab';
import MissionsTab from './MissionsTab';
import DraftReviewsTab from './DraftReviewsTab';

interface DashboardTabsProps {
  reviews: Review[];
  draftReviews: Review[];
}

const DashboardTabs = ({ reviews, draftReviews }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'missions'>('published');
  
  return (
    <>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('published')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'published'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Published Reviews
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'drafts'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Draft Reviews
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'missions'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Missions
            </button>
          </div>
        </div>
      </div>
      
      <div className="animate-fade-in">
        {activeTab === 'published' ? (
          <ReviewsTab reviews={reviews} />
        ) : activeTab === 'drafts' ? (
          <DraftReviewsTab reviews={draftReviews} />
        ) : (
          <MissionsTab />
        )}
      </div>
    </>
  );
};

export default DashboardTabs;
