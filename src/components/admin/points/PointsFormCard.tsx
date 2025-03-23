
import { FormEvent } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { CreditCard, Loader2 } from "lucide-react";
import { z } from "zod";

// Schema for the form
const pointsTransactionSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  type: z.enum(["EARNED", "ADJUSTED"]),
  description: z.string().min(1, "Description is required"),
  userId: z.string().min(1, "User is required")
});

type PointsTransactionFormValues = z.infer<typeof pointsTransactionSchema>;

interface PointsFormCardProps {
  form: UseFormReturn<PointsTransactionFormValues>;
  onSubmit: (values: PointsTransactionFormValues) => Promise<void>;
  isUserSelected: boolean;
  isSubmitting?: boolean;
}

const PointsFormCard = ({ form, onSubmit, isUserSelected, isSubmitting = false }: PointsFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Points</CardTitle>
      </CardHeader>
      <CardContent>
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
                      <SelectItem value="EARNED">Earned Points</SelectItem>
                      <SelectItem value="ADJUSTED">Manual Adjustment</SelectItem>
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
                      placeholder="Reason for awarding points..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="hidden" {...form.register('userId')} />
            
            <Button 
              type="submit" 
              className="w-full bg-brand-teal hover:bg-brand-teal/90"
              disabled={!isUserSelected || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" /> 
                  Add Points
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        Points will be immediately added to the user's account and a transaction record will be created.
      </CardFooter>
    </Card>
  );
};

export default PointsFormCard;
export { pointsTransactionSchema, type PointsTransactionFormValues };
