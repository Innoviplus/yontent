
import { Input } from '@/components/ui/input';
import { useRef, useEffect } from 'react';

interface OTPInputFieldProps {
  index: number;
  value: string;
  isVerifying: boolean;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

const OTPInputField = ({
  index,
  value,
  isVerifying,
  onChange,
  onKeyDown,
  onPaste
}: OTPInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (index === 0) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [index]);

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      className="w-12 h-12 text-center text-lg font-semibold"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={index === 0 ? onPaste : undefined}
      disabled={isVerifying}
    />
  );
};

export default OTPInputField;
