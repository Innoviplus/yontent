import React from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Database, Loader2 } from "lucide-react";
import { z } from "zod";

// Updated schema with simplified transaction types
const transactionSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  type: z.enum(["ADD", "DEDUCT"]),
  source: z.literal("ADMIN_ADJUSTMENT"),
  description: z.string().min(1, "Description is required"),
  userId: z.string().min(1, "User is required")
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormCardProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  isUserSelected: boolean;
  isSubmitting?: boolean;
}

const TransactionFormCard = ({ 
  form, 
  onSubmit, 
  isUserSelected, 
  isSubmitting = false 
}: TransactionFormCardProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADD">Manual Adjustment (Add Points)</SelectItem>
                  <SelectItem value="DEDUCT">Manual Adjustment (Deduct Points)</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="Reason for this adjustment..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register('userId')} />
        <input type="hidden" {...form.register('source')} value="ADMIN_ADJUSTMENT" />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isUserSelected || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Processing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" /> 
              Submit Points Adjustment
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionFormCard;
export { transactionSchema, type TransactionFormValues };
