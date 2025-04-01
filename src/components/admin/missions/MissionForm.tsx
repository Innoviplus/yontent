
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Upload, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import RichTextEditor from '@/components/RichTextEditor';
import { cn } from '@/lib/utils';
import { Mission } from '@/lib/types';
import { missionSchema, MissionFormData } from './MissionFormSchema';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MissionFormProps {
  mission?: Mission;
  title: string;
  onSubmit: (data: MissionFormData, files: { 
    merchantLogo?: File | null, 
    bannerImage?: File | null,
    productImages?: File[] | null 
  }) => Promise<boolean>;
  onCancel: () => void;
  isUploading?: boolean;
}

const MissionForm = ({ 
  mission, 
  title, 
  onSubmit, 
  onCancel,
  isUploading = false
}: MissionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchantLogoFile, setMerchantLogoFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const merchantLogoRef = useRef<HTMLInputElement>(null);
  const bannerImageRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: mission?.title || '',
      description: mission?.description || '',
      pointsReward: mission?.pointsReward || 100,
      type: mission?.type || 'RECEIPT',
      status: mission?.status || 'DRAFT',
      startDate: mission?.startDate ? new Date(mission.startDate) : new Date(),
      expiresAt: mission?.expiresAt ? new Date(mission.expiresAt) : undefined,
      requirementDescription: mission?.requirementDescription || '',
      merchantName: mission?.merchantName || '',
      merchantLogo: mission?.merchantLogo || '',
      bannerImage: mission?.bannerImage || '',
      maxSubmissionsPerUser: mission?.maxSubmissionsPerUser || 1,
      totalMaxSubmissions: mission?.totalMaxSubmissions || undefined,
      termsConditions: mission?.termsConditions || '',
    }
  });

  const handleSubmit = async (data: MissionFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data, {
        merchantLogo: merchantLogoFile,
        bannerImage: bannerImageFile
      });
      if (success) {
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this mission.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mission title" {...field} />
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
                      <RichTextEditor 
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter mission description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Reward</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RECEIPT">Receipt Submission</SelectItem>
                          <SelectItem value="REVIEW">Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Timeline</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() ||
                              date < form.getValues("startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxSubmissionsPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Submissions Per User</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many times can a user complete this mission?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalMaxSubmissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Submission Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="No limit" 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum total submissions allowed for this mission (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Brand Information */}
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

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Additional Details</h3>
              
              <FormField
                control={form.control}
                name="requirementDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirement Description</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter detailed requirements for completing this mission"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter terms and conditions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) ? 'Saving...' : 'Save Mission'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionForm;
