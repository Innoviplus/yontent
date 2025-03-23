
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
import { Link } from "react-router-dom";
import { LogOut, User, Settings, Award, Shield } from "lucide-react";
import PointsBadge from "../PointsBadge";

const UserMenuDropdown = () => {
  const { user, userProfile, signOut } = useAuth();
  
  if (!user) return null;
  
  const username = userProfile?.username || 'User';
  const isAdmin = userProfile?.isAdmin === true;
  
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
            <PointsBadge points={userProfile?.points || 0} size="sm" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/redeem" className="cursor-pointer">
            <Award className="h-4 w-4 mr-2" /> Redeem Points
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administration</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer">
                <Shield className="h-4 w-4 mr-2" /> Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
