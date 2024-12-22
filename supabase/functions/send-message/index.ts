import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, message, leadId, socialMediaUsername } = await req.json();
    console.log('Sending message:', { platform, leadId, socialMediaUsername });
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get platform auth status
    const { data: authStatus, error: authError } = await supabase
      .from('platform_auth_status')
      .select('*')
      .eq('platform', platform.toLowerCase())
      .single();

    if (authError || !authStatus) {
      console.error('Auth status error:', authError);
      throw new Error(`${platform} is not connected`);
    }

    if (platform.toLowerCase() === 'linkedin') {
      if (!authStatus.access_token) {
        throw new Error('LinkedIn access token not found');
      }

      console.log('Sending LinkedIn message to:', socialMediaUsername);

      // Clean and format the LinkedIn member ID
      let memberId = socialMediaUsername;
      if (memberId.includes('linkedin.com/in/')) {
        memberId = memberId.split('linkedin.com/in/')[1];
      }
      memberId = memberId.replace(/\/$/, '').split('?')[0];

      // Use the messaging API v2 endpoint
      const messageResponse = await fetch('https://api.linkedin.com/v2/messaging/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStatus.access_token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202304',
        },
        body: JSON.stringify({
          recipients: [memberId],
          body: message,
          messageType: "MEMBER_TO_MEMBER",
          subject: "Neue Nachricht"
        }),
      });

      if (!messageResponse.ok) {
        const errorData = await messageResponse.text();
        console.error('LinkedIn API error:', errorData);
        throw new Error(`Failed to send LinkedIn message: ${errorData}`);
      }

      console.log('LinkedIn message sent successfully');
    }

    // Save message in database
    const { error: dbError } = await supabase
      .from('messages')
      .insert({
        lead_id: leadId,
        platform,
        content: message,
        sent_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});