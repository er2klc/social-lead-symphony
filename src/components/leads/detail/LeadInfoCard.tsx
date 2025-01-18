import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Contact2, Building2, Briefcase, Phone, Mail, ExternalLink } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateSocialMediaUrl, platformConfigMap } from "@/config/platforms";

interface LeadInfoCardProps {
  lead: Tables<"leads">;
}

export function LeadInfoCard({ lead }: LeadInfoCardProps) {
  const { settings } = useSettings();
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

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
      queryClient.invalidateQueries({ queryKey: ["lead", lead.slug] });
      toast.success(
        settings?.language === "en"
          ? "Contact updated successfully"
          : "Kontakt erfolgreich aktualisiert"
      );
      setEditingField(null);
    },
  });

  // Subscribe to real-time updates for this lead
  useEffect(() => {
    const channel = supabase
      .channel('lead-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `id=eq.${lead.id}`
        },
        (payload) => {
          queryClient.setQueryData(["lead", lead.slug], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              ...payload.new,
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lead.id, lead.slug, queryClient]);

  const handleStartEdit = (field: string, currentValue: string | null) => {
    setEditingField(field);
    setEditingValue(currentValue || "");
  };

  const handleUpdate = (field: string, value: string) => {
    updateLeadMutation.mutate({ [field]: value });
  };

  const InfoRow = ({ 
    icon: Icon, 
    label, 
    value, 
    field 
  }: { 
    icon: any, 
    label: string, 
    value: string | null, 
    field: string 
  }) => {
    const isEditing = editingField === field;
    const platformConfig = lead.platform ? platformConfigMap[lead.platform as keyof typeof platformConfigMap] : null;
    const socialMediaUrl = lead.social_media_username && platformConfig 
      ? generateSocialMediaUrl(lead.platform as any, lead.social_media_username)
      : null;
    
    return (
      <div className="flex items-center gap-4 py-2 group">
        <Icon className="h-5 w-5 text-gray-500" />
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => handleUpdate(field, editingValue)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate(field, editingValue);
                } else if (e.key === "Escape") {
                  setEditingField(null);
                }
              }}
              autoFocus
              placeholder={label}
              className="max-w-md"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => handleStartEdit(field, value)}
                className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2 flex-1"
              >
                {value || label}
              </div>
              {field === "social_media_username" && socialMediaUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(socialMediaUrl, '_blank')}
                >
                  {platformConfig?.icon && <platformConfig.icon className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Contact2 className="h-5 w-5" />
          {settings?.language === "en" ? "Contact Information" : "Kontakt Informationen"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <InfoRow
          icon={Contact2}
          label={settings?.language === "en" ? "Name" : "Name"}
          value={lead.name}
          field="name"
        />
        <InfoRow
          icon={Building2}
          label={settings?.language === "en" ? "Company" : "Firma"}
          value={lead.company_name}
          field="company_name"
        />
        <InfoRow
          icon={Briefcase}
          label={settings?.language === "en" ? "Industry" : "Branche"}
          value={lead.industry}
          field="industry"
        />
        <InfoRow
          icon={Phone}
          label={settings?.language === "en" ? "Phone" : "Telefon"}
          value={lead.phone_number}
          field="phone_number"
        />
        <InfoRow
          icon={Mail}
          label={settings?.language === "en" ? "Email" : "E-Mail"}
          value={lead.email}
          field="email"
        />
        <InfoRow
          icon={platformConfigMap[lead.platform as keyof typeof platformConfigMap]?.icon || ExternalLink}
          label={settings?.language === "en" ? "Social Media" : "Social Media"}
          value={lead.social_media_username}
          field="social_media_username"
        />
      </CardContent>
    </Card>
  );
}