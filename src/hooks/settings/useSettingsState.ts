
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedProfile } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

export const useSettingsState = () => {
  const { user, userProfile, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile | null>(null);
  const navigate = useNavigate();

  return {
    user,
    userProfile,
    signOut,
    avatarUrl,
    setAvatarUrl,
    uploading,
    setUploading,
    isUpdating,
    setIsUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    setExtendedProfile,
    navigate
  };
};
