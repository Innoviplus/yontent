
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <Trash2 className="h-5 w-5" />
    </Button>
  );
};

export default DeleteButton;
