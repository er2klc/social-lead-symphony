import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useSettings } from "@/hooks/use-settings";

export const DashboardMetrics = () => {
  const session = useSession();
  const { settings } = useSettings();

  const { data: metrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const [leadsResult, tasksResult, completedLeadsResult] = await Promise.all([
        supabase
          .from("leads")
          .select("id")
          .eq("user_id", session.user.id),
        supabase
          .from("tasks")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("completed", false),
        supabase
          .from("leads")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("phase", "Abschluss"),
      ]);

      const totalLeads = leadsResult.data?.length || 0;
      const openTasks = tasksResult.data?.length || 0;
      const completedLeads = completedLeadsResult.data?.length || 0;
      const completionRate = totalLeads > 0 
        ? Math.round((completedLeads / totalLeads) * 100) 
        : 0;

      return {
        totalLeads,
        openTasks,
        completionRate
      };
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-[#1A1F2C]/60 border border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-white/90">
            {settings?.language === "en" ? "Active Leads" : "Leads in Bearbeitung"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
            {metrics?.totalLeads || 0}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1F2C]/60 border border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-white/90">
            {settings?.language === "en" ? "Open Tasks" : "Offene Aufgaben"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
            {metrics?.openTasks || 0}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1F2C]/60 border border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-white/90">
            {settings?.language === "en" ? "Completion Rate" : "Abschlussquote"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
            {metrics?.completionRate || 0}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};