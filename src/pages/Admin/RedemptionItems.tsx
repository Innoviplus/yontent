
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Pencil, Trash2, Gift } from "lucide-react";
import { toast } from "sonner";

// Define schema for redemption item form
const redemptionItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  points_required: z.coerce.number().min(1, "Points must be at least 1"),
  image_url: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  is_active: z.boolean().default(true)
});

type RedemptionItemFormValues = z.infer<typeof redemptionItemSchema>;

const RedemptionItems = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Set up form
  const form = useForm<RedemptionItemFormValues>({
    resolver: zodResolver(redemptionItemSchema),
    defaultValues: {
      name: "",
      description: "",
      points_required: 100,
      image_url: "",
      is_active: true
    }
  });
  
  // Query to fetch redemption items
  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["redemption-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redemption_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Submit handler for adding a new item
  const handleAddItem = async (values: RedemptionItemFormValues) => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .insert([values]);
        
      if (error) throw error;
      
      toast.success("Redemption item added successfully");
      setIsAddDialogOpen(false);
      form.reset();
      refetch();
    } catch (error: any) {
      toast.error(`Error adding item: ${error.message}`);
    }
  };
  
  // Submit handler for editing an item
  const handleEditItem = async (values: RedemptionItemFormValues) => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .update(values)
        .eq('id', currentItem.id);
        
      if (error) throw error;
      
      toast.success("Redemption item updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Error updating item: ${error.message}`);
    }
  };
  
  // Handler for deleting an item
  const handleDeleteItem = async () => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .delete()
        .eq('id', currentItem.id);
        
      if (error) throw error;
      
      toast.success("Redemption item deleted successfully");
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Error deleting item: ${error.message}`);
    }
  };
  
  // Set up edit form
  const handleEditClick = (item: any) => {
    setCurrentItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      points_required: item.points_required,
      image_url: item.image_url || "",
      is_active: item.is_active
    });
    setIsEditDialogOpen(true);
  };
  
  // Set up delete confirmation
  const handleDeleteClick = (item: any) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
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
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-teal hover:bg-brand-teal/90">
              <Plus className="h-4 w-4 mr-2" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Redemption Item</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
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
                        <Textarea placeholder="Redeem for a $10 gift card..." {...field} />
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
                        <Input type="number" {...field} />
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
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
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Item</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Redemption Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditClick(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteClick(item)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {!item.is_active && (
                <div className="text-xs font-medium text-red-500 mt-1">Inactive</div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <Gift className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-500 line-clamp-3">{item.description}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm font-medium">
                  <span className="text-gray-500">Required: </span>
                  <span>{item.points_required} points</span>
                </div>
                <div className="text-xs text-gray-500">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {items?.length === 0 && (
          <div className="col-span-full text-center py-12 border rounded-lg bg-gray-50">
            <Gift className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No redemption items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first redemption item.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Redemption Item
            </Button>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Redemption Item</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
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
                      <Input type="number" {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p>Are you sure you want to delete "{currentItem?.name}"? This action cannot be undone.</p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedemptionItems;
