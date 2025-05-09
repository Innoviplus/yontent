
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Loader2 } from "lucide-react";
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
  onSearch: (query: string) => void;
}

const UserSearchCard = ({ 
  users, 
  isLoading, 
  selectedUser, 
  onSelectUser, 
  onClearUser,
  onSearch
}: UserSearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Effect to trigger search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        onSearch(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

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
                placeholder="Search users by username or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && searchQuery.length < 2 && (
                <div className="text-xs text-gray-500 mt-1 ml-1">
                  Enter at least 2 characters to search
                </div>
              )}
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </div>
              ) : users?.length === 0 && searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              ) : searchQuery.length < 2 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Start typing to search for users
                </div>
              ) : (
                <div className="divide-y">
                  {users?.map(user => (
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
