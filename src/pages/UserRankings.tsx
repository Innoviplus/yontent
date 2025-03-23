
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import RankingsContent from '@/components/rankings/RankingsContent';
import { RankingType } from '@/components/rankings/types';

const Rankings = () => {
  const [activeTab, setActiveTab] = useState<RankingType>('points');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Rankings</h1>
          <p className="text-lg text-gray-600">
            Top users ranked by monthly achievements.
          </p>
          
          <Tabs 
            defaultValue="points" 
            className="mt-6"
            onValueChange={(value) => setActiveTab(value as RankingType)}
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Top Users by {activeTab === 'points' ? 'Monthly Points' : 
                               activeTab === 'views' ? 'Monthly Views' : 
                               'Monthly Likes'} - {format(new Date(), 'MMMM yyyy')}
                </h2>
              </div>
              
              <RankingsContent activeTab={activeTab} />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
