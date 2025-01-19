import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/use-settings";
import { LeadDetailHeader } from "./LeadDetailHeader";
import { LeadDetailContent } from "./LeadDetailContent";
import { toast } from "sonner";
import { type Platform } from "@/config/platforms";
import { useLeadSubscription } from "./hooks/useLeadSubscription";

interface LeadDetailViewProps {
  leadId: string | null;
  onClose: () => void;
}

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const LeadDetailView = ({ leadId, onClose }: LeadDetailViewProps) => {
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId || !isValidUUID(leadId)) {
        throw new Error("Invalid lead ID");
      }

      const { data, error } = await supabase
        .from("leads")
        .select("*, messages(*), tasks(*), notes(*)")
        .eq("id", leadId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching lead:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Lead not found");
      }

      return data as (Tables<"leads"> & {
        platform: Platform;
        messages: Tables<"messages">[];
        tasks: Tables<"tasks">[];
        notes: Tables<"notes">[];
      });
    },
    enabled: !!leadId && isValidUUID(leadId),
  });

  // Set up real-time subscriptions
  useLeadSubscription(leadId);

  const updateLeadMutation = useMutation({
    mutationFn: async (updates: Partial<Tables<"leads">>) => {
      if (!leadId || !isValidUUID(leadId)) {
        throw new Error("Invalid lead ID");
      }

      // Only proceed if there are actual changes
      const hasChanges = Object.entries(updates).some(
        ([key, value]) => lead?.[key as keyof typeof lead] !== value
      );

      if (!hasChanges) {
        return lead;
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
    onSuccess: (data, variables) => {
      // Only show toast and invalidate if there were actual changes
      const hasChanges = Object.entries(variables).some(
        ([key, value]) => lead?.[key as keyof typeof lead] !== value
      );
      
      if (hasChanges) {
        queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
        toast.success(
          settings?.language === "en"
            ? "Contact updated successfully"
            : "Kontakt erfolgreich aktualisiert"
        );
      }
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast.error(
        settings?.language === "en"
          ? "Error updating contact"
          : "Fehler beim Aktualisieren des Kontakts"
      );
    }
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

  if (error) {
    toast.error(
      settings?.language === "en"
        ? "Error loading contact"
        : "Fehler beim Laden des Kontakts"
    );
    onClose();
    return null;
  }

  return (
    <Dialog open={!!leadId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] bg-white border rounded-lg shadow-lg overflow-hidden">
        <DialogHeader className="p-0">
          {lead && (
            <LeadDetailHeader
              lead={lead}
              onUpdateLead={updateLeadMutation.mutate}
            />
          )}
        </DialogHeader>

        {lead && (
          <LeadDetailContent
            lead={lead}
            onUpdateLead={updateLeadMutation.mutate}
            onDeletePhaseChange={deletePhaseChangeMutation.mutate}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};