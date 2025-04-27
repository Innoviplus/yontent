
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { grantAdminToUser } from "@/scripts/grantAdminToUser";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminAccessButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, refreshUserProfile } = useAuth();

  const handleGrantAdmin = async () => {
    if (!user?.user_metadata?.username) {
      toast.error("Username not found. Please ensure your profile has a username.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await grantAdminToUser(user.user_metadata.username);
      if (result) {
        toast.success("Admin access granted successfully!");
        // Refresh the user profile to update any UI elements that depend on user role
        await refreshUserProfile();
        // Redirect to admin panel
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Error granting admin access:", error);
      toast.error("Failed to grant admin access. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleGrantAdmin}
      className="flex items-center gap-2 mt-2"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
      {isProcessing ? "Processing..." : "Grant Admin Access"}
    </Button>
  );
};

export default AdminAccessButton;
