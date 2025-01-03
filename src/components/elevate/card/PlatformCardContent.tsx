import { Building, Users, Crown } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlatformCardContentProps {
  platform: {
    id: string;
    name: string;
    description: string | null;
    created_by: string;
  };
}

export const PlatformCardContent = ({ platform }: PlatformCardContentProps) => {
  const user = useUser();
  const isPlatformOwner = user?.id === platform.created_by;

  const { data: stats } = useQuery({
    queryKey: ["platform-stats", platform.id],
    queryFn: async () => {
      // Get team access count
      const { data: teamAccess, error: teamError } = await supabase
        .from("elevate_team_access")
        .select("team_id")
        .eq("platform_id", platform.id);

      if (teamError) throw teamError;

      // Get unique users from team members
      const { data: teamMembers, error: membersError } = await supabase
        .from("team_members")
        .select("user_id")
        .in(
          "team_id",
          teamAccess?.map((ta) => ta.team_id) || []
        );

      if (membersError) throw membersError;

      // Get unique user count
      const uniqueUsers = new Set(teamMembers?.map((tm) => tm.user_id));

      return {
        totalTeams: teamAccess?.length || 0,
        totalUsers: uniqueUsers.size,
        progress: 0, // Wir behalten dies bei 0, da es aktuell nicht implementiert ist
      };
    },
    enabled: !!platform.id,
  });

  return (
    <div className="space-y-4 font-light">
      {platform.description && (
        <p className="text-sm text-gray-300/90 line-clamp-2 font-normal">
          {platform.description}
        </p>
      )}
      
      <div className="flex items-center gap-4 text-xs text-gray-300/90">
        <span className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          {stats?.totalTeams || 0} Teams
        </span>
        <span className="text-gray-500">•</span>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{stats?.totalUsers || 0} Benutzer</span>
          {isPlatformOwner && (
            <span className="bg-yellow-900/30 text-yellow-200/90 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Modul Owner
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-gray-300/90">
          <span>Fortschritt</span>
          <span>{stats?.progress || 0}%</span>
        </div>
        <Progress value={stats?.progress || 0} className="h-2 bg-gray-700/50" />
      </div>
    </div>
  );
};