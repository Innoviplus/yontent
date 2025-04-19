
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm, { EmailLoginFormValues } from '@/components/auth/login/EmailLoginForm';
import PhoneLoginForm, { PhoneLoginFormValues } from '@/components/auth/login/PhoneLoginForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneLoginSchema, emailLoginSchema } from '@/components/auth/login/LoginFormSchemas';

const LoginFormTabs = () => {
  const [userCountry, setUserCountry] = useState('HK');
  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema)
  });

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema)
  });

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_code || 'HK');
      } catch (error) {
        console.error('Failed to detect country', error);
      }
    };

    detectCountry();
  }, []);

  return (
    <>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="phone">
          <PhoneLoginForm
            form={phoneForm}
            onSubmit={onPhoneSubmit}
            isLoading={phoneForm.formState.isSubmitting}
            userCountry={userCountry}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailLoginForm
            form={emailForm}
            onSubmit={onEmailSubmit}
            isLoading={emailForm.formState.isSubmitting}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginFormTabs;
