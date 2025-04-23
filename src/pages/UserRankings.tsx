import React from 'react';
import Navbar from '@/components/Navbar';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RankingsContent from '@/components/rankings/RankingsContent';
import { RankingType } from '@/components/rankings/types';
const UserRankings = () => {
  usePageTitle('Rankings');
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-brand-teal">
          <Sparkles className="h-6 w-6" />
          User Rankings
        </h1>

        <Tabs defaultValue="points" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="views">By Views</TabsTrigger>
            <TabsTrigger value="likes">By Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            <RankingsContent activeTab="points" />
          </TabsContent>

          <TabsContent value="views">
            <RankingsContent activeTab="views" />
          </TabsContent>

          <TabsContent value="likes">
            <RankingsContent activeTab="likes" />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default UserRankings;