import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, CheckCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PHASES = [
  { name: "Erstkontakt", order_index: 0 },
  { name: "Follow-up", order_index: 1 },
  { name: "Abschluss", order_index: 2 },
];

export const LeadPhases = ({ selectedPipelineId }: { selectedPipelineId: string | null }) => {
  const session = useSession();
  const { toast } = useToast();

  // Get the selected pipeline
  const { data: pipeline } = useQuery({
    queryKey: ["pipeline", selectedPipelineId],
    queryFn: async () => {
      if (!session?.user?.id || !selectedPipelineId) return null;
      
      const { data, error } = await supabase
        .from("pipelines")
        .select("*")
        .eq("id", selectedPipelineId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!selectedPipelineId,
  });

  // Then get the phases for that pipeline
  const { data: phases = [], isLoading, refetch } = useQuery({
    queryKey: ["pipeline-phases", selectedPipelineId],
    queryFn: async () => {
      if (!session?.user?.id || !selectedPipelineId) return [];
      
      const { data: existingPhases, error } = await supabase
        .from("pipeline_phases")
        .select("*")
        .eq("pipeline_id", selectedPipelineId)
        .order("order_index");

      if (error) throw error;
      return existingPhases;
    },
    enabled: !!session?.user?.id && !!selectedPipelineId,
  });

  // Query to get lead counts per phase
  const { data: leadCounts = {} } = useQuery({
    queryKey: ["lead-phase-counts", selectedPipelineId],
    queryFn: async () => {
      if (!session?.user?.id || !selectedPipelineId) return {};
      
      const { data: leads, error } = await supabase
        .from("leads")
        .select(`
          pipeline_phases!inner(name)
        `)
        .eq("user_id", session.user.id)
        .eq("pipeline_id", selectedPipelineId);

      if (error) throw error;

      // Calculate percentages
      const counts: { [key: string]: number } = {};
      const total = leads?.length || 0;
      
      leads?.forEach(lead => {
        const phaseName = lead.pipeline_phases.name;
        counts[phaseName] = (counts[phaseName] || 0) + 1;
      });

      // Convert to percentages
      const percentages: { [key: string]: number } = {};
      Object.keys(counts).forEach(phase => {
        percentages[phase] = total > 0 ? Math.round((counts[phase] / total) * 100) : 0;
      });

      return percentages;
    },
    enabled: !!session?.user?.id && !!selectedPipelineId,
  });

  useEffect(() => {
    const initializeDefaultPhases = async () => {
      if (!session?.user?.id || !selectedPipelineId || phases.length > 0) return;

      try {
        // First verify that the user exists in auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Error verifying user:", userError);
          toast({
            title: "Fehler",
            description: "Benutzer konnte nicht verifiziert werden. Bitte melden Sie sich erneut an.",
            variant: "destructive",
          });
          return;
        }

        // Only initialize default phases for the standard pipeline
        if (pipeline?.name === "Standard Pipeline") {
          // Proceed with phase initialization using UPSERT
          const phasesToAdd = DEFAULT_PHASES.map(phase => ({
            name: phase.name,
            order_index: phase.order_index,
            pipeline_id: selectedPipelineId,
          }));

          const { error } = await supabase
            .from("pipeline_phases")
            .upsert(phasesToAdd, {
              onConflict: 'pipeline_id,name',
              ignoreDuplicates: true
            });

          if (error) {
            console.error("Error initializing phases:", error);
            toast({
              title: "Fehler",
              description: "Fehler beim Initialisieren der Phasen. Bitte versuchen Sie es später erneut.",
              variant: "destructive",
            });
            return;
          }

          refetch();
        }
      } catch (error) {
        console.error("Error in initializeDefaultPhases:", error);
        toast({
          title: "Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }
    };

    initializeDefaultPhases();
  }, [session?.user?.id, selectedPipelineId, phases.length, toast, refetch, pipeline?.name]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          {pipeline?.name || "Pipeline"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {phases.map(phase => (
          <div key={phase.id}>
            <div className="flex justify-between mb-1 text-sm">
              <span className="flex items-center gap-2">
                {phase.order_index === 0 ? (
                  <UserPlus className="h-4 w-4" />
                ) : phase.order_index === phases.length - 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                {phase.name}
              </span>
              <span>{leadCounts[phase.name] || 0}%</span>
            </div>
            <Progress value={leadCounts[phase.name] || 0} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};