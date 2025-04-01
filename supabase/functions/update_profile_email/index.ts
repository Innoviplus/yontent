
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface UpdateProfileEmailParams {
  user_id: string;
  new_email: string | null;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }
  
  try {
    const { user_id, new_email } = await req.json() as UpdateProfileEmailParams;
    
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    console.log(`Updating email for user ${user_id} to ${new_email}`);
    
    // First get the current extended_data
    const { data: profileData, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('extended_data')
      .eq('id', user_id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching profile data:', fetchError);
      throw fetchError;
    }
    
    // Update both the dedicated email column and store in extended_data for backward compatibility
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ 
        email: new_email,
        extended_data: {
          ...(profileData?.extended_data || {}),
          email: new_email
        }
      })
      .eq('id', user_id)
      .select('email, extended_data');
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in update_profile_email function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
