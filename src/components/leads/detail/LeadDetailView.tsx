import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeadDetailHeader } from "@/components/leads/detail/LeadDetailHeader";
import { LeadSummary } from "@/components/leads/detail/LeadSummary";
import { LeadInfoCard } from "@/components/leads/detail/LeadInfoCard";
import { LeadDetailTabs } from "@/components/leads/detail/LeadDetailTabs";
import { LeadTimeline } from "@/components/leads/detail/LeadTimeline";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";
import { Tables } from "@/integrations/supabase/types";
import { LeadWithRelations } from "@/components/leads/detail/types/lead";

export default function LeadDetail() {
  const { leadId } = useParams<{ leadId: string }>();
  const queryClient = useQueryClient();
  const { settings } = useSettings();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId) {
        throw new Error("No lead ID provided");
      }

      // Get the lead data
      const { data, error } = await supabase
        .from("leads")
.select(`
  *,
  messages (*),
  tasks (*),
  notes (*),
  lead_files (*),
  social_media_posts (
    id,
    platform,
    post_type,
    content,
    caption,
    local_media_paths,
    media_urls,
    video_url,
    posted_at
  )
`)
        .eq("id", leadId)
        .single();

      if (error) {
        console.error("Error fetching lead:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Lead not found");
      }

      // Store the pipeline_id in settings
      if (data.pipeline_id) {
        const { error: settingsError } = await supabase
          .from("settings")
          .update({ last_selected_pipeline_id: data.pipeline_id })
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

        if (settingsError) {
          console.error("Error updating last selected pipeline:", settingsError);
        }
      }

      return data as LeadWithRelations;
    },
    enabled: !!leadId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (updates: Partial<Tables<"leads">>) => {
      if (!leadId) {
        throw new Error("No lead ID provided");
      }

      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", leadId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success(
        settings?.language === "en"
          ? "Contact updated successfully"
          : "Kontakt erfolgreich aktualisiert"
      );
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast.error(
        settings?.language === "en"
          ? "Error updating contact"
          : "Fehler beim Aktualisieren des Kontakts"
      );
    },
  });

  const deletePhaseChangeMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success(
        settings?.language === "en"
          ? "Phase change deleted successfully"
          : "Phasenänderung erfolgreich gelöscht"
      );
    },
  });

  if (isLoading || !lead) {
    return <div className="p-6">{settings?.language === "en" ? "Loading..." : "Lädt..."}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <LeadDetailHeader 
        lead={lead} 
        onUpdateLead={updateLeadMutation.mutate}
      />
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Column - 4/12 width */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <LeadSummary lead={lead} />
          <LeadInfoCard 
            lead={lead} 
            onUpdate={updateLeadMutation.mutate}
          />
        </div>
        
        {/* Right Column - 8/12 width */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <LeadDetailTabs lead={lead} />
          <LeadTimeline 
            lead={lead} 
            onDeletePhaseChange={deletePhaseChangeMutation.mutate}
          />
        </div>
      </div>
    </div>
  );
}
