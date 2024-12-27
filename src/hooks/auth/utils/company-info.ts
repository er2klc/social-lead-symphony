import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

interface CompanyInfo {
  companyName: string;
  productsServices: string;
  targetAudience: string;
  usp: string;
  businessDescription: string;
}

interface RegistrationData {
  companyName: string;
  phoneNumber: string;
}

export const handleCompanyInfoFetch = async (
  userId: string,
  formData: RegistrationData,
  supabase: SupabaseClient
) => {
  try {
    console.log('Starting company info fetch for user:', userId);

    // First create initial settings record with RLS-compliant insert
    const { error: settingsError } = await supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) throw new Error('No session found');
      
      return supabase
        .from('settings')
        .insert({
          user_id: userId,
          registration_step: 1,
          language: 'de'
        });
    });

    if (settingsError) {
      console.error('Settings creation error:', settingsError);
      throw new Error('Fehler beim Erstellen der Benutzereinstellungen');
    }

    const { data, error } = await supabase.functions.invoke('fetch-company-info', {
      body: { 
        companyName: formData.companyName,
        userId: userId,
        isRegistration: true
      }
    });

    console.log('Company info fetch response:', { data, error });

    if (error) {
      console.error('Function invocation error:', error);
      throw new Error('Fehler beim Abrufen der Firmeninformationen. Bitte versuchen Sie es später erneut.');
    }

    if (!data) {
      console.error('No data returned from function');
      throw new Error('Keine Firmeninformationen gefunden. Bitte überprüfen Sie den Firmennamen.');
    }

    const { error: updateError } = await supabase
      .from('settings')
      .update({
        registration_company_name: formData.companyName,
        registration_completed: true,
        company_name: data.companyName,
        products_services: data.productsServices,
        target_audience: data.targetAudience,
        usp: data.usp,
        business_description: data.businessDescription,
        whatsapp_number: formData.phoneNumber,
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Settings update error:', updateError);
      throw new Error('Fehler beim Speichern der Firmeninformationen');
    }

    toast.success("Registrierung erfolgreich abgeschlossen! ✨");
    return true;
  } catch (error: any) {
    console.error("Error in handleCompanyInfoFetch:", error);
    toast.error(error.message || "Fehler beim Abrufen der Firmeninformationen");
    return false;
  }
};