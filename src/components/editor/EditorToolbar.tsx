
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LinkPopover from './LinkPopover';

interface EditorToolbarProps {
  editor: any;
  isLinkActive: boolean;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  isLinkPopoverOpen: boolean;
  setIsLinkPopoverOpen: (isOpen: boolean) => void;
  includeLink?: boolean;
}

const EditorToolbar = ({ 
  editor, 
  isLinkActive, 
  linkUrl, 
  setLinkUrl, 
  isLinkPopoverOpen, 
  setIsLinkPopoverOpen,
  includeLink = true 
}: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-accent' : ''}
        type="button"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        type="button"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        type="button"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      {includeLink && (
        <LinkPopover 
          editor={editor}
          isLinkActive={isLinkActive}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          isLinkPopoverOpen={isLinkPopoverOpen}
          setIsLinkPopoverOpen={setIsLinkPopoverOpen}
        />
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        type="button"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        type="button"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
