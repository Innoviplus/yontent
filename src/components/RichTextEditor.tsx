
import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
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
  // Reference to track if content was manually set to prevent update loops
  const contentUpdateSourceRef = useRef<'external' | 'internal' | null>(null);
  // Reference to last value received from props to avoid unnecessary updates
  const lastValueRef = useRef<string>(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
      }),
      Underline,
      // Properly configured TextStyle extension for font sizes
      TextStyle.configure({
        HTMLAttributes: {
          class: 'text-style',
        },
      }),
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
    content: value || '',
    onUpdate: ({ editor }) => {
      contentUpdateSourceRef.current = 'internal';
      const newContent = editor.getHTML();
      onChange(newContent);
      lastValueRef.current = newContent;
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[150px] p-4 whitespace-pre-wrap',
        placeholder: placeholder,
      },
    },
  });

  // Log initial value for debugging
  useEffect(() => {
    console.log('RichTextEditor initialized with value:', { 
      valueLength: value?.length || 0,
      valuePreview: value?.substring(0, 100),
      isEmpty: !value
    });
  }, []);

  // Sync content from props to editor, but only if it's different from last known value
  // and wasn't just updated internally
  useEffect(() => {
    if (editor && value !== lastValueRef.current && contentUpdateSourceRef.current !== 'internal') {
      console.log('Updating editor content from props:', { 
        valueLength: value?.length || 0,
        valuePreview: value?.substring(0, 100),
        lastValueLength: lastValueRef.current?.length || 0
      });
      
      contentUpdateSourceRef.current = 'external';
      editor.commands.setContent(value || '', false);
      lastValueRef.current = value || '';
    }
    
    // Reset source flag after each update cycle
    if (contentUpdateSourceRef.current === 'internal') {
      contentUpdateSourceRef.current = null;
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
