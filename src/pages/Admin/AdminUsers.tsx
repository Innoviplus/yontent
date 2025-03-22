
import { useState, useEffect } from "react";
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
import { Loader2, Search, User, Shield, ShieldX } from "lucide-react";
import { toast } from "sonner";

// Define the schema for admin user
const adminUserSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
});

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const form = useForm<z.infer<typeof adminUserSchema>>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      username: "",
    },
  });
  
  const { data: adminUsers, isLoading, refetch } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .filter('extended_data->isAdmin', 'eq', true);
        
      if (error) throw error;
      
      // Set yyleung as admin if not already
      if (!data.some(user => user.username === 'yyleung')) {
        const { data: yyleungData, error: findError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', 'yyleung')
          .maybeSingle();
        
        if (yyleungData && !findError) {
          const extendedData = {
            ...(yyleungData.extended_data || {}),
            isAdmin: true
          };
          
          await supabase
            .from('profiles')
            .update({ extended_data: extendedData })
            .eq('id', yyleungData.id);
            
          // Add yyleung to the list
          data.push({
            ...yyleungData,
            extended_data: extendedData
          });
        }
      }
      
      return data || [];
    }
  });
  
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["non-admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .filter('extended_data->isAdmin', 'not.eq', true)
        .order('username', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const onSubmit = async (values: z.infer<typeof adminUserSchema>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', values.username)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) {
        toast.error(`User ${values.username} not found`);
        return;
      }
      
      // Update user's extended data to include isAdmin: true
      const extendedData = {
        ...(data.extended_data || {}),
        isAdmin: true
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: extendedData })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      toast.success(`${values.username} added as admin`);
      form.reset();
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const removeAdmin = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to remove admin privileges from ${username}?`)) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Don't allow removing yyleung as admin
      if (data.username === 'yyleung') {
        toast.error(`Cannot remove admin privileges from ${data.username}`);
        return;
      }
      
      // Remove isAdmin from extended data
      const extendedData = { ...(data.extended_data || {}) };
      delete extendedData.isAdmin;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: extendedData })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      toast.success(`Admin privileges removed from ${username}`);
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  const makeAdmin = async (user: any) => {
    try {
      // Update user's extended data to include isAdmin: true
      const extendedData = {
        ...(user.extended_data || {}),
        isAdmin: true
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ extended_data: extendedData })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success(`${user.username} added as admin`);
      setSearchQuery("");
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
      <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Current Admin Users</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers?.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {admin.avatar ? (
                          <img 
                            src={admin.avatar} 
                            alt={admin.username || ''} 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{admin.username || 'Anonymous'}</div>
                          {admin.username === 'yyleung' && (
                            <div className="text-xs text-gray-500">Super Admin</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.username !== 'yyleung' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAdmin(admin.id, admin.username)}
                        >
                          <ShieldX className="h-4 w-4 mr-1" /> Remove Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {adminUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No admin users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Add Admin User</h2>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search for a user to make admin..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchQuery && !loadingUsers && (
              <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                {filteredUsers?.length === 0 && (
                  <div className="p-2 text-center text-gray-500">
                    No users found
                  </div>
                )}
                
                {filteredUsers?.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => makeAdmin(user)}
                    >
                      <Shield className="h-4 w-4 mr-1" /> Make Admin
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-2">Or Enter Username Directly</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Add as Admin
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
