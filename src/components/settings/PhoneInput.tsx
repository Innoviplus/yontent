
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+86', country: 'CN' },
  { code: '+852', country: 'HK' },
  { code: '+65', country: 'SG' },
  { code: '+81', country: 'JP' },
  { code: '+82', country: 'KR' },
  { code: '+61', country: 'AU' },
  { code: '+64', country: 'NZ' },
  { code: '+91', country: 'IN' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+31', country: 'NL' },
  { code: '+7', country: 'RU' },
  { code: '+55', country: 'BR' },
  { code: '+52', country: 'MX' },
  { code: '+27', country: 'ZA' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange
}) => {
  return (
    <div className="flex gap-2">
      <Select
        value={countryCode}
        onValueChange={onCountryCodeChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.code} {country.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder="Phone number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};
