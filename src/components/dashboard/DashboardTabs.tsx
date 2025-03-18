
import { useState } from 'react';
import { Review, Mission } from '@/lib/types';
import ReviewsTab from './ReviewsTab';
import MissionsTab from './MissionsTab';

interface DashboardTabsProps {
  reviews: Review[];
  missions: Mission[];
}

const DashboardTabs = ({ reviews, missions }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'missions'>('reviews');
  
  return (
    <>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Your Reviews
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'missions'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Your Missions
            </button>
          </div>
        </div>
      </div>
      
      <div className="animate-fade-in">
        {activeTab === 'reviews' ? (
          <ReviewsTab reviews={reviews} />
        ) : (
          <MissionsTab missions={missions} />
        )}
      </div>
    </>
  );
};

export default DashboardTabs;
