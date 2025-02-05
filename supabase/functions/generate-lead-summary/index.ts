
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadSummaryRequest {
  leadId: string;
  language?: string;
}

async function generateActionableInsights(lead, posts, openAiApiKey) {
  const postDetails = posts.map((post) => {
    return `Platform: ${post.platform}, Typ: ${post.post_type}, Inhalt: "${post.content}", Likes: ${post.likes_count || 0}, Kommentare: ${post.comments_count || 0}`;
  }).join("\n");

  const prompt = `
Du bist ein KI-Berater für Vertrieb und Kommunikation. Analysiere die folgenden Daten:

Kontaktinformationen:
- Name: ${lead.name}
- Branche: ${lead.industry || "Unbekannt"}
- Interessen: ${(lead.social_media_interests || []).join(", ")}
- Letzte Interaktion: ${lead.last_interaction_date || "Unbekannt"}
- Social-Media-Daten:
${postDetails}

Erstelle eine strukturierte Analyse mit folgenden Abschnitten:

1. **Kontaktstatus**
- Aktuelle Phase und Engagement-Level
- Letzte Aktivitäten und Interaktionen

2. **Geschäftsprofil**
- Branchenspezifische Informationen
- Hauptinteressen und Fokusgebiete

3. **Kommunikation**
- Bisherige Interaktionen
- Bevorzugte Kommunikationskanäle

4. **Relevante Themen**
- Häufig diskutierte Themen
- Aktuelle Interessen und Trends

5. **Nächste Schritte**
- 3 konkrete Handlungsempfehlungen
- Zeitrahmen für Follow-ups

Antwort im klaren, strukturierten Format:`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Du bist ein KI-Experte für Lead-Analyse." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { leadId, language = "de" } = await req.json() as LeadSummaryRequest;

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*, social_media_posts (*)")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      throw new Error("Lead nicht gefunden.");
    }

    const { data: posts, error: postsError } = await supabase
      .from("social_media_posts")
      .select("*")
      .eq("lead_id", leadId);

    if (postsError) {
      throw new Error("Social-Media-Posts konnten nicht abgerufen werden.");
    }

    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("openai_api_key")
      .eq("user_id", lead.user_id)
      .single();

    if (settingsError || !settings?.openai_api_key) {
      throw new Error("OpenAI API-Key nicht gefunden.");
    }

    const insights = await generateActionableInsights(lead, posts, settings.openai_api_key);

    // Store the structured summary
    await supabase
      .from("lead_summaries")
      .upsert({
        lead_id: leadId,
        summary: insights,
        analysis_date: new Date().toISOString(),
        metadata: {
          version: "2.0",
          language,
          post_count: posts?.length || 0
        }
      });

    return new Response(
      JSON.stringify({ summary: insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Ein unerwarteter Fehler ist aufgetreten." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
