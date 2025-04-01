
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon, ExternalLink } from 'lucide-react';

interface LinkPopoverProps {
  editor: any;
  isLinkActive: boolean;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  isLinkPopoverOpen: boolean;
  setIsLinkPopoverOpen: (isOpen: boolean) => void;
}

const LinkPopover = ({
  editor,
  isLinkActive,
  linkUrl,
  setLinkUrl,
  isLinkPopoverOpen,
  setIsLinkPopoverOpen
}: LinkPopoverProps) => {
  const setLink = () => {
    if (!editor || !linkUrl) return;
    
    // Validate URL format (simple check)
    const isValid = /^(https?:\/\/)?.+\..+/.test(linkUrl);
    
    if (isValid) {
      // Add protocol if missing
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      
      // Save the current selection before applying the link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      // Handle invalid URL
      console.error('Invalid URL format');
    }
  };

  const unsetLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  return (
    <Popover 
      open={isLinkPopoverOpen} 
      onOpenChange={setIsLinkPopoverOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={isLinkActive ? 'bg-accent' : ''}
          type="button"
          onClick={() => {
            // When clicking the link button, update the URL if there's an active link
            if (editor?.isActive('link')) {
              const linkMark = editor.getAttributes('link');
              setLinkUrl(linkMark.href || '');
            }
            setIsLinkPopoverOpen(true);
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input 
              type="url" 
              placeholder="https://example.com" 
              value={linkUrl} 
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
            <Button 
              onClick={() => {
                setLink();
              }} 
              type="button" 
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Set Link
            </Button>
          </div>
          {isLinkActive && (
            <Button 
              onClick={() => {
                unsetLink();
                setIsLinkPopoverOpen(false);
              }} 
              variant="outline" 
              size="sm" 
              type="button"
            >
              Remove Link
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkPopover;
