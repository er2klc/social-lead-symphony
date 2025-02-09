
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "./SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { HeaderActions } from "@/components/layout/HeaderActions";

interface DashboardHeaderProps {
  userEmail: string | undefined;
}

export const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const displayName = profile?.display_name || userEmail?.split('@')[0] || "Benutzer";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background border-b md:left-[72px] md:group-hover:left-[240px] transition-[left] duration-300">
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Willkommen zurück, {displayName}! 👋
            </h1>
          </div>
          <div className="w-full md:w-[400px]">
            <SearchBar />
          </div>
          <HeaderActions profile={profile} userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
};
