
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { pointsTransactionSchema, PointsTransactionFormValues } from "@/components/admin/points/PointsFormCard";
import { addPointsToUser, fetchUsersWithPoints } from "@/services/admin/pointTransactionService";

interface UserData {
  id: string;
  username?: string;
  avatar?: string;
  points: number;
}

export const usePointsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    queryFn: fetchUsersWithPoints
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
      console.log("Submitting form values:", values);
      
      const result = await addPointsToUser(
        values.userId,
        values.amount,
        values.type,
        values.description
      );

      if (result.success) {
        toast.success(`Successfully added ${values.amount} points to user`);
        
        // Update the selected user's points in the UI
        if (selectedUser) {
          setSelectedUser({
            ...selectedUser,
            points: result.newPointsTotal
          });
        }
        
        // Invalidate the users query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["admin-users-for-points"] });
        
        // Reset form except for userId
        form.reset({
          amount: 50,
          type: "EARNED",
          description: "",
          userId: values.userId
        });
      } else {
        toast.error(`Error adding points: ${result.error}`);
      }
    } catch (error: any) {
      console.error("Error in handleAddPoints:", error);
      toast.error(`Error adding points: ${error.message || "Unknown error"}`);
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
