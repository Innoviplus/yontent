
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowLeft, Receipt } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMissionDetails } from '@/hooks/useMissions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { submitReceipt } from '@/services/receiptService';
import { Link } from 'react-router-dom';

// Form validation schema
const receiptSchema = z.object({
  storeTitle: z.string().min(2, { message: "Store name must be at least 2 characters" }),
  purchaseDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  totalAmount: z.string().optional().refine(val => !val || !isNaN(parseFloat(val)), {
    message: "Please enter a valid amount",
  }),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

const SubmitReceipt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const missionId = queryParams.get('missionId');
  
  const { mission, loading: missionLoading } = useMissionDetails(missionId || '');
  
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      storeTitle: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      totalAmount: '',
    },
  });

  // Redirect if no mission ID is provided
  useEffect(() => {
    if (!missionLoading && (!missionId || !mission)) {
      toast.error('No valid mission selected');
      navigate('/missions');
    }
    
    if (mission && mission.type !== 'RECEIPT') {
      toast.error('This mission does not accept receipt submissions');
      navigate(`/missions/${missionId}`);
    }
  }, [missionId, mission, missionLoading, navigate]);

  const onSubmit = async (values: ReceiptFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a receipt');
      return;
    }
    
    if (!missionId) {
      toast.error('No mission selected');
      return;
    }
    
    // Validate that an image is selected
    if (selectedImage.length === 0) {
      setImageError("A receipt image is required");
      return;
    }
    
    try {
      setUploading(true);
      
      await submitReceipt({
        userId: user.id,
        missionId,
        image: selectedImage[0],
        storeTitle: values.storeTitle,
        purchaseDate: new Date(values.purchaseDate),
        totalAmount: values.totalAmount ? parseFloat(values.totalAmount) : undefined
      });
      
      toast.success('Receipt submitted successfully!');
      navigate(`/missions/${missionId}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  if (missionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <Link to={missionId ? `/missions/${missionId}` : '/missions'} className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mission
          </Link>
          
          <div className="flex items-center space-x-2 mb-6">
            <Receipt className="h-6 w-6 text-brand-teal" />
            <h1 className="text-2xl font-bold">Submit Receipt</h1>
          </div>
          
          {mission && (
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">{mission.title}</h2>
              <p className="text-gray-600 mb-4">{mission.requirementDescription}</p>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Receipt Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Receipt Image <span className="text-red-500">*</span></FormLabel>
                  <FileUpload
                    onFilesSelected={(files) => {
                      setSelectedImage(files);
                      if (files.length > 0) {
                        setImageError(null);
                      }
                    }}
                    maxFiles={1}
                    accept="image/*"
                    previewUrls={imagePreviewUrls}
                  />
                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}
                </div>
                
                {/* Store Title */}
                <FormField
                  control={form.control}
                  name="storeTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Purchase Date */}
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Total Amount */}
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter total amount (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-brand-teal hover:bg-brand-teal/90"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : "Submit Receipt"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReceipt;
