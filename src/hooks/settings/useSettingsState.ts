
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedProfile } from '@/lib/types';

export const useSettingsState = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userProfile?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile | null>(null);

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
