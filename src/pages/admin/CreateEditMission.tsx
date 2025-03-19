import { useEffect } from 'react';
import { Loader2, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import MissionDetailsForm from '@/components/admin/mission/MissionDetailsForm';
import MissionConfigForm from '@/components/admin/mission/MissionConfigForm';
import { useMissionForm } from '@/hooks/useMissionForm';

const CreateEditMission = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.isAdmin;

  const {
    formData,
    loading,
    savingMission,
    error,
    isEditMode,
    fetchMission,
    handleChange,
    handleRichTextChange,
    handleSelectChange,
    handleDateChange,
    handleFileUpload,
    handleSubmit,
    navigate
  } = useMissionForm(!!isAdmin);

  useEffect(() => {
    fetchMission();
  }, [fetchMission]);

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
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/missions')} 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Edit Mission' : 'Create New Mission'}
            </h1>
          </div>
          
          <Button 
            type="submit" 
            form="mission-form" 
            disabled={savingMission}
            className="bg-brand-teal hover:bg-brand-teal/90"
          >
            {savingMission && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Mission
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form id="mission-form" onSubmit={handleSubmit} className="space-y-8">
          <MissionDetailsForm
            formData={formData}
            handleChange={handleChange}
            handleRichTextChange={handleRichTextChange}
            handleSelectChange={handleSelectChange}
            handleDateChange={handleDateChange}
          />
          
          <MissionConfigForm
            formData={formData}
            handleChange={handleChange}
            handleRichTextChange={handleRichTextChange}
            handleFileUpload={handleFileUpload}
            savingMission={savingMission}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateEditMission;
