import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, UserCircle2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SendMessageDialog } from "@/components/messaging/SendMessageDialog";
import { useSettings } from "@/hooks/use-settings";
import { LeadInfoCard } from "./detail/LeadInfoCard";
import { TaskList } from "./detail/TaskList";
import { NoteList } from "./detail/NoteList";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LeadSummary } from "./detail/LeadSummary";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadDetailViewProps {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailView = ({ leadId, onClose }: LeadDetailViewProps) => {
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId) return null;
      const { data, error } = await supabase
        .from("leads")
        .select("*, messages(*), tasks(*)")
        .eq("id", leadId)
        .single();

      if (error) throw error;
      return data as Tables<"leads"> & {
        messages: Tables<"messages">[];
        tasks: Tables<"tasks">[];
      };
    },
    enabled: !!leadId,
  });

  const { data: phases = [] } = useQuery({
    queryKey: ["lead-phases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_phases")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (updates: Partial<Tables<"leads">>) => {
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
  });

  return (
    <Dialog open={!!leadId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-4">
              <Input
                value={lead?.name || ""}
                onChange={(e) =>
                  updateLeadMutation.mutate({ name: e.target.value })
                }
                className="text-xl font-semibold"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={lead?.phase}
                onValueChange={(value) => updateLeadMutation.mutate({ phase: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Phase auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.name}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={lead?.contact_type?.includes("Partner")}
                  onCheckedChange={(checked) => {
                    const currentTypes = lead?.contact_type?.split(",").filter(Boolean) || [];
                    const newTypes = checked
                      ? [...currentTypes, "Partner"]
                      : currentTypes.filter(t => t !== "Partner");
                    updateLeadMutation.mutate({ contact_type: newTypes.join(",") });
                  }}
                  id="partner"
                />
                <label htmlFor="partner">Partner</label>
                <Checkbox
                  checked={lead?.contact_type?.includes("Kunde")}
                  onCheckedChange={(checked) => {
                    const currentTypes = lead?.contact_type?.split(",").filter(Boolean) || [];
                    const newTypes = checked
                      ? [...currentTypes, "Kunde"]
                      : currentTypes.filter(t => t !== "Kunde");
                    updateLeadMutation.mutate({ contact_type: newTypes.join(",") });
                  }}
                  id="kunde"
                />
                <label htmlFor="kunde">Kunde</label>
              </div>
            </div>
          </div>
          {lead && (
            <SendMessageDialog
              lead={lead}
              trigger={
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {settings?.language === "en" ? "Send Message" : "Nachricht senden"}
                </Button>
              }
            />
          )}
        </DialogHeader>

        {isLoading ? (
          <div>{settings?.language === "en" ? "Loading..." : "Lädt..."}</div>
        ) : lead ? (
          <div className="grid gap-6">
            <Button 
              variant="outline" 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
              }}
              className="w-fit"
            >
              KI Zusammenfassung generieren
            </Button>
            <LeadSummary lead={lead} />
            <LeadInfoCard lead={lead} />
            <TaskList leadId={lead.id} tasks={lead.tasks} />
            <NoteList leadId={lead.id} />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {settings?.language === "en" ? "Messages" : "Nachrichten"} (
                {lead.messages.length})
              </h3>
              {lead.messages.map((message) => (
                <div key={message.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>
                      {new Date(message.sent_at || "").toLocaleString(
                        settings?.language === "en" ? "en-US" : "de-DE",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};