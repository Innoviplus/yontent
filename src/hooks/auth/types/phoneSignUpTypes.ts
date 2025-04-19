
export interface PendingRegistration {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  phone_country_code: string;
  metadata?: {
    username: string;
    email: string;
    phone_number: string;
    phone_country_code: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  error: any | null;
}
