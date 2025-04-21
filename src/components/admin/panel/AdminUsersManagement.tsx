
import { useState, useEffect } from "react";
import { fetchAllUsersWithRoles, grantAdminRole, revokeAdminRole } from "@/services/admin/users";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUserSearch } from "@/hooks/admin/useUserSearch";
import { UserSearchForm } from "./users/UserSearchForm";
import { UsersTable } from "./users/UsersTable";

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

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    searching,
    searchError,
    handleSearch
  } = useUserSearch();

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
      await grantAdminRole(user_id);
      toast.success("Granted admin rights");
      
      // Update local state
      const updateUserList = (list: UserWithRoles[]) => 
        list.map(user => 
          user.id === user_id 
            ? { ...user, roles: [...user.roles, 'admin'] } 
            : user
        );
      
      setUsers(updateUserList);
      if (searchResults.length > 0) {
        setSearchResults(updateUserList);
      }
      
      await fetchUsers();
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
      await revokeAdminRole(user_id);
      toast.info("Revoked admin rights");
      
      // Update local state
      const updateUserList = (list: UserWithRoles[]) => 
        list.map(user => 
          user.id === user_id 
            ? { ...user, roles: user.roles.filter(role => role !== 'admin') } 
            : user
        );
      
      setUsers(updateUserList);
      if (searchResults.length > 0) {
        setSearchResults(updateUserList);
      }
      
      await fetchUsers();
    } catch (error: any) {
      console.error("Error revoking admin role:", error);
      toast.error(error?.message || "Failed to revoke admin rights");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <UserSearchForm
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSubmit={handleSearchSubmit}
        searching={searching}
      />
      
      {searchError && (
        <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-sm text-red-700">{searchError}</div>
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-md font-medium mb-4">Search Results</h3>
          <UsersTable
            users={searchResults}
            updatingUserId={updatingUserId}
            onGrant={handleGrant}
            onRevoke={handleRevoke}
          />
        </div>
      )}
      
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
        
        <UsersTable
          users={users}
          updatingUserId={updatingUserId}
          onGrant={handleGrant}
          onRevoke={handleRevoke}
        />
        
        {loading && <div className="text-center text-gray-400 my-2">Loading users...</div>}
        {!loading && !error && users.length === 0 && (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersManagement;
