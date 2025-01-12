import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

const Admin = () => {
  const session = useSession();

  const processPersonalData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/populate-team-embeddings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: session?.user?.id,
            processPersonalData: true 
          })
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Verarbeiten der persönlichen Daten");
      }

      toast.success("Verarbeitung der persönlichen Daten wurde gestartet");
    } catch (error) {
      console.error('Error processing personal data:', error);
      toast.error("Fehler beim Verarbeiten der persönlichen Daten");
    }
  };

  const processTeamData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/populate-team-embeddings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: session?.user?.id,
            processTeamData: true 
          })
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Verarbeiten der Team-Daten");
      }

      toast.success("Verarbeitung der Team-Daten wurde gestartet");
    } catch (error) {
      console.error('Error processing team data:', error);
      toast.error("Fehler beim Verarbeiten der Team-Daten");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Datenverarbeitung</h2>
          <div className="flex gap-4">
            <Button onClick={processPersonalData}>
              Persönliche Daten verarbeiten
            </Button>
            <Button onClick={processTeamData}>
              Team-Daten verarbeiten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;