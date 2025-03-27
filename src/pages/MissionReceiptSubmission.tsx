
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

const MissionReceiptSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  useEffect(() => {
    const fetchMission = async () => {
      if (!id) return;
      
      try {
        // Check if user has already submitted for this mission
        const { data: participations, error: participationError } = await supabase
          .from('mission_participations')
          .select('*')
          .eq('mission_id', id)
          .eq('user_id', user.id);
          
        if (participationError) throw participationError;
        
        // If user has already submitted, redirect to mission detail page
        if (participations && participations.length > 0) {
          toast.info("You have already submitted a receipt for this mission");
          navigate(`/mission/${id}`);
          return;
        }
        
        // Fetch mission details
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', id)
          .eq('type', 'RECEIPT')  // Ensure this is a receipt mission
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast.error("Receipt mission not found");
          navigate('/missions');
          return;
        }
        
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
      } catch (error) {
        console.error('Error fetching mission:', error);
        setError('Failed to load mission details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id, user?.id, navigate]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please upload at least one receipt image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload each file to Supabase storage
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `receipts/${user.id}/${id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
      
      // Save the participation record with the uploaded images
      const { error: insertError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: id,
          user_id: user.id,
          status: 'PENDING',
          submission_data: {
            receipt_images: uploadedUrls,
            submission_type: 'RECEIPT'
          }
        });
        
      if (insertError) throw insertError;
      
      toast.success('Receipt submitted successfully!');
      // Fix the navigation path - use singular "mission" instead of plural "missions"
      navigate(`/mission/${id}`);
    } catch (error) {
      console.error('Error submitting receipt:', error);
      toast.error('Failed to submit receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
            <span className="ml-2 text-gray-600">Loading mission details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <Card className="text-center p-8">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-medium">Mission Not Found</h3>
              <p className="text-gray-500 mt-2">
                {error || "The mission you're looking for doesn't exist or isn't a receipt mission."}
              </p>
              <Button onClick={() => navigate('/missions')} className="mt-6">
                Go Back to Missions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Submit Receipt for "{mission.title}"</h1>
            <p className="text-gray-500 mt-2">
              Upload photos of your purchase receipt to complete this mission and earn {mission.pointsReward} points.
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Receipt Requirements:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Clear, readable photos of your receipt</li>
                <li>Make sure the store name, date, and purchased items are visible</li>
                <li>You can upload up to 10 images</li>
                <li>Accepted formats: JPG, PNG, WEBP</li>
              </ul>
            </div>
            
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxFiles={10}
              accept="image/*"
              className="mb-4"
            />
            
            {error && (
              <div className="text-red-600 text-sm mt-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/mission/${mission.id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={files.length === 0 || isSubmitting}
              className="bg-brand-teal hover:bg-brand-teal/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Receipt
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MissionReceiptSubmission;
