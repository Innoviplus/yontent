
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  id: string;
  username?: string;
  avatar?: string;
  points: number;
}

interface UserSearchCardProps {
  users: UserData[] | undefined;
  isLoading: boolean;
  selectedUser: UserData | null;
  onSelectUser: (user: UserData) => void;
  onClearUser: () => void;
}

const UserSearchCard = ({ 
  users, 
  isLoading, 
  selectedUser, 
  onSelectUser, 
  onClearUser 
}: UserSearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select User</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedUser ? (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {selectedUser.avatar ? (
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username || ''} />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
              <div className="ml-3">
                <div className="font-medium">{selectedUser.username || 'Anonymous'}</div>
                <div className="text-sm text-gray-500">Current points: {selectedUser.points}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClearUser}>
              Change
            </Button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users by username..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {filteredUsers?.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers?.map(user => (
                    <div 
                      key={user.id} 
                      className="p-3 flex items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectUser(user)}
                    >
                      {user.avatar ? (
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarImage src={user.avatar} alt={user.username || ''} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="font-medium">{user.username || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">Points: {user.points}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSearchCard;
