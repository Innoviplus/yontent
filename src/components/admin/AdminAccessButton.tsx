
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { grantAdminToUser } from "@/scripts/grantAdminToUser";
import { useAuth } from "@/contexts/AuthContext";

const AdminAccessButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleGrantAdmin = async () => {
    if (!user?.user_metadata?.username) {
      return;
    }

    setIsProcessing(true);
    try {
      await grantAdminToUser(user.user_metadata.username);
    } catch (error) {
      console.error("Error granting admin access:", error);
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
