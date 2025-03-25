
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
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

const cashOutSchema = z.object({
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  account_name: z.string().min(1, { message: 'Account name is required' }),
  account_number: z.string().min(5, { message: 'Valid account number is required' }),
  swift_code: z.string().optional(),
  recipient_name: z.string().min(1, { message: 'Recipient name is required' }),
  recipient_address: z.string().optional(),
  recipient_mobile: z.string().optional()
});

type CashOutFormData = z.infer<typeof cashOutSchema>;

interface CashOutFormProps {
  onSubmit: (data: CashOutFormData) => void;
  onCancel: () => void;
  pointsAmount: number;
}

const CashOutForm = ({ onSubmit, onCancel, pointsAmount }: CashOutFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CashOutFormData>({
    resolver: zodResolver(cashOutSchema),
    defaultValues: {
      bank_name: '',
      account_name: '',
      account_number: '',
      swift_code: '',
      recipient_name: '',
      recipient_address: '',
      recipient_mobile: ''
    }
  });

  const handleSubmit = (data: CashOutFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cash Out Request</DialogTitle>
          <DialogDescription>
            Please provide your bank account details for the cash out transfer of {pointsAmount} points
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="swift_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SWIFT code" {...field} />
                  </FormControl>
                  <FormDescription>
                    Required for international transfers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recipient_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recipient_mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Mobile Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipient mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CashOutForm;
