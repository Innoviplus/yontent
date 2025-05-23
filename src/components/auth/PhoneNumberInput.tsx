
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

// Define our own E164Number type as a workaround since it's not properly exported
type E164Number = string & { readonly __tag: 'E164Number' };

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  defaultCountry?: Country;
  className?: string;
}

const PhoneNumberInput = ({ value, onChange, className }: PhoneNumberInputProps) => {
  return (
    <div className={cn('relative w-full', className)}>
      <PhoneInput
        international
        defaultCountry="SG"
        countries={["SG"]}
        countrySelectProps={{ disabled: true }}
        value={value as unknown as E164Number}
        onChange={(value) => onChange(value as unknown as string)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default PhoneNumberInput;
