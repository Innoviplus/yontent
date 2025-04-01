
import { useState, useEffect } from 'react';

export const useLinkHandling = (editor: any) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  // Handle selection changes to detect active links
  useEffect(() => {
    if (!editor) return;
    
    const handleSelectionUpdate = () => {
      const isActive = editor.isActive('link');
      setIsLinkActive(isActive);
      
      if (isActive) {
        const linkMark = editor.getAttributes('link');
        setLinkUrl(linkMark.href || '');
      }
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  // Handle clicks in the document to check for link selections
  useEffect(() => {
    const checkForLink = () => {
      if (editor && editor.isActive('link')) {
        setIsLinkActive(true);
        const linkMark = editor.getAttributes('link');
        setLinkUrl(linkMark.href || '');
      }
    };

    document.addEventListener('click', checkForLink);
    
    return () => {
      document.removeEventListener('click', checkForLink);
    };
  }, [editor]);

  return {
    linkUrl,
    setLinkUrl,
    isLinkActive,
    setIsLinkActive,
    isLinkPopoverOpen,
    setIsLinkPopoverOpen
  };
};

export default useLinkHandling;
