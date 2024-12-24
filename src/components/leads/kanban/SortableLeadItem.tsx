import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Star, Send, Instagram, Linkedin, Facebook, Video, Pencil } from "lucide-react";
import { SendMessageDialog } from "@/components/messaging/SendMessageDialog";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { LeadDetailView } from "../LeadDetailView";

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "tiktok":
      return <Video className="h-4 w-4" />;
    default:
      return null;
  }
};

interface SortableLeadItemProps {
  lead: Tables<"leads">;
  onLeadClick: (id: string) => void;
}

export const SortableLeadItem = ({ lead, onLeadClick }: SortableLeadItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? 'relative' as const : undefined,
    opacity: isDragging ? 0.9 : 1,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group ${
          isDragging ? 'shadow-lg ring-2 ring-primary cursor-grabbing scale-105' : 'cursor-grab'
        }`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPlatformIcon(lead.platform)}
              <span className="font-medium">{lead.name}</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {lead.contact_type || "Nicht festgelegt"}
          </div>

          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 hover:bg-accent/50"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="w-full h-8 rounded-md border border-dashed border-muted-foreground/20" />
            <div className="w-full h-8 rounded-md border border-dashed border-muted-foreground/20" />
            <div className="w-full h-8 rounded-md border border-dashed border-muted-foreground/20" />
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <LeadDetailView leadId={lead.id} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};