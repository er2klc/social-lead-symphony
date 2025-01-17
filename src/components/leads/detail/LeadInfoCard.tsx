import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Contact2 } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface LeadInfoCardProps {
  lead: Tables<"leads">;
}

export function LeadInfoCard({ lead }: LeadInfoCardProps) {
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const updateLeadMutation = useMutation({
    mutationFn: async (updates: Partial<Tables<"leads">>) => {
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", lead.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", lead.id] });
      toast.success(
        settings?.language === "en"
          ? "Contact updated successfully"
          : "Kontakt erfolgreich aktualisiert"
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Contact2 className="h-5 w-5" />
          {settings?.language === "en" ? "Contact Information" : "Kontakt Informationen"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4">
            <Input
              value={lead.name || ""}
              onChange={(e) => updateLeadMutation.mutate({ name: e.target.value })}
              placeholder={settings?.language === "en" ? "Name" : "Name"}
              className="flex-1"
            />
            <Input
              value={lead.phone_number || ""}
              onChange={(e) => updateLeadMutation.mutate({ phone_number: e.target.value })}
              placeholder={settings?.language === "en" ? "Phone" : "Telefon"}
              className="flex-1"
              type="tel"
            />
            <Input
              value={lead.email || ""}
              onChange={(e) => updateLeadMutation.mutate({ email: e.target.value })}
              placeholder={settings?.language === "en" ? "Email" : "E-Mail"}
              className="flex-1"
              type="email"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}