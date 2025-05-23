
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ParticipationsTable from './ParticipationsTable';
import { Skeleton } from '@/components/ui/skeleton';

const ParticipationsManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial loading state for a short period
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Mission Participations</h2>
        </div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Mission Participations</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ParticipationsTable filterStatus={null} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ParticipationsTable filterStatus="PENDING" />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ParticipationsTable filterStatus="REJECTED" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipationsManagement;
