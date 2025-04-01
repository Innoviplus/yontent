
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import EditorToolbar from './editor/EditorToolbar';
import useLinkHandling from './editor/useLinkHandling';

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[150px] p-4',
        placeholder: placeholder,
      },
    },
  });

  // Sync content from props to editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Use the link handling hook
  const linkHandlingProps = useLinkHandling(editor);

  return (
    <div 
      className={`border rounded-md transition-all ${
        isFocused ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
      }`}
    >
      <EditorToolbar 
        editor={editor} 
        includeLink={includeLink}
        {...linkHandlingProps}
      />
      <EditorContent 
        editor={editor} 
        onFocus={() => setIsFocused(true)} 
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default RichTextEditor;
