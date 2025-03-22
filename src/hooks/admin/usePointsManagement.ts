
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { pointsTransactionSchema, PointsTransactionFormValues } from "@/components/admin/points/PointsFormCard";

interface UserData {
  id: string;
  username?: string;
  avatar?: string;
  points: number;
}

export const usePointsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Set up form
  const form = useForm<PointsTransactionFormValues>({
    resolver: zodResolver(pointsTransactionSchema),
    defaultValues: {
      amount: 50,
      type: "EARNED",
      description: "",
      userId: ""
    }
  });
  
  // Query to fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-for-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, points')
        .order('username', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Check for userId in URL and set selected user
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && users) {
      const user = users.find(u => u.id === userId);
      if (user) {
        setSelectedUser(user);
        form.setValue('userId', user.id);
      }
    }
  }, [searchParams, users, form]);
  
  // Submit handler for adding points
  const handleAddPoints = async (values: PointsTransactionFormValues) => {
    try {
      console.log("Adding points to user:", values.userId, "Amount:", values.amount);
      
      // First, fetch the current user points from profiles
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', values.userId)
        .single();
        
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }
      
      console.log("Current user points:", user.points);
      
      // Add the point transaction
      const { error: transactionError } = await supabase
        .from('point_transactions')
        .insert([{
          user_id: values.userId,
          amount: values.amount,
          type: values.type,
          source: 'ADMIN_ADJUSTMENT',
          description: values.description
        }]);
        
      if (transactionError) {
        console.error("Error adding transaction:", transactionError);
        throw transactionError;
      }
      
      // Update user's points directly in the profiles table
      const newPointsTotal = user.points + values.amount;
      console.log("New points total:", newPointsTotal);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: newPointsTotal })
        .eq('id', values.userId);
        
      if (updateError) {
        console.error("Error updating user points:", updateError);
        throw updateError;
      }
      
      // If we get here, everything succeeded
      toast.success(`Successfully added ${values.amount} points to user`);
      
      // Update the selected user's points in the UI
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          points: newPointsTotal
        });
      }
      
      // Reset form except for userId
      form.reset({
        amount: 50,
        type: "EARNED",
        description: "",
        userId: values.userId
      });
      
    } catch (error: any) {
      console.error("Error in handleAddPoints:", error);
      toast.error(`Error adding points: ${error.message}`);
    }
  };
  
  // Handler for selecting a user
  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    form.setValue('userId', user.id);
  };
  
  // Handler for clearing selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    form.setValue('userId', "");
    navigate('/admin/points');
  };
  
  return {
    users,
    isLoading,
    selectedUser,
    form,
    handleAddPoints,
    handleSelectUser,
    handleClearUser
  };
};
