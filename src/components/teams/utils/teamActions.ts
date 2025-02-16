
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleTeamDelete = async (teamId: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete team with ID:', teamId);
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) {
      console.error('Error in team delete:', error);
      if (error.message?.includes('policy')) {
        toast.error("Sie haben keine Berechtigung, dieses Team zu löschen");
      } else {
        toast.error("Fehler beim Löschen des Teams");
      }
      return false;
    }
    
    toast.success("Team erfolgreich gelöscht");
    return true;
  } catch (error) {
    console.error('Error in team delete:', error);
    toast.error("Fehler beim Löschen des Teams");
    return false;
  }
};

export const handleTeamLeave = async (teamId: string, userId: string): Promise<boolean> => {
  try {
    console.log('Attempting to leave team:', teamId, 'for user:', userId);
    
    const { data, error } = await supabase
      .from('team_members')
      .delete()
      .in('team_id', [teamId])
      .in('user_id', [userId])
      .select();

    if (error) {
      console.error('Error in team leave:', error);
      toast.error("Fehler beim Verlassen des Teams");
      return false;
    }

    if (data && data.length > 0) {
      toast.success("Team erfolgreich verlassen");
      return true;
    } else {
      console.log('No team membership found to delete');
      return false;
    }
  } catch (error) {
    console.error('Error in team leave:', error);
    toast.error("Fehler beim Verlassen des Teams");
    return false;
  }
};
