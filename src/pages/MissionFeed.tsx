
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MissionCard from '@/components/mission/MissionCard';
import EmptyMissionState from '@/components/mission/EmptyMissionState';
import MissionSort from '@/components/mission/MissionSort';
import { useMissions } from '@/hooks/useMissions';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const MissionFeed = () => {
  const { missions, loading, sortBy, setSortBy, setPage, hasMore } = useMissions();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Missions</h1>
          
          <div className="flex items-center gap-4">
            <MissionSort sortBy={sortBy} onSortChange={setSortBy} />

            {isLoggedIn && (
              <Link to="/admin/missions/new">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mission
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {loading && missions.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl h-64 shadow-subtle"></div>
            ))}
          </div>
        ) : missions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyMissionState isAuthenticated={!!user} />
        )}
      </div>
    </div>
  );
};

export default MissionFeed;
