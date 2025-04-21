
import { useEffect, useState } from "react";
import { fetchAllUsersWithRoles, grantAdminRole, revokeAdminRole, searchUsersByUsernameOrEmail } from "@/services/admin/users";
import { Button } from "@/components/ui/button";
import { Shield, User, UserMinus, UserPlus, Search } from "lucide-react";
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
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserWithRoles[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const all = await fetchAllUsersWithRoles();
      setUsers(all);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      await grantAdminRole(user_id);
      toast.success("Granted admin rights");
      await fetchUsers();
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error granting admin role:", error);
      toast.error("Failed to grant admin rights");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRevoke = async (user_id: string) => {
    setUpdatingUserId(user_id);
    try {
      await revokeAdminRole(user_id);
      toast.info("Revoked admin rights");
      await fetchUsers();
      // If this was from search results, update those too
      if (searchResults.length > 0) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error revoking admin role:", error);
      toast.error("Failed to revoke admin rights");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsersByUsernameOrEmail(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
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
                          <UserMinus className="w-4 h-4" />
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
                          <UserPlus className="w-4 h-4" />
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
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-brand-teal" />
          <h2 className="text-lg font-semibold">Admin Users List</h2>
        </div>
        
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
                <TableCell>{user.roles.join(", ")}</TableCell>
                <TableCell>
                  {user.roles.includes("admin") ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleRevoke(user.id)}
                      disabled={updatingUserId === user.id}
                    >
                      <UserMinus className="w-4 h-4" />
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
                      <UserPlus className="w-4 h-4" />
                      Grant Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {loading && <div className="text-center text-gray-400 my-2">Loading users...</div>}
        {!loading && users.length === 0 && (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersManagement;
