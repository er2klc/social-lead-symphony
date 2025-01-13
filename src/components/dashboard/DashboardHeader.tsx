import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  userEmail: string | undefined;
}

export const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyQuote, setDailyQuote] = useState<string>("");

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

  // Fetch daily quote
  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const storedQuote = localStorage.getItem('dailyQuote');
        const storedDate = localStorage.getItem('dailyQuoteDate');
        const today = new Date().toDateString();

        if (storedQuote && storedDate === today) {
          setDailyQuote(storedQuote);
          return;
        }

        const { data, error } = await supabase.functions.invoke('generate-daily-quote');
        
        if (error) throw error;
        
        const quote = data.quote;
        setDailyQuote(quote);
        localStorage.setItem('dailyQuote', quote);
        localStorage.setItem('dailyQuoteDate', today);
      } catch (error) {
        console.error('Error fetching daily quote:', error);
        setDailyQuote("Mache jeden Tag zu deinem Meisterwerk! 🌟");
      }
    };

    fetchDailyQuote();
  }, [supabase.functions]);

  const displayName = profile?.display_name || userEmail?.split('@')[0] || "Benutzer";

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes('session_not_found')) {
          console.info('Session already expired, proceeding with cleanup');
        } else {
          throw error;
        }
      }

      toast({
        title: "Erfolgreich abgemeldet",
        description: "Auf Wiedersehen!",
      });

      navigate("/auth", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Abmeldung",
        description: "Sie wurden aus Sicherheitsgründen abgemeldet.",
      });
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Willkommen, {displayName}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Hier ist Ihr aktueller Überblick
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full md:w-auto">
            Abmelden
          </Button>
        </div>
      </div>
      {dailyQuote && (
        <div className="bg-primary/5 p-3 md:p-4 rounded-lg">
          <p className="text-base md:text-lg text-primary italic text-center">
            "{dailyQuote}"
          </p>
        </div>
      )}
    </div>
  );
};