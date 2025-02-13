
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LeadSummaryProps } from "./types/summary";
import { NexusTimelineCard } from "./timeline/cards/NexusTimelineCard";
import { useAuth } from "@/hooks/use-auth";
import { PhaseAnalysisButton } from "./components/PhaseAnalysisButton";

export function LeadSummary({ lead }: LeadSummaryProps) {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);

  const generateAnalysis = async () => {
    if (!user) {
      toast.error(
        settings?.language === "en"
          ? "You must be logged in"
          : "Sie müssen angemeldet sein"
      );
      return;
    }

    if (isLoading) return; // Prevent multiple calls while loading

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-phase-analysis', {
        body: {
          leadId: lead.id,
          phaseId: lead.phase_id,
          userId: user.id
        }
      });

      if (error) throw error;
      
      if (data.error) {
        // Handle known errors from the edge function
        toast.error(data.error);
        return;
      }

      setLatestAnalysis(data.analysis);
      toast.success(
        settings?.language === "en"
          ? "Analysis generated successfully"
          : "Analyse erfolgreich generiert"
      );
    } catch (error: any) {
      console.error("Error generating analysis:", error);
      
      // Handle specific error cases
      if (error.status === 409) {
        toast.error(
          settings?.language === "en"
            ? "Analysis for this phase already exists"
            : "Eine Analyse für diese Phase existiert bereits"
        );
        // Reload the latest analysis
        loadLatestAnalysis();
        return;
      }

      toast.error(
        settings?.language === "en"
          ? "Error generating analysis"
          : "Fehler beim Generieren der Analyse"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Lade die letzte Analyse beim ersten Rendern
  const loadLatestAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("phase_based_analyses")
        .select("*")
        .eq("lead_id", lead.id)
        .eq("phase_id", lead.phase_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLatestAnalysis(data);
      }
    } catch (error) {
      console.error("Error loading analysis:", error);
    }
  };

  useEffect(() => {
    loadLatestAnalysis();
  }, [lead.id, lead.phase_id]);

  if (!latestAnalysis) {
    return (
      <PhaseAnalysisButton 
        isLoading={isLoading} 
        leadId={lead.id} 
        phaseId={lead.phase_id} 
        onGenerateAnalysis={generateAnalysis} 
      />
    );
  }

  return (
    <NexusTimelineCard
      content={latestAnalysis.content}
      metadata={{
        type: 'phase_analysis',
        analysis_type: latestAnalysis.analysis_type,
        phase: latestAnalysis.metadata?.phase,
        timestamp: latestAnalysis.created_at,
        completed: latestAnalysis.completed,
        completed_at: latestAnalysis.completed_at,
        ...latestAnalysis.metadata
      }}
      onRegenerate={generateAnalysis}
      isRegenerating={isLoading}
    />
  );
}
