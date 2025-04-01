import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, Italic, List, ListOrdered, Undo, Redo, Link as LinkIcon, ExternalLink
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeLink?: boolean;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  includeLink = true
}: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-700',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        linkOnPaste: true,
        validate: href => /^https?:\/\//.test(href),
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      setIsLinkActive(editor.isActive('link'));
      
      if (editor.isActive('link')) {
        const linkMark = editor.getAttributes('link');
        setLinkUrl(linkMark.href || '');
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[150px] p-4',
        placeholder: placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor || !linkUrl) return;
    
    // Validate URL format (simple check)
    const isValid = /^(https?:\/\/)?.+\..+/.test(linkUrl);
    
    if (isValid) {
      // Add protocol if missing
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      
      // Save the current selection before applying the link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      
      // Keep the popover open until user explicitly closes it
      // This allows them to see their link was successfully applied
    } else {
      // Handle invalid URL - could show an error message
      console.error('Invalid URL format');
    }
  };

  const unsetLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  const getCurrentLinkUrl = () => {
    if (!editor) return '';
    
    const linkMark = editor.getAttributes('link');
    return linkMark.href || '';
  };

  // Detect active link when selection changes
  useEffect(() => {
    if (!editor) return;
    
    const handleSelectionUpdate = () => {
      const isActive = editor.isActive('link');
      setIsLinkActive(isActive);
      
      if (isActive) {
        const currentUrl = getCurrentLinkUrl();
        setLinkUrl(currentUrl);
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
        setLinkUrl(getCurrentLinkUrl());
      }
    };

    document.addEventListener('click', checkForLink);
    
    return () => {
      document.removeEventListener('click', checkForLink);
    };
  }, [editor]);

  return (
    <div 
      className={`border rounded-md transition-all ${
        isFocused ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
      }`}
    >
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-accent' : ''}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-accent' : ''}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-accent' : ''}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        {includeLink && (
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
                    setLinkUrl(getCurrentLinkUrl());
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
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        onFocus={() => setIsFocused(true)} 
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default RichTextEditor;
