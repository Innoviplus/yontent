
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Pencil, Trash2 } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';

const RedemptionItems = () => {
  const [items, setItems] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<RedemptionItem>({
    name: '',
    description: '',
    points_required: 0,
    image_url: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('redemption_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching redemption items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentItem.name || !currentItem.description || !currentItem.points_required) {
        toast({
          title: "Missing information",
          description: "Please fill all required fields.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      
      let response;
      
      if (isEditing && currentItem.id) {
        // Update existing item
        response = await supabase
          .from('redemption_items')
          .update({
            name: currentItem.name,
            description: currentItem.description,
            points_required: currentItem.points_required,
            image_url: currentItem.image_url,
            is_active: currentItem.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentItem.id);
      } else {
        // Create new item
        response = await supabase
          .from('redemption_items')
          .insert([{
            name: currentItem.name,
            description: currentItem.description,
            points_required: currentItem.points_required,
            image_url: currentItem.image_url,
            is_active: currentItem.is_active
          }]);
      }

      if (response.error) {
        throw response.error;
      }

      // Reset form and refresh data
      setCurrentItem({
        name: '',
        description: '',
        points_required: 0,
        image_url: '',
        is_active: true
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      fetchItems();
      
      toast({
        title: isEditing ? "Item updated" : "Item created",
        description: `Successfully ${isEditing ? 'updated' : 'created'} redemption item.`,
      });
    } catch (error: any) {
      toast({
        title: "Error saving item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: RedemptionItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const { error } = await supabase
        .from('redemption_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: "Item deleted",
        description: "Redemption item has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleItemStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update in local state
      setItems(items.map(item => 
        item.id === id ? { ...item, is_active: !currentStatus } : item
      ));
      
      toast({
        title: "Status updated",
        description: `Item is now ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Redemption Items</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setCurrentItem({
                name: '',
                description: '',
                points_required: 0,
                image_url: '',
                is_active: true
              });
            }}>
              <Plus className="h-4 w-4 mr-2" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Redemption Item" : "Add New Redemption Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={currentItem.name}
                  onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
                  placeholder="Item name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={currentItem.description}
                  onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                  placeholder="Item description"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="points" className="text-sm font-medium">Points Required</label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={currentItem.points_required}
                  onChange={e => setCurrentItem({...currentItem, points_required: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL (optional)</label>
                <Input
                  id="image"
                  value={currentItem.image_url || ''}
                  onChange={e => setCurrentItem({...currentItem, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentItem.is_active}
                  onCheckedChange={checked => setCurrentItem({...currentItem, is_active: checked})}
                />
                <label htmlFor="active" className="text-sm font-medium">Active</label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && items.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p>Loading redemption items...</p>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-40">
            <Gift className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">No redemption items found.</p>
            <p className="text-gray-400 text-sm">Click "Add New Item" to create your first redemption item.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-brand-teal/10 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-brand-teal" />
                        </div>
                      )}
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{item.points_required}</TableCell>
                  <TableCell>
                    <Badge className={item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={!!item.is_active} 
                        onCheckedChange={() => toggleItemStatus(item.id!, !!item.is_active)}
                        aria-label="Toggle item status"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id!)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RedemptionItems;
