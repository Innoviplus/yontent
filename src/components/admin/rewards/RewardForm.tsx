
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Image, Upload, X } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const rewardSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  points_required: z.coerce.number().min(1, { message: 'Points must be at least 1' }),
  image_url: z.string().optional().or(z.literal('')),
  banner_image: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true)
});

type RewardFormData = z.infer<typeof rewardSchema>;

interface RewardFormProps {
  reward?: RedemptionItem;
  title: string;
  onSubmit: (data: RewardFormData) => Promise<boolean>;
  onCancel: () => void;
}

const RewardForm = ({ 
  reward, 
  title, 
  onSubmit, 
  onCancel 
}: RewardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(reward?.image_url || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(reward?.banner_image || null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      name: reward?.name || '',
      description: reward?.description || '',
      points_required: reward?.points_required || 100,
      image_url: reward?.image_url || '',
      banner_image: reward?.banner_image || '',
      is_active: reward?.is_active !== false // default to true if not provided
    }
  });

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('rewards')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('rewards')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${folder} image:`, error);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setUploadingLogo(true);
    
    try {
      const imageUrl = await uploadImage(file, 'logos');
      if (imageUrl) {
        setLogoPreview(imageUrl);
        form.setValue('image_url', imageUrl);
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setUploadingBanner(true);
    
    try {
      const imageUrl = await uploadImage(file, 'banners');
      if (imageUrl) {
        setBannerPreview(imageUrl);
        form.setValue('banner_image', imageUrl);
      }
    } finally {
      setUploadingBanner(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    form.setValue('image_url', '');
  };

  const removeBanner = () => {
    setBannerPreview(null);
    form.setValue('banner_image', '');
  };

  const handleSubmit = async (data: RewardFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this reward item.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Apple Gift Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Redeem for an Apple Gift Card that can be used on the App Store..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="points_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Required</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Make this reward available for redemption
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        type="hidden" 
                        {...field} 
                      />
                      
                      {/* Image preview */}
                      {logoPreview ? (
                        <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden group">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            onClick={removeLogo}
                            disabled={uploadingLogo}
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <Upload className={`h-6 w-6 ${uploadingLogo ? 'animate-bounce text-blue-500' : 'text-gray-400'}`} />
                          <span className="mt-1 text-xs text-gray-500">
                            {uploadingLogo ? 'Uploading...' : 'Upload logo'}
                          </span>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                      
                      <p className="text-xs text-gray-500">
                        Or enter image URL directly:
                      </p>
                      
                      <Input
                        placeholder="https://example.com/image.png"
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setLogoPreview(e.target.value || null);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="banner_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        type="hidden" 
                        {...field} 
                      />
                      
                      {/* Banner preview */}
                      {bannerPreview ? (
                        <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden group">
                          <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            onClick={removeBanner}
                            disabled={uploadingBanner}
                            aria-label="Remove banner"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => bannerInputRef.current?.click()}
                        >
                          <Image className={`h-6 w-6 ${uploadingBanner ? 'animate-bounce text-blue-500' : 'text-gray-400'}`} />
                          <span className="mt-1 text-sm text-gray-500">
                            {uploadingBanner ? 'Uploading...' : 'Upload banner image'}
                          </span>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={bannerInputRef}
                        onChange={handleBannerUpload}
                        disabled={uploadingBanner}
                      />
                      
                      <p className="text-xs text-gray-500">
                        Or enter banner URL directly:
                      </p>
                      
                      <Input
                        placeholder="https://example.com/banner.jpg"
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setBannerPreview(e.target.value || null);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Banner image for the reward detail page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || uploadingLogo || uploadingBanner}>
                {isSubmitting ? 'Saving...' : 'Save Reward'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RewardForm;
