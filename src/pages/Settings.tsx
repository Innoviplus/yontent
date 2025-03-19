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
import { ExtendedProfile } from '@/lib/types';

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
      
      // Update the profile with extended data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: extendedData })
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
      
      // Update profile with new extended data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: updatedExtendedData })
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
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information and personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                      <div className="flex flex-col items-center">
                        <Avatar className="w-32 h-32 mb-4">
                          <AvatarImage src={avatarUrl || ''} alt={userProfile?.username || 'User'} />
                          <AvatarFallback>{userProfile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            id="avatar-upload"
                            disabled={uploading}
                          />
                          <Button
                            variant="outline"
                            className="relative"
                            asChild
                            disabled={uploading}
                          >
                            <label htmlFor="avatar-upload">
                              {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Camera className="h-4 w-4 mr-2" />
                              )}
                              {uploading ? 'Uploading...' : 'Change Avatar'}
                            </label>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} readOnly />
                                  </FormControl>
                                  <FormDescription>
                                    Your username cannot be changed.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                              <FormField
                                control={profileForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us a little about yourself"
                                      className="resize-none"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Brief description for your profile. Maximum 500 characters.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                              <FormField
                                control={profileForm.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Gender" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="birthDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                          }
                                          initialFocus
                                          className="p-3 pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <Button type="submit" disabled={isUpdating}>
                              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save Profile
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account details and security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <Form {...settingsForm}>
                      <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                        <FormField
                          control={settingsForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} readOnly />
                              </FormControl>
                              <FormDescription>
                                Your email address cannot be changed directly.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={settingsForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={settingsForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="United States" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Settings
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <Button variant="outline" onClick={handleResetPassword}>
                        Reset Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Profiles</CardTitle>
                    <CardDescription>Connect your social media accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="facebookUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook Profile</FormLabel>
                              <FormControl>
                                <Input placeholder="https://facebook.com/username" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="instagramUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram Profile</FormLabel>
                              <FormControl>
                                <Input placeholder="https://instagram.com/username" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>YouTube Channel</FormLabel>
                              <FormControl>
                                <Input placeholder="https://youtube.com/c/channelname" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="tiktokUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TikTok Profile</FormLabel>
                              <FormControl>
                                <Input placeholder="https://tiktok.com/@username" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="button" onClick={profileForm.handleSubmit(onProfileSubmit)} disabled={isUpdating}>
                          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Social Profiles
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage app preferences and account actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-4">About</h3>
                      <p className="text-muted-foreground">
                        This application helps users track and share reviews, participate in missions, and earn points.
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-4">Contact Us</h3>
                      <p className="text-muted-foreground mb-4">
                        If you have any questions or need support, please get in touch with our team.
                      </p>
                      <Button variant="outline">
                        Send Message
                      </Button>
                    </div>
                    
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                          Log out
                        </Button>
                        
                        <Button 
                          onClick={handleDeleteAccount} 
                          variant="destructive" 
                          className="w-full justify-start"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
