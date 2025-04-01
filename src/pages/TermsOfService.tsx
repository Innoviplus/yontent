
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const TermsOfService = () => {
  const { data: terms, isLoading, error } = useQuery({
    queryKey: ['terms-of-service'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('type', 'terms_of_service')
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Terms of Service</h1>
          <p className="text-gray-600">
            We're sorry, but we couldn't load the terms of service. Please try again later.
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
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: terms?.content || '' }} />
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
