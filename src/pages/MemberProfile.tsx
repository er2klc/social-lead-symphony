import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { ActivityCalendar } from "@/components/teams/members/profile/ActivityCalendar";
import { ProfileHeader } from "@/components/teams/members/profile/ProfileHeader";
import { MembershipCard } from "@/components/teams/members/profile/MembershipCard";
import { ProfileCard } from "@/components/teams/members/profile/ProfileCard";
import { ActivityFeed } from "@/components/teams/members/profile/ActivityFeed";
import { Activity } from "@/components/teams/members/profile/types";

const MemberProfile = () => {
  const { teamSlug, memberSlug } = useParams();
  const navigate = useNavigate();
  const user = useUser();

  const { data: teamData } = useQuery({
    queryKey: ['team', teamSlug],
    queryFn: async () => {
      if (!teamSlug) return null;
      
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, slug, logo_url')
        .eq('slug', teamSlug)
        .maybeSingle();

      if (error) throw error;
      return data ? {
        id: data.id,
        name: data.name,
        slug: data.slug,
        logo_url: data.logo_url
      } : null;
    },
    enabled: !!teamSlug
  });

  const { data: memberData, isLoading } = useQuery({
    queryKey: ['member-profile', teamSlug, memberSlug],
    queryFn: async () => {
      if (!teamData?.id || !memberSlug) return null;

      const [profileResponse, memberResponse, countResponse, settingsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, display_name, email, avatar_url, slug, status, last_seen')
          .eq('slug', memberSlug)
          .maybeSingle(),
        supabase
          .from('team_members')
          .select('role')
          .eq('team_id', teamData.id)
          .eq('user_id', profileResponse.data?.id)
          .maybeSingle(),
        supabase
          .from('team_members')
          .select('id', { count: 'exact' })
          .eq('team_id', teamData.id),
        supabase
          .from('settings')
          .select('about_me')
          .eq('user_id', profileResponse.data?.id)
          .maybeSingle()
      ]);

      if (profileResponse.error || !profileResponse.data) return null;
      if (memberResponse.error || !memberResponse.data) return null;

      const profile = profileResponse.data;
      
      const [pointsResponse, activityResponse, postsResponse, commentsResponse] = await Promise.all([
        supabase
          .from('team_member_points')
          .select('points, level')
          .eq('team_id', teamData.id)
          .eq('user_id', profile.id)
          .maybeSingle(),
        supabase
          .from('team_member_activity_log')
          .select('activity_date, activity_type, points_earned')
          .eq('team_id', teamData.id)
          .eq('user_id', profile.id)
          .order('activity_date', { ascending: false })
          .limit(50),
        supabase
          .from('team_posts')
          .select(`
            id,
            title,
            content,
            created_at,
            team_categories (name, color),
            team_post_comments (id),
            team_post_reactions (id),
            slug
          `)
          .eq('team_id', teamData.id)
          .eq('created_by', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('team_post_comments')
          .select(`
            id,
            content,
            created_at,
            team_posts (
              title,
              slug,
              team_categories (name, color)
            )
          `)
          .eq('created_by', profile.id)
          .order('created_at', { ascending: false })
      ]);

      const activities = [
        ...(postsResponse.data?.map(post => ({
          id: post.id,
          type: 'post' as const,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          category: {
            name: post.team_categories.name,
            color: post.team_categories.color,
          },
          reactions_count: post.team_post_reactions.length,
          comments_count: post.team_post_comments.length,
          slug: post.slug,
        })) || []),
        ...(commentsResponse.data?.map(comment => ({
          id: comment.id,
          type: 'comment' as const,
          content: comment.content,
          created_at: comment.created_at,
          post: {
            title: comment.team_posts.title,
            slug: comment.team_posts.slug,
            category: {
              name: comment.team_posts.team_categories.name,
              color: comment.team_posts.team_categories.color,
            },
          },
        })) || []),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        ...profile,
        teamMember: memberResponse.data,
        points: pointsResponse.data?.points ?? 0,
        level: pointsResponse.data?.level ?? 1,
        stats: {
          posts_count: postsResponse.data?.length ?? 0,
          followers_count: 0,
          following_count: 0
        },
        activity: activityResponse.data ?? [],
        activities,
        membersCount: countResponse.count ?? 0,
        aboutMe: settingsResponse.data?.about_me
      };
    },
    enabled: !!teamData?.id && !!teamSlug && !!memberSlug
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!memberData || !teamData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Mitglied nicht gefunden</div>
        </CardContent>
      </Card>
    );
  }

  const currentPoints = memberData.points;
  const currentLevel = memberData.level;
  const pointsToNextLevel = (currentLevel * 100) - currentPoints;

  return (
    <div>
      <ProfileHeader 
        teamData={teamData}
        userEmail={user?.email}
        teamSlug={teamSlug!}
      />

      <div className="container py-8 mt-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/unity/team/${teamSlug}/members`)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ActivityCalendar activities={memberData.activity} />
            <MembershipCard 
              teamData={teamData}
              membersCount={memberData.membersCount}
            />
            {memberData && (
              <ActivityFeed 
                activities={memberData.activities || []} 
                teamSlug={teamSlug!}
              />
            )}
          </div>

          <div className="space-y-6">
            <ProfileCard
              memberData={memberData}
              memberSlug={memberSlug!}
              currentLevel={currentLevel}
              currentPoints={currentPoints}
              pointsToNextLevel={pointsToNextLevel}
              aboutMe={memberData.aboutMe}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
