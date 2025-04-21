
import { useEffect, useState } from "react";
import { fetchAllUsersWithRoles, grantAdminRole, revokeAdminRole } from "@/services/admin/users";
import { Button } from "@/components/ui/button";
import { Shield, User, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AdminUsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const all = await fetchAllUsersWithRoles();
    setUsers(all);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGrant = async (user_id: string) => {
    setUpdatingUserId(user_id);
    await grantAdminRole(user_id);
    toast.success("Granted admin rights");
    await fetchUsers();
    setUpdatingUserId(null);
  };

  const handleRevoke = async (user_id: string) => {
    setUpdatingUserId(user_id);
    await revokeAdminRole(user_id);
    toast.info("Revoked admin rights");
    await fetchUsers();
    setUpdatingUserId(null);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mt-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-brand-teal" />
        <h2 className="text-lg font-semibold">Admin Users Management</h2>
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-700 border-b">
            <th className="py-2">Username</th>
            <th className="py-2">Email</th>
            <th className="py-2">Roles</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="py-2">{u.username || <span className="font-mono text-xs text-gray-400">N/A</span>}</td>
              <td className="py-2">{u.email || <span className="font-mono text-xs text-gray-400">N/A</span>}</td>
              <td className="py-2">{u.roles.join(", ")}</td>
              <td className="py-2">
                {u.roles.includes("admin") ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleRevoke(u.id)}
                    disabled={updatingUserId === u.id}
                  >
                    <UserMinus className="w-4 h-4" />
                    Revoke Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleGrant(u.id)}
                    disabled={updatingUserId === u.id}
                  >
                    <UserPlus className="w-4 h-4" />
                    Grant Admin
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="text-center text-gray-400 my-2">Loading users...</div>}
    </div>
  );
};

export default AdminUsersManagement;
