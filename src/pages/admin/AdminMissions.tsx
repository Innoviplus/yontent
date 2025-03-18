
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.isAdmin;

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const transformedMissions: Mission[] = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          pointsReward: mission.points_reward,
          type: mission.type as 'REVIEW' | 'RECEIPT',
          status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
          expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
          requirementDescription: mission.requirement_description,
          merchantName: mission.merchant_name,
          merchantLogo: mission.merchant_logo,
          bannerImage: mission.banner_image,
          maxSubmissionsPerUser: mission.max_submissions_per_user,
          termsConditions: mission.terms_conditions,
          startDate: new Date(mission.start_date),
          createdAt: new Date(mission.created_at),
          updatedAt: new Date(mission.updated_at)
        }));
        
        setMissions(transformedMissions);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  const deleteMission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mission?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Mission deleted successfully');
      setMissions(missions.filter(mission => mission.id !== id));
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error('Failed to delete mission');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            You don't have permission to access this page
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin: Manage Missions</h1>
          <Link to="/admin/missions/new">
            <Button className="bg-brand-teal hover:bg-brand-teal/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Mission
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-subtle rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {missions.map((mission) => (
                  <tr key={mission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{mission.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${mission.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          mission.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{mission.pointsReward}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{format(mission.createdAt, 'MMM d, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link to={`/missions/${mission.id}`} className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4 inline" />
                      </Link>
                      <Link to={`/admin/missions/edit/${mission.id}`} className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="h-4 w-4 inline" />
                      </Link>
                      <button 
                        onClick={() => deleteMission(mission.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
                {missions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No missions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMissions;
