import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SortablePhase } from "./SortablePhase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";

export const LeadPhaseManager = () => {
  const [newPhaseName, setNewPhaseName] = useState("");
  const { settings } = useSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const updatePhaseOrder = useMutation({
    mutationFn: async (updatedPhases: typeof phases) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error("No user ID found");

      const updates = updatedPhases.map((phase, index) => ({
        id: phase.id,
        name: phase.name,
        order_index: index,
        user_id: userId,
      }));

      const { error } = await supabase
        .from("lead_phases")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-phases"] });
    },
  });

  const addPhase = useMutation({
    mutationFn: async (name: string) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error("No user ID found");

      const { error } = await supabase.from("lead_phases").insert({
        name,
        order_index: phases.length,
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-phases"] });
      setNewPhaseName("");
      toast({
        title: settings?.language === "en" ? "Phase added" : "Phase hinzugefügt",
        description: settings?.language === "en" 
          ? "The phase has been added successfully" 
          : "Die Phase wurde erfolgreich hinzugefügt",
      });
    },
  });

  const deletePhase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lead_phases")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-phases"] });
      toast({
        title: settings?.language === "en" ? "Phase deleted" : "Phase gelöscht",
        description: settings?.language === "en"
          ? "The phase has been deleted successfully"
          : "Die Phase wurde erfolgreich gelöscht",
      });
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = phases.findIndex((phase) => phase.id === active.id);
      const newIndex = phases.findIndex((phase) => phase.id === over.id);

      const newPhases = arrayMove(phases, oldIndex, newIndex);
      updatePhaseOrder.mutate(newPhases);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={settings?.language === "en" ? "New phase name" : "Name der neuen Phase"}
          value={newPhaseName}
          onChange={(e) => setNewPhaseName(e.target.value)}
        />
        <Button
          onClick={() => addPhase.mutate(newPhaseName)}
          disabled={!newPhaseName.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          {settings?.language === "en" ? "Add Phase" : "Phase hinzufügen"}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={phases.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {phases.map((phase) => (
              <SortablePhase
                key={phase.id}
                phase={phase}
                onDelete={() => deletePhase.mutate(phase.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};