
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserMinus, UserPlus } from "lucide-react";

interface UserWithRoles {
  id: string;
  username: string | null;
  email: string | null;
  roles: string[];
}

interface UsersTableProps {
  users: UserWithRoles[];
  updatingUserId: string | null;
  onGrant: (userId: string) => void;
  onRevoke: (userId: string) => void;
}

export function UsersTable({
  users,
  updatingUserId,
  onGrant,
  onRevoke
}: UsersTableProps) {
  return (
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
                  onClick={() => onRevoke(user.id)}
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
                  onClick={() => onGrant(user.id)}
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
  );
}
