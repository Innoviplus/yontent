
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';

const CreateEditMission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.isAdmin;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirementDescription: '',
    pointsReward: 0,
    type: 'REVIEW',
    status: 'DRAFT',
    merchantName: '',
    merchantLogo: '',
    bannerImage: '',
    maxSubmissionsPerUser: 1,
    termsConditions: '',
    startDate: new Date(),
    expiresAt: null as Date | null,
  });

  const [loading, setLoading] = useState(false);
  const [savingMission, setSavingMission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchMission();
    }
  }, [id]);

  const fetchMission = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          requirementDescription: data.requirement_description,
          pointsReward: data.points_reward,
          type: data.type,
          status: data.status,
          merchantName: data.merchant_name || '',
          merchantLogo: data.merchant_logo || '',
          bannerImage: data.banner_image || '',
          maxSubmissionsPerUser: data.max_submissions_per_user || 1,
          termsConditions: data.terms_conditions || '',
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        });
      }
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load mission details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pointsReward' || name === 'maxSubmissionsPerUser'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('You do not have permission to create or edit missions');
      return;
    }
    
    try {
      setSavingMission(true);
      
      const missionData = {
        title: formData.title,
        description: formData.description,
        requirement_description: formData.requirementDescription,
        points_reward: formData.pointsReward,
        type: formData.type,
        status: formData.status,
        merchant_name: formData.merchantName || null,
        merchant_logo: formData.merchantLogo || null,
        banner_image: formData.bannerImage || null,
        max_submissions_per_user: formData.maxSubmissionsPerUser || 1,
        terms_conditions: formData.termsConditions || null,
        start_date: formData.startDate.toISOString(),
        expires_at: formData.expiresAt ? formData.expiresAt.toISOString() : null,
      };
      
      let result;
      
      if (isEditMode) {
        result = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('missions')
          .insert([missionData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success(`Mission ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/missions');
    } catch (error: any) {
      setError(error.message);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} mission`);
    } finally {
      setSavingMission(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `missions/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({
        ...prev,
        [fieldName]: urlData.publicUrl
      }));
      
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
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
          <Card>
            <CardHeader>
              <CardTitle>Mission Details</CardTitle>
              <CardDescription>Basic information about this mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter mission title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pointsReward">Points Reward <span className="text-red-500">*</span></Label>
                  <Input
                    id="pointsReward"
                    name="pointsReward"
                    type="number"
                    value={formData.pointsReward}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter mission description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirementDescription">Requirement Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="requirementDescription"
                  name="requirementDescription"
                  value={formData.requirementDescription}
                  onChange={handleChange}
                  placeholder="Enter mission requirements"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Mission Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REVIEW">Review</SelectItem>
                      <SelectItem value="RECEIPT">Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mission status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                  <DatePicker
                    value={formData.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiration Date</Label>
                  <DatePicker
                    value={formData.expiresAt}
                    onChange={(date) => handleDateChange('expiresAt', date)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mission Configuration</CardTitle>
              <CardDescription>Additional settings for this mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    name="merchantName"
                    value={formData.merchantName}
                    onChange={handleChange}
                    placeholder="Enter merchant name (optional)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxSubmissionsPerUser">Max Submissions Per User</Label>
                  <Input
                    id="maxSubmissionsPerUser"
                    name="maxSubmissionsPerUser"
                    type="number"
                    value={formData.maxSubmissionsPerUser}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantLogo">Merchant Logo URL</Label>
                <Input
                  id="merchantLogo"
                  name="merchantLogo"
                  value={formData.merchantLogo}
                  onChange={handleChange}
                  placeholder="Enter merchant logo URL (optional)"
                />
                <div className="mt-2">
                  <Label htmlFor="merchantLogoUpload">Or upload merchant logo:</Label>
                  <Input
                    id="merchantLogoUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'merchantLogo')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bannerImage">Banner Image URL</Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  placeholder="Enter banner image URL (optional)"
                />
                <div className="mt-2">
                  <Label htmlFor="bannerImageUpload">Or upload banner image:</Label>
                  <Input
                    id="bannerImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'bannerImage')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termsConditions">Terms & Conditions</Label>
                <Textarea
                  id="termsConditions"
                  name="termsConditions"
                  value={formData.termsConditions}
                  onChange={handleChange}
                  placeholder="Enter terms and conditions (optional)"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateEditMission;
