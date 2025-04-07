
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { setSpecificUserAvatar } from '@/scripts/setSpecificUserAvatar';
import { toast } from 'sonner';

const SetAvatar = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSetAvatar = async () => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const success = await setSpecificUserAvatar();
      setIsComplete(success);
      if (!success) {
        setError("Failed to set avatar. Check console for more details.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "An unknown error occurred");
      toast.error("Failed to set avatar");
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Auto-execute on page load
  useEffect(() => {
    handleSetAvatar();
  }, []);
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-28 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Set Avatar Image</CardTitle>
            <CardDescription>
              Setting avatar for user: yy.leung@hotmail.com
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isExecuting ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
                  <span className="ml-3">Setting avatar image...</span>
                </div>
              ) : isComplete ? (
                <div className="bg-green-50 p-4 rounded-lg flex items-start">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Avatar set successfully</h3>
                    <div className="mt-2 text-sm text-green-700">
                      The avatar has been updated for yy.leung@hotmail.com
                    </div>
                    <div className="mt-4">
                      <img 
                        src="/lovable-uploads/b6ac2774-e2c5-4a92-847d-52526f3292eb.png" 
                        alt="New avatar" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error setting avatar</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                    <Button 
                      onClick={handleSetAvatar} 
                      className="mt-4"
                      variant="outline"
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : null}
              
              {!isExecuting && !error && !isComplete && (
                <Button 
                  onClick={handleSetAvatar} 
                  className="w-full"
                >
                  Set Avatar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SetAvatar;
