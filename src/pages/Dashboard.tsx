
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Receipt, Camera, ChevronRight, User, Gift, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PointsBadge from '@/components/PointsBadge';
import { Review, Mission } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import MissionCard from '@/components/MissionCard';

// Sample data
const sampleUserData = {
  id: '1',
  username: 'sampleuser',
  email: 'user@example.com',
  avatar: undefined,
  points: 750,
  createdAt: new Date('2023-05-15'),
  completedReviews: 12,
  completedMissions: 8,
};

const sampleReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    productName: 'Wireless Headphones',
    rating: 5,
    content: 'These headphones have amazing sound quality and the noise cancellation is top-notch. Battery life is exceptional - I can go days without charging. The comfort level is also great for long listening sessions.',
    images: ['/placeholder.svg'],
    createdAt: new Date('2023-09-15'),
    user: {
      id: '1',
      username: 'sampleuser',
      email: 'user@example.com',
      points: 750,
      createdAt: new Date('2023-05-15')
    }
  },
  {
    id: '2',
    userId: '1',
    productName: 'Smart Watch Series 7',
    rating: 4,
    content: 'Great fitness tracking capabilities and the screen is beautiful. Battery life could be better but overall very satisfied with the purchase.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: new Date('2023-10-05'),
    user: {
      id: '1',
      username: 'sampleuser',
      email: 'user@example.com',
      points: 750,
      createdAt: new Date('2023-05-15')
    }
  },
];

const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Review Your Recent Electronics',
    description: 'Share your honest opinion about any electronics product you purchased in the last 3 months.',
    pointsReward: 150,
    type: 'REVIEW',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-31'),
    requirementDescription: 'Post a review with at least one photo and 100+ words.'
  },
  {
    id: '2',
    title: 'Holiday Shopping Receipt',
    description: 'Submit a receipt from your holiday shopping for a chance to earn points.',
    pointsReward: 100,
    type: 'RECEIPT',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-15'),
    requirementDescription: 'Upload a clear photo of your receipt showing date and store name.'
  },
  {
    id: '3',
    title: 'Home Appliance Review',
    description: 'Share your experience with a home appliance you use regularly.',
    pointsReward: 200,
    type: 'REVIEW',
    status: 'COMPLETED',
    expiresAt: new Date('2024-02-28'),
    requirementDescription: 'Post a detailed review covering pros, cons, and usage tips.'
  },
];

const Dashboard = () => {
  const user = sampleUserData;
  const [activeTab, setActiveTab] = useState<'reviews' | 'missions'>('reviews');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* User profile header */}
          <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <User className="h-12 w-12" />
              </div>
              
              {/* User info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                  <PointsBadge points={user.points} />
                </div>
                <p className="text-gray-500 mt-1">{user.email}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-brand-slate">{user.completedReviews}</div>
                    <div className="text-sm text-gray-500">Reviews</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-brand-slate">{user.completedMissions}</div>
                    <div className="text-sm text-gray-500">Missions</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-brand-slate">{user.points}</div>
                    <div className="text-sm text-gray-500">Points</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-semibold text-brand-slate">0</div>
                    <div className="text-sm text-gray-500">Redeemed</div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Link to="/settings" className="btn-outline py-2 px-3">
                  <Settings className="h-5 w-5" />
                </Link>
                <Link to="/rewards" className="btn-primary py-2 flex items-center gap-1.5">
                  <Gift className="h-5 w-5" />
                  <span>Redeem Points</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link 
              to="/submit-review" 
              className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="bg-brand-teal/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Camera className="h-6 w-6 text-brand-teal" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Submit a Review</h3>
                <p className="text-sm text-gray-600">Share your product experience</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </Link>
            
            <Link 
              to="/submit-receipt" 
              className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="bg-brand-slate/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-brand-slate" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upload Receipt</h3>
                <p className="text-sm text-gray-600">Complete receipt missions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </Link>
            
            <Link 
              to="/missions" 
              className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="bg-brand-teal/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-brand-teal" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Explore Missions</h3>
                <p className="text-sm text-gray-600">Find new ways to earn points</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
            </Link>
          </div>
          
          {/* Tabs for Reviews and Missions */}
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
          
          {/* Tab content */}
          <div className="animate-fade-in">
            {activeTab === 'reviews' ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Reviews</h2>
                  <Link 
                    to="/submit-review" 
                    className="btn-primary py-1.5 px-4 text-sm"
                  >
                    Add Review
                  </Link>
                </div>
                
                {sampleReviews.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sampleReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't submitted any product reviews yet. 
                      Share your experiences to start earning points!
                    </p>
                    <Link to="/submit-review" className="btn-primary">
                      Submit Your First Review
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Missions</h2>
                  <Link 
                    to="/missions" 
                    className="btn-primary py-1.5 px-4 text-sm"
                  >
                    Explore Missions
                  </Link>
                </div>
                
                {sampleMissions.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sampleMissions.map((mission) => (
                      <MissionCard key={mission.id} mission={mission} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No missions yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't participated in any missions yet.
                      Complete missions to earn additional points!
                    </p>
                    <Link to="/missions" className="btn-primary">
                      Browse Available Missions
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
