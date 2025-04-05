
import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  simpleToolbar?: boolean;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  simpleToolbar = false
}: RichTextEditorProps) => {
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // Ensure component is mounted before rendering Quill (for SSR compatibility)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure toolbar based on the simpleToolbar prop
  const fullToolbar = [
    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ];
  
  const basicToolbar = [
    ['bold', 'italic', 'underline'],
    ['link'],
    ['clean']
  ];

  const modules = {
    toolbar: simpleToolbar ? basicToolbar : fullToolbar
  };

  // Format options based on toolbar
  const fullFormats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'link', 'image'
  ];

  const basicFormats = [
    'bold', 'italic', 'underline',
    'link'
  ];

  const formats = simpleToolbar ? basicFormats : fullFormats;

  if (!mounted) {
    return (
      <div 
        className={`border rounded-md p-2 min-h-[250px] ${className}`}
        style={{ height: '250px' }}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`quill-container ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[250px]"
      />
    </div>
  );
};

export default RichTextEditor;
