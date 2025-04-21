
import { useEffect, useState } from "react";
import { fetchAllUsersWithRoles, grantAdminRole, revokeAdminRole, searchUsersByUsernameOrEmail } from "@/services/admin/users";
import { Button } from "@/components/ui/button";
import { Shield, User, UserMinus, UserPlus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserWithRoles = {
  id: string;
  username: string | null;
  email: string | null;
  roles: string[];
};

const AdminUsersManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserWithRoles[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching all users with roles...");
      const all = await fetchAllUsersWithRoles();
      console.log(`Fetched ${all.length} users`);
      setUsers(all);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error?.message || "Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGrant = async (user_id: string) => {
    setUpdatingUserId(user_id);
    try {
      console.log(`Granting admin role to user ${user_id}`);
      await grantAdminRole(user_id);
      toast.success("Granted admin rights");
      
      // Update local state before refetching
      setUsers(prev => prev.map(user => 
        user.id === user_id 
          ? { ...user, roles: [...user.roles, 'admin'] } 
          : user
      ));
      
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        setSearchResults(prev => prev.map(user => 
          user.id === user_id 
            ? { ...user, roles: [...user.roles, 'admin'] } 
            : user
        ));
      }

      // Then refetch to ensure consistency
      await fetchUsers();
      
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        handleSearch(searchQuery);
      }
    } catch (error: any) {
      console.error("Error granting admin role:", error);
      toast.error(error?.message || "Failed to grant admin rights");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRevoke = async (user_id: string) => {
    setUpdatingUserId(user_id);
    try {
      console.log(`Revoking admin role from user ${user_id}`);
      await revokeAdminRole(user_id);
      toast.info("Revoked admin rights");
      
      // Update local state before refetching
      setUsers(prev => prev.map(user => 
        user.id === user_id 
          ? { ...user, roles: user.roles.filter(role => role !== 'admin') } 
          : user
      ));
      
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        setSearchResults(prev => prev.map(user => 
          user.id === user_id 
            ? { ...user, roles: user.roles.filter(role => role !== 'admin') } 
            : user
        ));
      }

      // Then refetch to ensure consistency
      await fetchUsers();
      
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        handleSearch(searchQuery);
      }
    } catch (error: any) {
      console.error("Error revoking admin role:", error);
      toast.error(error?.message || "Failed to revoke admin rights");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      console.log(`Searching users with query: ${query}`);
      const results = await searchUsersByUsernameOrEmail(query);
      console.log(`Found ${results.length} results`);
      setSearchResults(results);
    } catch (error: any) {
      console.error("Error searching users:", error);
      setSearchError(error?.message || "Failed to search users");
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-brand-teal" />
          <h2 className="text-lg font-semibold">Find User to Grant Admin Rights</h2>
        </div>
        <form onSubmit={handleSearchSubmit} className="space-y-4 mb-4">
          <div>
            <Label htmlFor="searchQuery">Search by Username or Email</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input
                id="searchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username or email"
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={searching || !searchQuery.trim()} 
                className="min-w-24"
              >
                {searching ? "Searching..." : "Search"}
                {!searching && <Search className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>

        {searchError && (
          <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-sm text-red-700">{searchError}</div>
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Search Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username || <span className="font-mono text-xs text-gray-400">N/A</span>}</TableCell>
                    <TableCell>{user.email || <span className="font-mono text-xs text-gray-400">N/A</span>}</TableCell>
                    <TableCell>{user.roles.join(", ") || "—"}</TableCell>
                    <TableCell>
                      {user.roles.includes("admin") ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleRevoke(user.id)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserMinus className="w-4 h-4" />
                          )}
                          Revoke Admin
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleGrant(user.id)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                          Grant Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-teal" />
            <h2 className="text-lg font-semibold">Admin Users List</h2>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-1">Refresh</span>
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username || <span className="font-mono text-xs text-gray-400">N/A</span>}</TableCell>
                <TableCell>{user.email || <span className="font-mono text-xs text-gray-400">N/A</span>}</TableCell>
                <TableCell>{user.roles.join(", ") || "—"}</TableCell>
                <TableCell>
                  {user.roles.includes("admin") ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleRevoke(user.id)}
                      disabled={updatingUserId === user.id}
                    >
                      {updatingUserId === user.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserMinus className="w-4 h-4" />
                      )}
                      Revoke Admin
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleGrant(user.id)}
                      disabled={updatingUserId === user.id}
                    >
                      {updatingUserId === user.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      Grant Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {loading && <div className="text-center text-gray-400 my-2">Loading users...</div>}
        {!loading && !error && users.length === 0 && (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersManagement;
