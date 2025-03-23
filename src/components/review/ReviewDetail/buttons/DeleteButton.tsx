
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onClick();
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting}
    >
      <Trash2 className={`h-5 w-5 ${isDeleting ? 'animate-pulse' : ''}`} />
    </Button>
  );
};

export default DeleteButton;
