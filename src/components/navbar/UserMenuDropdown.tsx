
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/contexts/PointsContext";
import { Link } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import PointsBadge from "@/components/PointsBadge";

const UserMenuDropdown = () => {
  const { user, userProfile, signOut } = useAuth();
  const { userPoints } = usePoints();
  
  if (!user) return null;
  
  const username = userProfile?.username || 'User';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={userProfile?.avatar} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-700">{username}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <div className="px-2 py-1.5 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Point balance:</span>
          <PointsBadge points={userPoints} size="sm" />
        </div>
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" /> My Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
