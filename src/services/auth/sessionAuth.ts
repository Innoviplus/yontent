import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signOut = async () => {
  await supabase.auth.signOut();
  toast.info('You have been signed out.');
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
