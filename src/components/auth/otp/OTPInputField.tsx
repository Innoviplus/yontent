
import { Input } from '@/components/ui/input';
import { forwardRef, useEffect } from 'react';

interface OTPInputFieldProps {
  index: number;
  value: string;
  isVerifying: boolean;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

const OTPInputField = forwardRef<HTMLInputElement, OTPInputFieldProps>(({
  index,
  value,
  isVerifying,
  onChange,
  onKeyDown,
  onPaste
}, ref) => {

  useEffect(() => {
    if (index === 0 && ref && 'current' in (ref as any)) {
      const inputRef = (ref as any).current;
      if (inputRef) {
        setTimeout(() => inputRef.focus(), 100);
      }
    }
  }, [index, ref]);

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      className="w-12 h-12 text-center text-lg font-semibold"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      disabled={isVerifying}
    />
  );
});

OTPInputField.displayName = 'OTPInputField';

export default OTPInputField;
