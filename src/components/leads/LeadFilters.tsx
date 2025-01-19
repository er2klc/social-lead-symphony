import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PlusCircle, GitBranch, Pencil } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePipelineDialog } from "./pipeline/CreatePipelineDialog";
import { useState } from "react";

interface LeadFiltersProps {
  selectedPipelineId: string | null;
  setSelectedPipelineId: (id: string | null) => void;
  onEditPipeline?: () => void;
  isEditMode?: boolean;
  onPipelineNameChange?: (name: string) => void;
}

export const LeadFilters = ({
  selectedPipelineId,
  setSelectedPipelineId,
  onEditPipeline,
  isEditMode,
  onPipelineNameChange,
}: LeadFiltersProps) => {
  const session = useSession();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [hoveredPipeline, setHoveredPipeline] = useState<string | null>(null);
  const [editingPipelineName, setEditingPipelineName] = useState("");

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

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingPipelineName(e.target.value);
    onPipelineNameChange?.(e.target.value);
  };

  if (isEditMode) {
    return (
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4" />
        <Input
          value={editingPipelineName || selectedPipeline?.name || ""}
          onChange={handleNameChange}
          className="h-9 min-w-[200px]"
        />
      </div>
    );
  }

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
              onClick={() => setSelectedPipelineId(pipeline.id)}
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