
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Tables } from "@/integrations/supabase/types";
import { useState, useRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { LeadAvatar } from "./components/LeadAvatar";
import { FavoriteButton } from "./components/FavoriteButton";
import { PlatformIndicator } from "./components/PlatformIndicator";
import { useFavorite } from "./hooks/useFavorite";

interface SortableLeadItemProps {
  lead: Tables<"leads">;
  onLeadClick: (id: string) => void;
  disabled?: boolean;
}

export const SortableLeadItem = ({ lead, onLeadClick, disabled = false }: SortableLeadItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef<number | null>(null);
  const { toggleFavorite } = useFavorite();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: lead.id,
    data: lead,
    disabled,
  });

  const handleMouseDown = () => {
    if (disabled) return;
    
    dragTimeoutRef.current = window.setTimeout(() => {
      setIsDragging(true);
    }, 150);
  };

  const handleMouseUp = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    if (!isDragging) {
      onLeadClick(lead.id);
    }
    setIsDragging(false);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    await toggleFavorite(lead.id, lead.is_favorite);
  };

  const getBackgroundStyle = () => {
    const types = lead.contact_type?.split(",").map(type => type.trim()) || [];
    const isPartner = types.includes("Likely Partner");
    const isKunde = types.includes("Likely Kunde");

    if (isPartner && isKunde) {
      return "bg-gradient-to-r from-[#F0FAFF] to-[#F0FFF0]";
    } else if (isPartner) {
      return "bg-[#F0FAFF]";
    } else if (isKunde) {
      return "bg-[#F0FFF0]";
    }
    return "bg-white";
  };

  const style: CSSProperties | undefined = transform ? {
    transform: CSS.Transform.toString({
      ...transform,
      x: transform.x,
      y: transform.y,
      scaleX: 1.02,
      scaleY: 1.02,
    }),
    zIndex: isDragging ? 1000 : 1,
    position: isDragging ? 'absolute' : 'relative',
    width: '100%',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
    cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 relative",
        getBackgroundStyle(),
        isDragging && "shadow-lg ring-1 ring-primary/10 cursor-grabbing",
        !isDragging && !disabled && "cursor-grab",
        disabled && "cursor-default"
      )}
      {...(disabled ? {} : { ...attributes, ...listeners })}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <PlatformIndicator platform={lead.platform} />
      <FavoriteButton isFavorite={lead.is_favorite} onClick={handleFavoriteClick} />

      <div className="flex gap-3">
        <LeadAvatar 
          name={lead.name}
          platform={lead.platform}
          imageUrl={lead.social_media_profile_image_url}
        />

        <div className="flex flex-col justify-center min-w-0">
          <div className="font-medium text-sm truncate">
            {lead.name}
          </div>
          {lead.social_media_username && (
            <span className="text-xs text-muted-foreground truncate">
              @{lead.social_media_username}
            </span>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            {lead.contact_type || "Nicht festgelegt"}
          </div>
        </div>
      </div>
    </div>
  );
};
