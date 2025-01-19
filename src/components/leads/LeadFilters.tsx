import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, GitBranch, Pencil } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePipelineDialog } from "./pipeline/CreatePipelineDialog";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";

interface LeadFiltersProps {
  selectedPipelineId: string | null;
  setSelectedPipelineId: (id: string | null) => void;
  onEditPipeline?: () => void;
  isEditMode?: boolean;
}

export const LeadFilters = ({
  selectedPipelineId,
  setSelectedPipelineId,
  onEditPipeline,
  isEditMode,
}: LeadFiltersProps) => {
  const session = useSession();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [hoveredPipeline, setHoveredPipeline] = useState<string | null>(null);
  const { settings, updateSettings } = useSettings();
  const queryClient = useQueryClient();

  const { data: pipelines = [] } = useQuery({
    queryKey: ["pipelines"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("pipelines")
        .select("*")
        .eq("user_id", session.user.id)
        .order("order_index");

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Load last selected pipeline on initial render
  useEffect(() => {
    if (settings?.last_selected_pipeline_id && !selectedPipelineId) {
      setSelectedPipelineId(settings.last_selected_pipeline_id);
    } else if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [settings?.last_selected_pipeline_id, pipelines, selectedPipelineId, setSelectedPipelineId]);

  // Save selected pipeline to settings
  const handlePipelineSelect = async (pipelineId: string) => {
    setSelectedPipelineId(pipelineId);
    try {
      await updateSettings.mutateAsync({
        last_selected_pipeline_id: pipelineId
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (error) {
      console.error("Error saving selected pipeline:", error);
    }
  };

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              {selectedPipeline?.name || "Pipeline wählen"}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {pipelines.map(pipeline => (
            <DropdownMenuItem 
              key={pipeline.id}
              onMouseEnter={() => setHoveredPipeline(pipeline.id)}
              onMouseLeave={() => setHoveredPipeline(null)}
              onClick={() => handlePipelineSelect(pipeline.id)}
              className="flex items-center justify-between"
            >
              <span>{pipeline.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Pipeline hinzufügen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={isEditMode ? "default" : "outline"}
        size="icon"
        onClick={onEditPipeline}
        className="h-9 w-9"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <CreatePipelineDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
};