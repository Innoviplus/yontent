
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
    // First remove any existing fontSize mark
    editor.chain().focus().unsetMark('textStyle').run();
    // Then apply the new fontSize
    editor.chain().focus().setMark('textStyle', { fontSize }).run();
  };

  const getCurrentSize = () => {
    // Correctly check for active text style with fontSize
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      // Find the matching label for the current fontSize
      const match = fontSizes.find(size => size.size === attrs.fontSize);
      return match ? match.label : 'Default';
    }
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
