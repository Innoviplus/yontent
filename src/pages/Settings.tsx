
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { CalendarIcon, Loader2, Camera, Save, X } from 'lucide-react';
import { ExtendedProfile, Json } from '@/lib/types';

import Navbar from '@/components/Navbar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { SocialMediaTab } from '@/components/settings/SocialMediaTab';
import { GeneralTab } from '@/components/settings/GeneralTab';
import { AvatarUploader } from '@/components/settings/AvatarUploader';

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
  country: z.string().optional(),
});

const Settings = () => {
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
          .select('extended_data')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching extended profile:', error);
          return;
        }
        
        if (data && data.extended_data) {
          const extData = data.extended_data as ExtendedProfile;
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
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
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
      
      // Update profile with new extended data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: jsonData })
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
    // In a real app, you would want a confirmation dialog here
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // In a real application, this would typically be handled by a secure server-side function
      // For demo purposes, we'll just sign the user out
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
            
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 w-full">
                <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                <TabsTrigger value="social" className="flex-1">Social Media</TabsTrigger>
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileTab 
                  userProfile={userProfile}
                  avatarUrl={avatarUrl}
                  uploading={uploading}
                  handleAvatarUpload={handleAvatarUpload}
                  profileForm={profileForm}
                  onProfileSubmit={onProfileSubmit}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="account">
                <AccountTab 
                  settingsForm={settingsForm}
                  onSettingsSubmit={onSettingsSubmit}
                  isUpdating={isUpdating}
                  handleResetPassword={handleResetPassword}
                />
              </TabsContent>
              
              <TabsContent value="social">
                <SocialMediaTab 
                  profileForm={profileForm}
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="general">
                <GeneralTab 
                  handleLogout={handleLogout}
                  handleDeleteAccount={handleDeleteAccount}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
