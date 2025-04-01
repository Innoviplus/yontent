
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/home/Footer';

const PrivacyPolicy = () => {
  const { data: privacyPolicy, isLoading, error } = useQuery({
    queryKey: ['privacy-policy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('type', 'privacy_policy')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-28 max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-4/5 mb-6" />
          
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-6" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-28 max-w-4xl text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Privacy Policy</h1>
          <p className="text-gray-600">
            We're sorry, but we couldn't load the privacy policy. Please try again later.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-28 max-w-4xl">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: privacyPolicy?.content || '' }} />
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
