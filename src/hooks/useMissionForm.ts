
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface MissionFormData {
  title: string;
  description: string;
  requirementDescription: string;
  pointsReward: number;
  type: string;
  status: string;
  merchantName: string;
  merchantLogo: string;
  bannerImage: string;
  maxSubmissionsPerUser: number;
  termsConditions: string;
  startDate: Date;
  expiresAt: Date | null;
}

export const useMissionForm = (isAdmin: boolean) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<MissionFormData>({
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
    expiresAt: null,
  });

  const [loading, setLoading] = useState(false);
  const [savingMission, setSavingMission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMission = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching mission:', error);
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
      console.error('Error fetching mission:', error);
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

  const handleRichTextChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Use the missions bucket instead of public
      const { error: uploadError } = await supabase.storage
        .from('missions')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL from the missions bucket
      const { data: urlData } = supabase.storage
        .from('missions')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({
        ...prev,
        [fieldName]: urlData.publicUrl
      }));
      
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error('Error uploading file: ' + error.message);
      console.error('File upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('You do not have permission to create or edit missions');
      return;
    }
    
    try {
      setSavingMission(true);
      setError(null);
      
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
      
      console.log('Saving mission with data:', missionData);
      
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
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      console.log('Mission saved successfully:', result);
      toast.success(`Mission ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/missions');
    } catch (error: any) {
      console.error('Error saving mission:', error);
      setError(error.message);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} mission: ${error.message}`);
    } finally {
      setSavingMission(false);
    }
  };

  return {
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
  };
};
