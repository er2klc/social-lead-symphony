import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsCheckingSession(false);
        return !!session;
      } catch (error) {
        console.error("[Auth] Session check error:", error);
        setIsCheckingSession(false);
        return false;
      }
    };

    checkSession();
  }, []);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    ...context,
    isLoading: context.isLoading || isCheckingSession
  };
};