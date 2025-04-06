
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePasswordReset } from './usePasswordReset';
import { useSettingsFormState } from './useSettingsFormState';
import { useSettingsSubmit } from './useSettingsSubmit';

export const useSettingsForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Get form state
  const { form, isSubmitting } = useSettingsFormState();
  
  // Get password reset functionality
  const { handleResetPassword } = usePasswordReset();
  
  // Get form submission handler
  const { onSubmit } = useSettingsSubmit();
  
  // Handle password reset with the user's email
  const handlePasswordReset = () => {
    if (user?.email) {
      return handleResetPassword(user.email);
    }
  };

  return {
    form,
    onSubmit,
    activeTab,
    setActiveTab,
    handleResetPassword: handlePasswordReset,
    isSubmitting
  };
};
