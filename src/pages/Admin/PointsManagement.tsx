
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search, User, CreditCard } from "lucide-react";
import { toast } from "sonner";

// Define schema for points transaction form
const pointsTransactionSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  type: z.enum(["EARNED", "ADJUSTED"]),
  description: z.string().min(1, "Description is required"),
  userId: z.string().min(1, "User is required")
});

type PointsTransactionFormValues = z.infer<typeof pointsTransactionSchema>;

const PointsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
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
  
  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
      
      // Start a transaction for atomicity
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
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    form.setValue('userId', user.id);
    setSearchQuery("");
  };
  
  // Handler for clearing selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    form.setValue('userId', "");
    navigate('/admin/points');
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
      <h1 className="text-2xl font-bold mb-6">Points Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Search */}
        <Card>
          <CardHeader>
            <CardTitle>Select User</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {selectedUser.avatar ? (
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.username || ''} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{selectedUser.username || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">Current points: {selectedUser.points}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearUser}>
                  Change
                </Button>
              </div>
            ) : (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search users by username..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {filteredUsers?.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No users found
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredUsers?.map(user => (
                        <div 
                          key={user.id} 
                          className="p-3 flex items-center hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.username || ''} 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.username || 'Anonymous'}</div>
                            <div className="text-xs text-gray-500">Points: {user.points}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Points Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Points</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddPoints)} className="space-y-4">
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
                  disabled={!selectedUser}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> 
                  Add Points
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="border-t pt-4 text-xs text-gray-500">
            Points will be immediately added to the user's account and a transaction record will be created.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PointsManagement;
