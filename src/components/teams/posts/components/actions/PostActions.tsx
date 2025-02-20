
import { Bell, BellOff, Link2, Flag, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ReportDialog } from "../dialog/ReportDialog";

interface PostActionsProps {
  postId: string;
  teamId: string;
  isSubscribed: boolean;
  postTitle: string;
  isAdmin?: boolean;
  isPinned?: boolean;
}

export const PostActions = ({ 
  postId, 
  teamId,
  isSubscribed,
  postTitle,
  isAdmin = false,
  isPinned = false
}: PostActionsProps) => {
  const queryClient = useQueryClient();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('team_post_subscriptions')
        .upsert({
          post_id: postId,
          user_id: user.id,
          subscribed: !isSubscribed
        });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['post-subscription', postId] });
      
      toast.success(isSubscribed 
        ? "Benachrichtigungen deaktiviert" 
        : "Benachrichtigungen aktiviert"
      );
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error("Fehler beim Ändern der Benachrichtigungen");
    }
  };

  const handlePinToggle = async () => {
    try {
      const { error } = await supabase
        .from('team_posts')
        .update({ pinned: !isPinned })
        .eq('id', postId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['team-posts'] });
      toast.success(isPinned ? "Beitrag nicht mehr angepinnt" : "Beitrag angepinnt");
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error("Fehler beim Ändern des Pin-Status");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link kopiert!");
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePinToggle}
          className={cn(
            "text-muted-foreground hover:text-primary",
            isPinned && "text-primary"
          )}
        >
          <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSubscription}
        className={cn(
          "text-muted-foreground hover:text-primary",
          isSubscribed && "text-primary"
        )}
      >
        {isSubscribed ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyUrl}
        className="text-muted-foreground hover:text-primary"
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsReportDialogOpen(true)}
        className="text-muted-foreground hover:text-primary"
      >
        <Flag className="h-4 w-4" />
      </Button>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        postId={postId}
        postTitle={postTitle}
      />
    </div>
  );
};
