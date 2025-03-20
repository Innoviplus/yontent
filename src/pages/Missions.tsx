
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import MissionSortDropdown from '@/components/mission/MissionSortDropdown';
import Navbar from '@/components/Navbar';
import { RefreshCw } from 'lucide-react';

// Sample mission data for UI
const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Write a review for Nike Air Max',
    description: 'Share your honest experience with the Nike Air Max shoes and earn points.',
    pointsReward: 50,
    type: 'REVIEW',
    status: 'ACTIVE',
    merchantName: 'Nike',
    merchantLogo: '/placeholder.svg',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    maxSubmissionsPerUser: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Submit your Apple iPad receipt',
    description: 'Upload your receipt for any Apple iPad purchase to earn rewards.',
    pointsReward: 100,
    type: 'RECEIPT',
    status: 'ACTIVE',
    merchantName: 'Apple',
    merchantLogo: '/placeholder.svg',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    maxSubmissionsPerUser: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Review Adidas Sneakers',
    description: 'Share your thoughts on any Adidas sneakers you have purchased recently.',
    pointsReward: 75,
    type: 'REVIEW',
    status: 'ACTIVE',
    merchantName: 'Adidas',
    merchantLogo: '/placeholder.svg',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    maxSubmissionsPerUser: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Samsung TV Purchase Receipt',
    description: 'Submit your receipt for any Samsung TV purchase.',
    pointsReward: 200,
    type: 'RECEIPT',
    status: 'ACTIVE',
    merchantName: 'Samsung',
    merchantLogo: '/placeholder.svg',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    maxSubmissionsPerUser: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'H&M Clothing Review',
    description: 'Share your experience with any H&M clothing items purchased within the last 30 days.',
    pointsReward: 40,
    type: 'REVIEW',
    status: 'COMPLETED',
    merchantName: 'H&M',
    merchantLogo: '/placeholder.svg',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    maxSubmissionsPerUser: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

type SortOption = 'recent' | 'expiringSoon' | 'highestReward';

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setMissions(sampleMissions);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Sort missions based on selected option
    const sortedMissions = [...missions];
    
    switch (sortBy) {
      case 'recent':
        sortedMissions.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'expiringSoon':
        sortedMissions.sort((a, b) => {
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        });
        break;
      case 'highestReward':
        sortedMissions.sort((a, b) => b.pointsReward - a.pointsReward);
        break;
    }
    
    setMissions(sortedMissions);
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Missions</h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete missions to earn points and unlock rewards.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500">
              {isLoading ? 'Loading missions...' : `${missions.length} missions available`}
            </p>
            
            <div className="flex gap-2">
              <MissionSortDropdown sortBy={sortBy} onSortChange={(sort) => setSortBy(sort as SortOption)} />
              
              <button 
                className="flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setMissions(sampleMissions);
                    setIsLoading(false);
                  }, 500);
                }}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No available missions</h3>
            <p className="text-gray-600">
              There are no active missions at the moment. Check back soon for new opportunities to earn points!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} className="h-full" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Missions;
