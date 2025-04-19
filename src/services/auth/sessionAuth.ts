
import { supabase } from '@/integrations/supabase/client';
import { sonnerToast } from 'sonner';

export const signOut = async () => {
  await supabase.auth.signOut();
  sonnerToast.info('You have been signed out.');
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

