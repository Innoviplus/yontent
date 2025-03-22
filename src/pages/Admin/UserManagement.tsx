
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
import { Switch } from '@/components/ui/switch';
import { Shield, Search, UserCog } from 'lucide-react';

type UserProfile = {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  created_at?: string;
  points?: number;
  extended_data?: Record<string, any> | null;
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, email, created_at, points, extended_data')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setUsers(data as UserProfile[]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isCurrentlyDisabled: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          extended_data: {
            ...users.find(u => u.id === userId)?.extended_data,
            isDisabled: !isCurrentlyDisabled
          }
        })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            extended_data: {
              ...user.extended_data,
              isDisabled: !isCurrentlyDisabled
            }
          };
        }
        return user;
      }));
      
      toast({
        title: "User status updated",
        description: `User has been ${isCurrentlyDisabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          extended_data: {
            ...users.find(u => u.id === userId)?.extended_data,
            isAdmin: !isCurrentlyAdmin
          }
        })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            extended_data: {
              ...user.extended_data,
              isAdmin: !isCurrentlyAdmin
            }
          };
        }
        return user;
      }));
      
      toast({
        title: "Admin status updated",
        description: `User is now ${!isCurrentlyAdmin ? 'an admin' : 'not an admin'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
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
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">No users found</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                // Access extended_data properties safely
                const extendedData = user.extended_data || {};
                const isDisabled = extendedData.isDisabled === true;
                const isAdmin = extendedData.isAdmin === true;
                
                return (
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
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.points || 0}</TableCell>
                    <TableCell>
                      <Badge className={isDisabled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {isDisabled ? "Disabled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={!isDisabled} 
                          onCheckedChange={() => toggleUserStatus(user.id, isDisabled)}
                          aria-label="Toggle user status"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAdminStatus(user.id, isAdmin)}
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          {isAdmin ? "Remove Admin" : "Make Admin"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
