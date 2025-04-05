
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

const fontSizes = [
  { label: 'Small', size: 'small', class: 'text-sm' },
  { label: 'Default', size: 'default', class: 'text-base' },
  { label: 'Large', size: 'large', class: 'text-lg' },
  { label: 'X-Large', size: 'x-large', class: 'text-xl' },
  { label: '2X-Large', size: '2x-large', class: 'text-2xl' },
];

const FontSizeSelector = ({ editor }: FontSizeSelectorProps) => {
  if (!editor) return null;

  const setFontSize = (fontSize: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize }).run();
  };

  const getCurrentSize = () => {
    // Determine the active font size or default to 'Default'
    if (editor.isActive('textStyle', { fontSize: 'small' })) return 'Small';
    if (editor.isActive('textStyle', { fontSize: 'large' })) return 'Large';
    if (editor.isActive('textStyle', { fontSize: 'x-large' })) return 'X-Large';
    if (editor.isActive('textStyle', { fontSize: '2x-large' })) return '2X-Large';
    return 'Default';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" type="button" className="flex items-center gap-1">
          <span className="text-xs font-medium">Size: {getCurrentSize()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {fontSizes.map((item) => (
          <DropdownMenuItem 
            key={item.size} 
            onClick={() => setFontSize(item.size)}
            className={`${item.class} cursor-pointer`}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeSelector;
