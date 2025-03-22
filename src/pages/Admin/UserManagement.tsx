
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
import { Loader2, Search, User, Check, X } from "lucide-react";
import { toast } from "sonner";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          extended_data: { 
            ...users?.find(u => u.id === userId)?.extended_data,
            isDisabled: !isActive 
          } 
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`User ${isActive ? 'disabled' : 'enabled'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(`Error updating user: ${error.message}`);
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
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="mb-6 flex">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users by username..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => {
              const isDisabled = user.extended_data?.isDisabled === true;
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
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
                      {user.username || 'Anonymous'}
                    </div>
                  </TableCell>
                  <TableCell>{user.points || 0}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDisabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, !isDisabled)}
                      >
                        {isDisabled ? (
                          <><Check className="h-4 w-4 mr-1" /> Enable</>
                        ) : (
                          <><X className="h-4 w-4 mr-1" /> Disable</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/admin/points?userId=${user.id}`}>Add Points</a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {filteredUsers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
