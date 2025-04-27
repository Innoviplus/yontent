
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMissionsList } from '@/hooks/mission/useMissionsList';
import Navbar from '@/components/Navbar';
import MissionsHeader from '@/components/mission/MissionsHeader';
import MissionsControls from '@/components/mission/MissionsControls';
import MissionsError from '@/components/mission/MissionsError';
import MissionsGrid from '@/components/mission/MissionsGrid';
import { useEffect } from 'react';

const Missions = () => {
  usePageTitle('Missions');
  const {
    missions,
    isLoading,
    loadError,
    activeMissionsCount,
    sortBy,
    setSortBy,
    fetchMissions,
    getParticipationCount
  } = useMissionsList();
  
  // Force a refresh when the component mounts to get the latest data
  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
          <MissionsHeader 
            activeMissionsCount={activeMissionsCount}
            isLoading={isLoading}
          />
          
          <MissionsControls
            isLoading={isLoading}
            activeMissionsCount={activeMissionsCount}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRefresh={fetchMissions}
          />
        </div>
        
        {loadError && (
          <MissionsError error={loadError} onRetry={fetchMissions} />
        )}
        
        <MissionsGrid 
          missions={missions} 
          isLoading={isLoading} 
          getParticipationCount={getParticipationCount}
        />
      </main>
    </div>
  );
};

export default Missions;
