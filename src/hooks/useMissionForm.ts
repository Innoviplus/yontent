
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MissionFormData } from '@/lib/types';
import { useMissionFileUpload } from './mission/useMissionFileUpload';
import { useMissionFetch } from './mission/useMissionFetch';
import { useMissionSave } from './mission/useMissionSave';

export const useMissionForm = (isLoggedIn: boolean) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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

  // Use the extracted hooks
  const { uploadFile, uploading } = useMissionFileUpload();
  const { fetchMission, loading: fetchLoading, error: fetchError, setError: setFetchError } = useMissionFetch(id);
  const { 
    saveMission, 
    savingMission, 
    error: saveError, 
    setError: setSaveError,
    isEditMode 
  } = useMissionSave(id);

  // Combined error state
  const error = fetchError || saveError;
  const loading = fetchLoading || uploading;

  const loadMissionData = useCallback(async () => {
    if (isEditMode) {
      const missionData = await fetchMission();
      if (missionData) {
        setFormData(missionData);
      }
    }
  }, [isEditMode, fetchMission]);

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
    
    const publicUrl = await uploadFile(file, fieldName);
    if (publicUrl) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: publicUrl
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    console.log('User is logged in:', isLoggedIn);
    
    const success = await saveMission(formData, isLoggedIn);
    if (success) {
      navigate('/admin/missions');
    }
  };

  return {
    formData,
    loading,
    savingMission,
    error,
    isEditMode,
    fetchMission: loadMissionData,
    handleChange,
    handleRichTextChange,
    handleSelectChange,
    handleDateChange,
    handleFileUpload,
    handleSubmit,
    navigate
  };
};
