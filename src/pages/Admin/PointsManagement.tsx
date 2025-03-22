import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Loader2, User, Search } from "lucide-react";
import { toast } from "sonner";

// Define the schema for points addition
const pointsSchema = z.object({
  userId: z.string().uuid("Please select a valid user"),
  amount: z.number().min(1, "Amount must be at least 1"),
  description: z.string().min(2, "Please enter a description"),
});

const PointsManagement = () => {
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get('userId');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const form = useForm<z.infer<typeof pointsSchema>>({
    resolver: zodResolver(pointsSchema),
    defaultValues: {
      userId: preselectedUserId || "",
      amount: 50,
      description: "Admin adjustment",
    },
  });
  
  // Fetch users for the dropdown
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .order('username', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // If a user ID is preselected, fetch that user's details
  useEffect(() => {
    if (preselectedUserId) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar')
          .eq('id', preselectedUserId)
          .single();
          
        if (!error && data) {
          setSelectedUser(data);
          form.setValue('userId', data.id);
        }
      };
      
      fetchUser();
    }
  }, [preselectedUserId, form]);
  
  const filteredUsers = users?.filter(user => 
    !searchQuery || user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectUser = (user: any) => {
    setSelectedUser(user);
    form.setValue('userId', user.id);
    setSearchQuery("");
  };
  
  const onSubmit = async (values: z.infer<typeof pointsSchema>) => {
    try {
      // First, update the user's points
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', values.userId)
        .single();
        
      if (userError) throw userError;
      
      const currentPoints = userData.points || 0;
      const newPoints = currentPoints + values.amount;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', values.userId);
        
      if (updateError) throw updateError;
      
      // Then, record the points transaction
      const { error: transactionError } = await supabase
        .from('point_transactions')
        .insert({
          user_id: values.userId,
          amount: values.amount,
          type: 'EARNED',
          source: 'ADMIN_ADJUSTMENT',
          description: values.description,
        });
        
      if (transactionError) throw transactionError;
      
      toast.success(`${values.amount} points added successfully to ${selectedUser?.username}`);
      
      // Reset form but keep the selected user
      form.reset({
        userId: values.userId,
        amount: 50,
        description: "Admin adjustment",
      });
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
      <h1 className="text-2xl font-bold mb-6">Points Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Add Points to User</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    {selectedUser ? (
                      <div className="flex items-center p-2 border rounded-md">
                        {selectedUser.avatar ? (
                          <img 
                            src={selectedUser.avatar} 
                            alt={selectedUser.username} 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span>{selectedUser.username}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            setSelectedUser(null);
                            form.setValue('userId', '');
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Search for a user..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        {searchQuery && (
                          <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                            {filteredUsers?.length === 0 && (
                              <div className="p-2 text-center text-gray-500">
                                No users found
                              </div>
                            )}
                            
                            {filteredUsers?.map(user => (
                              <div
                                key={user.id}
                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectUser(user)}
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
                                <span>{user.username || 'Anonymous'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin adjustment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={!selectedUser}
              >
                Add Points
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Points Management Guide</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">When to Add Points</h3>
              <p className="text-gray-600">
                Add points manually as rewards for special achievements, contest winners, or to correct discrepancies in user point balances.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Suggested Point Values</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Contest winner: 100-500 points</li>
                <li>Special achievement: 50-200 points</li>
                <li>Error correction: As needed</li>
                <li>Welcome bonus: 50 points</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Description Best Practices</h3>
              <p className="text-gray-600">
                Always include a clear description of why points were added. This creates transparency for both admins and users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsManagement;
