
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, UserCog } from 'lucide-react';

type UserProfile = {
  id: string;
  username: string;
  avatar?: string;
  created_at?: string;
  extended_data?: Record<string, any> | null;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, created_at, extended_data')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Filter for admin users only
        const adminUsers = data.filter(user => {
          const extendedData = user.extended_data || {};
          // Safely check if extendedData has the isAdmin property as true
          if (typeof extendedData === 'object' && !Array.isArray(extendedData)) {
            return extendedData.isAdmin === true;
          }
          return false;
        });
        setUsers(adminUsers as UserProfile[]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching admin users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAdminStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Make a copy of extended_data or create a new object if it doesn't exist
      const extendedData = user.extended_data ? { ...user.extended_data } : {};
      if (typeof extendedData === 'object' && !Array.isArray(extendedData)) {
        extendedData.isAdmin = false;

        const { error } = await supabase
          .from('profiles')
          .update({
            extended_data: extendedData
          })
          .eq('id', userId);

        if (error) throw error;
        
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
        
        toast({
          title: "Admin status removed",
          description: "User is no longer an admin.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search admin users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">Loading admin users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">No admin users found</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-brand-teal text-white">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Admin
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeAdminStatus(user.id)}
                    >
                      <UserCog className="h-4 w-4 mr-1" />
                      Remove Admin Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
