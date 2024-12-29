import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { TeamHeaderTitle } from "./header/TeamHeaderTitle";
import { TeamActions } from "./header/TeamActions";

interface TeamHeaderProps {
  team: {
    id: string;
    name: string;
    logo_url?: string;
  };
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const user = useUser();

  const { data: memberRole } = useQuery({
    queryKey: ['team-member-role', team.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching member role:', error);
        return null;
      }

      return data?.role;
    },
    enabled: !!user?.id && !!team.id,
  });

  const isAdmin = memberRole === 'admin' || memberRole === 'owner';

  const { data: members = [] } = useQuery({
    queryKey: ['team-members', team.id],
    queryFn: async () => {
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('id, role, user_id')
        .eq('team_id', team.id);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        return [];
      }

      // Fetch display names for all members
      const userIds = teamMembers.map(member => member.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return teamMembers;
      }

      // Merge profiles with team members
      return teamMembers.map(member => ({
        ...member,
        profiles: profiles.find(profile => profile.id === member.user_id)
      }));
    },
    enabled: !!team.id,
  });

  // Filter admins from the full members list
  const adminMembers = members.filter(member => 
    member.role === 'admin' || member.role === 'owner'
  );

  // Calculate counts
  const membersCount = members.length;
  const adminsCount = adminMembers.length;

  return (
    <div className="bg-background border-b">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <TeamHeaderTitle 
            team={team}
            isAdmin={isAdmin}
            membersCount={membersCount}
            adminsCount={adminsCount}
            members={members}
            adminMembers={adminMembers}
          />
          <TeamActions 
            teamId={team.id}
            isAdmin={isAdmin}
          />
        </div>
        <Separator className="my-4" />
      </div>
    </div>
  );
}