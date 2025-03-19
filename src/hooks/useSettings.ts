
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ExtendedProfile } from '@/lib/types';

// Form schemas
const profileFormSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  bio: z.string().max(500).optional(),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  facebookUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  instagramUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  youtubeUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  tiktokUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

const settingsFormSchema = z.object({
  email: z.string().email("Please enter a valid email").optional(),
  phoneNumber: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
});

export const useSettings = () => {
  const { user, userProfile, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile?.username || '',
      firstName: '',
      lastName: '',
      bio: '',
      gender: '',
      birthDate: undefined,
      websiteUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
    },
  });

  const settingsForm = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      email: user?.email || '',
      phoneNumber: '',
      phoneCountryCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      setAvatarUrl(userProfile.avatar || null);
      
      // Load extended profile data if available
      const loadExtendedProfile = async () => {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('extended_data, phone_country_code')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching extended profile:', error);
          return;
        }
        
        if (data) {
          const extData = data.extended_data as ExtendedProfile || {};
          setExtendedProfile(extData);
          
          profileForm.reset({
            username: userProfile.username || '',
            firstName: extData.firstName || '',
            lastName: extData.lastName || '',
            bio: extData.bio || '',
            gender: extData.gender || '',
            birthDate: extData.birthDate ? new Date(extData.birthDate) : undefined,
            websiteUrl: extData.websiteUrl || '',
            facebookUrl: extData.facebookUrl || '',
            instagramUrl: extData.instagramUrl || '',
            youtubeUrl: extData.youtubeUrl || '',
            tiktokUrl: extData.tiktokUrl || '',
          });
          
          settingsForm.reset({
            email: user?.email || '',
            phoneNumber: extData.phoneNumber || '',
            phoneCountryCode: data.phone_country_code || '',
            country: extData.country || '',
          });
        }
      };
      
      loadExtendedProfile();
    }
  }, [userProfile, user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      setUploading(true);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: urlData.publicUrl })
        .eq('id', user?.id);
        
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(urlData.publicUrl);
      sonnerToast.success('Avatar updated successfully!');
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Prepare extended data object
      const extendedData: ExtendedProfile = {
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio || null,
        gender: values.gender || null,
        birthDate: values.birthDate || null,
        websiteUrl: values.websiteUrl || null,
        facebookUrl: values.facebookUrl || null,
        instagramUrl: values.instagramUrl || null,
        youtubeUrl: values.youtubeUrl || null,
        tiktokUrl: values.tiktokUrl || null,
        phoneNumber: extendedProfile?.phoneNumber || null,
        country: extendedProfile?.country || null,
      };
      
      // Convert ExtendedProfile to a plain object for storage
      const jsonData = Object.fromEntries(
        Object.entries(extendedData).map(([key, value]) => [key, value])
      );
      
      // Update the profile with extended data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: jsonData })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setExtendedProfile(extendedData);
      
      sonnerToast.success('Profile updated successfully!');
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onSettingsSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Get current extended data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('extended_data')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update extended data with new settings
      const currentExtendedData = data.extended_data as ExtendedProfile || {};
      const updatedExtendedData: ExtendedProfile = {
        ...currentExtendedData,
        phoneNumber: values.phoneNumber || null,
        country: values.country || null,
      };
      
      // Convert ExtendedProfile to a plain object for storage
      const jsonData = Object.fromEntries(
        Object.entries(updatedExtendedData).map(([key, value]) => [key, value])
      );
      
      // Update profile with new extended data and phone country code
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          extended_data: jsonData,
          phone_country_code: values.phoneCountryCode || null
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setExtendedProfile(updatedExtendedData);
      
      sonnerToast.success('Settings updated successfully!');
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) {
        throw error;
      }
      
      sonnerToast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast({
        title: "Reset Password Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // In a real application, this would typically be handled by a secure server-side function
      sonnerToast.info('Account deletion would be processed here. Signing you out for demo purposes.');
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    userProfile,
    avatarUrl,
    uploading,
    isUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    profileForm,
    settingsForm,
    handleAvatarUpload,
    onProfileSubmit,
    onSettingsSubmit,
    handleResetPassword,
    handleDeleteAccount,
    handleLogout,
  };
};
