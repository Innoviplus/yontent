
import React from 'react';
import PhoneInput, { CountryCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryCode;
  className?: string;
}

const PhoneNumberInput = ({ value, onChange, defaultCountry = 'HK', className }: PhoneNumberInputProps) => {
  return (
    <div className={cn('relative w-full', className)}>
      <PhoneInput
        international
        defaultCountry={defaultCountry as CountryCode}
        value={value}
        onChange={onChange as (value: string | undefined) => void}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default PhoneNumberInput;
