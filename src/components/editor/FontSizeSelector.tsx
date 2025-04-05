
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FontSizeSelectorProps {
  editor: any;
}

// Updated with specific numeric font sizes
const fontSizes = [
  { label: '8px', size: '8px', class: 'text-xs' },
  { label: '9px', size: '9px', class: 'text-xs' },
  { label: '10px', size: '10px', class: 'text-xs' },
  { label: '11px', size: '11px', class: 'text-xs' },
  { label: '12px', size: '12px', class: 'text-sm' },
  { label: '14px', size: '14px', class: 'text-base' },
  { label: '16px', size: '16px', class: 'text-base' },
  { label: '18px', size: '18px', class: 'text-lg' },
  { label: '20px', size: '20px', class: 'text-xl' },
  { label: '24px', size: '24px', class: 'text-2xl' },
  { label: '30px', size: '30px', class: 'text-3xl' },
  { label: '36px', size: '36px', class: 'text-4xl' },
];

const FontSizeSelector = ({ editor }: FontSizeSelectorProps) => {
  if (!editor) return null;

  const setFontSize = (fontSize: string) => {
    // Make sure we have focus before applying the font size
    editor.chain().focus();
    
    // Apply the font size using TextStyle mark
    editor.chain().setMark('textStyle', { fontSize }).run();
    
    console.log(`Setting font size to: ${fontSize}`);
  };

  const getCurrentSize = () => {
    // Get the current font size from the editor state
    const attrs = editor.getAttributes('textStyle');
    console.log('Current font style attributes:', attrs);
    
    if (attrs.fontSize) {
      const match = fontSizes.find(size => size.size === attrs.fontSize);
      return match ? match.label : '14px';
    }
    return '14px'; // Default font size
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" type="button" className="flex items-center gap-1">
          <span className="text-xs font-medium">Size: {getCurrentSize()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
        {fontSizes.map((item) => (
          <DropdownMenuItem 
            key={item.size} 
            onClick={() => setFontSize(item.size)}
            style={{ fontSize: item.size }}
            className="cursor-pointer"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeSelector;
