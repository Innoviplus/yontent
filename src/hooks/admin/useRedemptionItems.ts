
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionItem } from '@/types/redemption';
import { toast } from 'sonner';

export const useRedemptionItems = () => {
  const [items, setItems] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      console.error("Error fetching redemption items:", error.message);
      toast.error("Failed to load redemption items");
    } finally {
      setIsLoading(false);
    }
  };

  const saveItem = async (item: RedemptionItem) => {
    setIsSaving(true);
    try {
      let response;
      
      if (item.id) {
        // Update existing item
        response = await supabase
          .from('redemption_items')
          .update({
            name: item.name,
            description: item.description,
            points_required: item.points_required,
            image_url: item.image_url,
            is_active: item.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
      } else {
        // Create new item
        response = await supabase
          .from('redemption_items')
          .insert([{
            name: item.name,
            description: item.description,
            points_required: item.points_required,
            image_url: item.image_url,
            is_active: item.is_active || true
          }]);
      }

      if (response.error) {
        throw response.error;
      }

      toast.success(item.id ? "Item updated successfully" : "Item created successfully");
      await fetchItems(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error("Error saving redemption item:", error.message);
      toast.error("Failed to save redemption item");
      return false;
    } finally {
      setIsSaving(false);
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
      
      toast.success(`Item is now ${!currentStatus ? 'active' : 'inactive'}`);
      return true;
    } catch (error: any) {
      console.error("Error updating item status:", error.message);
      toast.error("Failed to update item status");
      return false;
    }
  };

  const deleteItem = async (id: string) => {
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
      
      toast.success("Item deleted successfully");
      return true;
    } catch (error: any) {
      console.error("Error deleting item:", error.message);
      toast.error("Failed to delete item");
      return false;
    }
  };

  return {
    items,
    isLoading,
    isSaving,
    fetchItems,
    saveItem,
    toggleItemStatus,
    deleteItem
  };
};
