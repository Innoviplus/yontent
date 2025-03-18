
import { useParams, Link } from 'react-router-dom';
import { Award, Calendar, Clock, ArrowLeft, Receipt, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMissionDetails } from '@/hooks/useMissions';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { format, isPast } from 'date-fns';

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { mission, loading, error, participation, joinMission } = useMissionDetails(id || '');
  const { user } = useAuth();
  const isExpired = mission?.expiresAt ? isPast(mission.expiresAt) : false;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <Link to="/missions" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Missions
        </Link>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : mission ? (
          <div className="space-y-6">
            {/* Mission banner */}
            {mission.bannerImage && (
              <div className="h-64 w-full bg-gray-100 overflow-hidden rounded-xl">
                <img 
                  src={mission.bannerImage} 
                  alt={mission.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Mission header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="chip chip-secondary flex items-center gap-1">
                    {mission.type === 'REVIEW' ? 
                      <>
                        <Camera className="h-3 w-3" />
                        <span>Review Mission</span>
                      </> : 
                      <>
                        <Receipt className="h-3 w-3" />
                        <span>Receipt Mission</span>
                      </>
                    }
                  </div>
                  
                  {isExpired && (
                    <div className="chip chip-danger">
                      Expired
                    </div>
                  )}
                  
                  {participation && (
                    <div className="chip chip-warning">
                      {participation.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{mission.title}</h1>
                
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Award className="h-5 w-5 text-brand-teal" />
                    <span className="font-medium">{mission.pointsReward} points</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-5 w-5" />
                    <span>Started {format(mission.startDate, 'MMM d, yyyy')}</span>
                  </div>
                  
                  {mission.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      <span>{isExpired ? 'Expired' : 'Expires'} {format(mission.expiresAt, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {user && !isExpired && !participation && (
                <Button 
                  className="bg-brand-teal hover:bg-brand-teal/90"
                  onClick={joinMission}
                >
                  Join Mission
                </Button>
              )}
              
              {user && !isExpired && participation && participation.status === 'IN_PROGRESS' && (
                <Link to={mission.type === 'REVIEW' ? '/submit-review?missionId=' + mission.id : '/submit-receipt?missionId=' + mission.id}>
                  <Button className="bg-brand-teal hover:bg-brand-teal/90">
                    {mission.type === 'REVIEW' ? 'Submit Review' : 'Upload Receipt'}
                  </Button>
                </Link>
              )}
              
              {!user && (
                <Link to="/login">
                  <Button className="bg-brand-teal hover:bg-brand-teal/90">
                    Login to Join
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Mission details */}
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <h2 className="text-xl font-semibold mb-4">Mission Details</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{mission.description}</p>
              
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{mission.requirementDescription}</p>
              
              {mission.termsConditions && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                  <p className="text-gray-700 whitespace-pre-line">{mission.termsConditions}</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            Mission not found
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionDetail;
