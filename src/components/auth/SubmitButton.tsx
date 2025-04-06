
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, label }) => {
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        label
      )}
    </Button>
  );
};

export default SubmitButton;
