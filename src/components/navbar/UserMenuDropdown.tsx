
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
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import PointsBadge from "@/components/PointsBadge";
import { toast } from "sonner";

const UserMenuDropdown = () => {
  const { user, userProfile, signOut } = useAuth();
  const { userPoints, refreshPoints } = usePoints();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const username = userProfile?.username || 'User';
  
  const handleLogout = async () => {
    try {
      console.log("UserMenuDropdown: Attempting to sign out");
      await signOut();
      toast.success("You have been logged out");
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to log out: " + (error.message || "Unknown error"));
    }
  };
  
  // Force refresh points when dropdown is opened
  const handleDropdownOpen = () => {
    refreshPoints();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild onClick={handleDropdownOpen}>
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
        <div className="px-2 py-1.5">
          <div className="text-sm text-gray-500 mb-1">Point balance:</div>
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
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
