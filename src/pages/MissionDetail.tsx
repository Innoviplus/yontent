
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Clock, ArrowLeft, Users, MapPin, Target, Book, Check } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMission = async () => {
      if (!id) return;
      
      try {
        // Fetch the mission
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Transform the data
        const transformedMission: Mission = {
          id: data.id,
          title: data.title,
          description: data.description,
          pointsReward: data.points_reward,
          type: data.type as 'REVIEW' | 'RECEIPT',
          status: data.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
          merchantName: data.merchant_name || undefined,
          merchantLogo: data.merchant_logo || undefined,
          bannerImage: data.banner_image || undefined,
          maxSubmissionsPerUser: data.max_submissions_per_user,
          termsConditions: data.terms_conditions || undefined,
          requirementDescription: data.requirement_description || undefined,
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setMission(transformedMission);
        
        // If user is logged in, check if they're participating in this mission
        if (user) {
          const { data: participationData, error: participationError } = await supabase
            .from('mission_participations')
            .select('status')
            .eq('mission_id', id)
            .eq('user_id', user.id)
            .single();
            
          if (participationError && participationError.code !== 'PGRST116') {
            console.error('Error checking participation:', participationError);
          }
          
          if (participationData) {
            setParticipating(true);
            setParticipationStatus(participationData.status);
          }
        }
      } catch (error) {
        console.error('Error fetching mission:', error);
        toast.error('Failed to load mission details');
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id, user]);

  const joinMission = async () => {
    if (!user) {
      toast.error('Please log in to join this mission');
      return;
    }
    
    if (!mission) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id: user.id,
          status: 'PENDING'
        });
        
      if (error) throw error;
      
      setParticipating(true);
      setParticipationStatus('PENDING');
      toast.success('You have joined this mission!');
    } catch (error) {
      console.error('Error joining mission:', error);
      toast.error('Failed to join mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4">
          <div className="animate-pulse bg-white h-96 rounded-xl mb-8"></div>
          <div className="animate-pulse bg-white h-72 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Mission not found</h1>
          <p className="mb-8">The mission you're looking for does not exist or has been removed.</p>
          <Link to="/missions">
            <Button>Back to Missions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = mission.expiresAt ? isPast(mission.expiresAt) : false;
  const isCompleted = participationStatus === 'APPROVED';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Banner */}
      <div 
        className="h-64 md:h-80 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${mission.bannerImage || '/placeholder.svg'})` 
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <Link to="/missions" className="text-white flex items-center mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all missions
          </Link>
          
          <div className="flex items-center mb-2">
            {mission.merchantLogo && (
              <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white mr-3">
                <img 
                  src={mission.merchantLogo} 
                  alt={mission.merchantName || 'Brand'} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="text-white text-sm font-medium">
              {mission.merchantName || 'Mission Sponsor'}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white">{mission.title}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">Mission Details</h2>
                <p className="text-gray-700 mb-6">{mission.description}</p>
                
                {mission.requirementDescription && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <ul className="space-y-2">
                        {mission.requirementDescription.split('\n').map((req, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 mr-2 text-brand-teal flex-shrink-0 mt-0.5" />
                            <span>{req || 'Complete the mission requirements'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {mission.type === 'REVIEW' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">How To Complete This Mission</h3>
                    <ol className="list-decimal list-inside space-y-3 pl-2">
                      <li>Purchase the product from any retailer</li>
                      <li>Try out the product for at least a few days</li>
                      <li>Write your honest, detailed review</li>
                      <li>Include at least one photo of your product</li>
                      <li>Submit your review through our platform</li>
                    </ol>
                  </div>
                )}
                
                {mission.type === 'RECEIPT' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">How To Complete This Mission</h3>
                    <ol className="list-decimal list-inside space-y-3 pl-2">
                      <li>Purchase the product from an authorized retailer</li>
                      <li>Take a clear photo of your receipt</li>
                      <li>Make sure the retailer name, date, and product details are visible</li>
                      <li>Upload the receipt through our platform</li>
                      <li>Our team will verify your submission</li>
                    </ol>
                  </div>
                )}
                
                {mission.termsConditions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                      <p>{mission.termsConditions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Social Proof - Fictitious */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">Community Engagement</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-brand-teal">127</p>
                    <p className="text-sm text-gray-600">Participants</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-brand-teal">89%</p>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-brand-teal">4.8/5</p>
                    <p className="text-sm text-gray-600">Mission Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonials - Fictitious */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">What Participants Say</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 italic mb-2">"This mission was easy to complete and the reward was credited to my account within 24 hours. Highly recommend!"</p>
                    <p className="text-sm text-gray-600 font-medium">— Sarah T.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 italic mb-2">"I was already looking to buy this product, so getting rewarded for sharing my opinion was a great bonus."</p>
                    <p className="text-sm text-gray-600 font-medium">— Michael K.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mission Stats Card */}
            <Card className="overflow-hidden border-t-4 border-t-brand-teal">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mission Stats</h2>
                  <div className="flex items-center text-brand-teal font-bold text-lg">
                    <Award className="h-5 w-5 mr-1" />
                    <span>{mission.pointsReward} pts</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Mission Type</p>
                      <p className="font-medium">{mission.type === 'REVIEW' ? 'Product Review' : 'Receipt Upload'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-medium">
                        {mission.startDate && format(mission.startDate, 'MMM d, yyyy')} 
                        {mission.expiresAt && ' - ' + format(mission.expiresAt, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {mission.maxSubmissionsPerUser && (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Submissions Allowed</p>
                        <p className="font-medium">{mission.maxSubmissionsPerUser} per user</p>
                      </div>
                    </div>
                  )}
                  
                  {mission.merchantName && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Merchant</p>
                        <p className="font-medium">{mission.merchantName}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  {isCompleted ? (
                    <Button disabled className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
                      Mission Completed
                    </Button>
                  ) : isExpired ? (
                    <Button disabled className="w-full">
                      Mission Expired
                    </Button>
                  ) : participating ? (
                    <Button disabled={loading} variant="outline" className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
                      {participationStatus === 'PENDING' ? 'Submission Pending' : 'Already Joined'}
                    </Button>
                  ) : (
                    <Button
                      onClick={joinMission}
                      disabled={loading || !user}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    >
                      {user ? 'Join Mission' : 'Log in to Join'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* FAQ Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Book className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-xl font-semibold">FAQ</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">How do I get rewarded?</h3>
                    <p className="text-sm text-gray-600">Once your submission is approved, points will be credited to your account within 48 hours.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">What happens if my submission is rejected?</h3>
                    <p className="text-sm text-gray-600">You'll receive feedback on why it was rejected and may resubmit if the mission is still active.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">How long does verification take?</h3>
                    <p className="text-sm text-gray-600">Submissions are typically reviewed within 24-48 hours.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Need Help Card */}
            <Card className="bg-gray-50 border-none">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about this mission, please contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
