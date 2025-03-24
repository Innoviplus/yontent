
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, List, ListOrdered, Undo, Redo 
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
  includeLink = false
}: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
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
