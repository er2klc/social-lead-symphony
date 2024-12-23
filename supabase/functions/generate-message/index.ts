import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      leadName, 
      leadPlatform, 
      leadIndustry,
      companyName, 
      productsServices, 
      targetAudience, 
      usp,
      language = "Deutsch" // Standardsprache falls keine angegeben
    } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Du bist ein Experte für personalisierte Verkaufsnachrichten im MLM-Bereich. 
                     Erstelle eine freundliche, aber direkte Nachricht für ${leadPlatform}.
                     Berücksichtige dabei die Branche ${leadIndustry} des Leads.
                     Die Nachricht soll in folgender Sprache sein: ${language}`
          },
          {
            role: 'user',
            content: `Erstelle eine kurze Verkaufsnachricht für ${leadName} mit folgenden Informationen:
              Firma: ${companyName}
              Produkte/Services: ${productsServices}
              Zielgruppe: ${targetAudience}
              USP: ${usp}
              
              Die Nachricht sollte:
              - Kurz und prägnant sein (max. 2-3 Sätze)
              - Freundlich und persönlich klingen
              - Einen klaren Call-to-Action enthalten
              - In ${language} sein
              - Für ${leadPlatform} optimiert sein`
          }
        ],
      }),
    });

    const data = await response.json();
    const message = data.choices[0].message.content;

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});