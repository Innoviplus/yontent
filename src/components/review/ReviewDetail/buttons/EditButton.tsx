
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <Edit className="h-5 w-5" />
    </Button>
  );
};

export default EditButton;
