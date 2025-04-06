// This file is deliberately emptied to remove avatar functionality
// We're keeping this file as a placeholder in case other parts of the code reference it

import { useState } from 'react';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  
  // Return empty implementation since avatar functionality is removed
  return {
    avatarUrl: null,
    uploading: false,
    handleAvatarUpload: () => {}
  };
};
