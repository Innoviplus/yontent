
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

// Define the schema for redemption items
const redemptionItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  points_required: z.number().min(1, "Points must be at least 1"),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

const RedemptionItems = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const form = useForm<z.infer<typeof redemptionItemSchema>>({
    resolver: zodResolver(redemptionItemSchema),
    defaultValues: {
      name: "",
      description: "",
      points_required: 100,
      image_url: "",
      is_active: true,
    },
  });
  
  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["redemption-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redemption_items')
        .select('*')
        .order('points_required', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const openEditDialog = (item: any) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      points_required: item.points_required,
      image_url: item.image_url || "",
      is_active: item.is_active,
    });
    setOpenDialog(true);
  };
  
  const openCreateDialog = () => {
    setEditingItem(null);
    form.reset({
      name: "",
      description: "",
      points_required: 100,
      image_url: "",
      is_active: true,
    });
    setOpenDialog(true);
  };
  
  const onSubmit = async (values: z.infer<typeof redemptionItemSchema>) => {
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('redemption_items')
          .update(values)
          .eq('id', editingItem.id);
          
        if (error) throw error;
        toast.success("Redemption item updated successfully");
      } else {
        // Create new item
        const { error } = await supabase
          .from('redemption_items')
          .insert(values);
          
        if (error) throw error;
        toast.success("Redemption item created successfully");
      }
      
      setOpenDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redemption item?")) return;
    
    try {
      const { error } = await supabase
        .from('redemption_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success("Redemption item deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Redemption Items</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Redemption Item" : "Create Redemption Item"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Gift Card" {...field} />
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
                      <Input placeholder="Redeem for a $10 gift card" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="points_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Required</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="form-checkbox h-4 w-4 text-brand-teal"
                      />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Points Required</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.points_required}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No redemption items found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RedemptionItems;
