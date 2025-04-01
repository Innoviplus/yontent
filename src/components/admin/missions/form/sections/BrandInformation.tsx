
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload } from 'lucide-react';
import { MissionFormData } from '../../MissionFormSchema';
import { useMissionFormFields } from '../fields/MissionFormFields';

interface BrandInformationProps {
  form: ReturnType<typeof useFormContext<MissionFormData>>;
  merchantLogoFile: File | null;
  setMerchantLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  bannerImageFile: File | null;
  setBannerImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const BrandInformation = ({ 
  form, 
  merchantLogoFile, 
  setMerchantLogoFile, 
  bannerImageFile, 
  setBannerImageFile 
}: BrandInformationProps) => {
  const { merchantLogoRef, bannerImageRef, handleFileChange } = useMissionFormFields({
    merchantLogoFile,
    setMerchantLogoFile,
    bannerImageFile,
    setBannerImageFile
  });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Brand Information (Optional)</h3>
      
      <FormField
        control={form.control}
        name="merchantName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merchant Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter brand or merchant name" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="merchantLogo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merchant Logo</FormLabel>
            <div className="space-y-2">
              {field.value && (
                <div className="w-20 h-20 rounded border overflow-hidden">
                  <img 
                    src={field.value}
                    alt="Merchant logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <input 
                type="file" 
                ref={merchantLogoRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setMerchantLogoFile)}
              />
              
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => merchantLogoRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                
                {merchantLogoFile && (
                  <span className="text-sm text-gray-500">
                    {merchantLogoFile.name}
                  </span>
                )}
              </div>
              
              <FormControl>
                <Input 
                  placeholder="Or enter logo URL" 
                  {...field} 
                  value={field.value || ''}
                  className="mt-2"
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bannerImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner Image</FormLabel>
            <div className="space-y-2">
              {field.value && (
                <div className="h-32 rounded border overflow-hidden">
                  <img 
                    src={field.value}
                    alt="Banner image" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <input 
                type="file" 
                ref={bannerImageRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setBannerImageFile)}
              />
              
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => bannerImageRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Banner
                </Button>
                
                {bannerImageFile && (
                  <span className="text-sm text-gray-500">
                    {bannerImageFile.name}
                  </span>
                )}
              </div>
              
              <FormControl>
                <Input 
                  placeholder="Or enter banner image URL" 
                  {...field} 
                  value={field.value || ''}
                  className="mt-2"
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BrandInformation;
