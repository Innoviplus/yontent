
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { pointsTransactionSchema, PointsTransactionFormValues } from "@/components/admin/points/PointsFormCard";
import { addPointsToUser, fetchUsersWithPoints, setUserAsSuperAdmin, addInitialPointsToUser } from "@/services/admin/pointTransactionService";

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
  
  // Mutation for adding points
  const addPointsMutation = useMutation({
    mutationFn: (values: PointsTransactionFormValues) => 
      addPointsToUser(values.userId, values.amount, values.type, values.description),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success(`Successfully added ${variables.amount} points to user`);
        
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
          userId: variables.userId
        });
      } else {
        toast.error(`Error adding points: ${result.error}`);
      }
    },
    onError: (error: any) => {
      console.error("Error in addPointsMutation:", error);
      toast.error(`Error adding points: ${error.message || "Unknown error"}`);
    }
  });
  
  // Mutation for setting user as super admin
  const setSuperAdminMutation = useMutation({
    mutationFn: setUserAsSuperAdmin,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("User has been set as Super Admin successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users-for-points"] });
      } else {
        toast.error(`Failed to set user as Super Admin: ${result.error}`);
      }
    },
    onError: (error: any) => {
      toast.error(`Error setting Super Admin: ${error.message || "Unknown error"}`);
    }
  });
  
  // Mutation for adding initial points to a user
  const addInitialPointsMutation = useMutation({
    mutationFn: addInitialPointsToUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Successfully added 100 initial points to user");
        queryClient.invalidateQueries({ queryKey: ["admin-users-for-points"] });
      } else {
        toast.error(`Failed to add initial points: ${result.error}`);
      }
    },
    onError: (error: any) => {
      toast.error(`Error adding initial points: ${error.message || "Unknown error"}`);
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
    console.log("Submitting form values:", values);
    addPointsMutation.mutate(values);
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
  
  // Handler for setting a user as super admin
  const handleSetAsSuperAdmin = (userId: string) => {
    setSuperAdminMutation.mutate(userId);
  };
  
  // Handler for adding initial points to a specific user
  const handleAddInitialPoints = (username: string) => {
    addInitialPointsMutation.mutate(username);
  };
  
  return {
    users,
    isLoading,
    selectedUser,
    form,
    handleAddPoints,
    handleSelectUser,
    handleClearUser,
    handleSetAsSuperAdmin,
    handleAddInitialPoints,
    isAddingPoints: addPointsMutation.isPending,
    isSettingSuperAdmin: setSuperAdminMutation.isPending,
    isAddingInitialPoints: addInitialPointsMutation.isPending
  };
};
