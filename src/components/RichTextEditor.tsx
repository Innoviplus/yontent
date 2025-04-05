
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
    [{ 'font': [] }, { 'size': ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'] }],
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

  // Add custom CSS to style the editor when component mounts
  useEffect(() => {
    if (mounted) {
      // Add size classes for the specified pixel sizes
      const style = document.createElement('style');
      style.innerHTML = `
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="8px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="8px"]::before {
          content: '8px';
          font-size: 8px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="9px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="9px"]::before {
          content: '9px';
          font-size: 9px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
          content: '10px';
          font-size: 10px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="11px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before {
          content: '11px';
          font-size: 11px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
          content: '12px';
          font-size: 12px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
          content: '14px';
          font-size: 14px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
          content: '16px';
          font-size: 16px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
          content: '18px';
          font-size: 18px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
          content: '20px';
          font-size: 20px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
          content: '24px';
          font-size: 24px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
          content: '30px';
          font-size: 30px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
          content: '36px';
          font-size: 36px;
        }
        
        /* Apply actual sizes to the editor text */
        .ql-size-8px {
          font-size: 8px;
        }
        .ql-size-9px {
          font-size: 9px;
        }
        .ql-size-10px {
          font-size: 10px;
        }
        .ql-size-11px {
          font-size: 11px;
        }
        .ql-size-12px {
          font-size: 12px;
        }
        .ql-size-14px {
          font-size: 14px;
        }
        .ql-size-16px {
          font-size: 16px;
        }
        .ql-size-18px {
          font-size: 18px;
        }
        .ql-size-20px {
          font-size: 20px;
        }
        .ql-size-24px {
          font-size: 24px;
        }
        .ql-size-30px {
          font-size: 30px;
        }
        .ql-size-36px {
          font-size: 36px;
        }
      `;
      document.head.appendChild(style);
      
      // Register custom size format
      const Quill = (ReactQuill as any).Quill;
      if (Quill) {
        const SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
        Quill.register(SizeStyle, true);
      }

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [mounted]);

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
