import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAuthFormState } from "@/hooks/auth/use-auth-form-state";
import { useAuthForm } from "@/hooks/use-auth-form";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const AuthFormContent = () => {
  const location = useLocation();
  const {
    isSignUp,
    setIsSignUp,
    registrationStep,
    setRegistrationStep,
    handleSocialLogin,
  } = useAuthFormState();

  const {
    isLoading,
    formData,
    handleSubmit,
    handleInputChange,
    cooldownRemaining,
    setFormData,
  } = useAuthForm();

  // Handle initial email from navigation state
  useEffect(() => {
    const state = location.state as { isSignUp?: boolean; initialEmail?: string } | null;
    if (state?.isSignUp) {
      setIsSignUp(true);
    }
    if (state?.initialEmail) {
      setFormData(prev => ({ ...prev, email: state.initialEmail }));
    }
  }, [location.state, setIsSignUp, setFormData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp ? (
        <RegistrationForm
          registrationStep={registrationStep}
          formData={formData}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onLanguageChange={(value) =>
            handleInputChange({
              target: { name: "language", value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      ) : (
        <LoginForm
          formData={formData}
          isLoading={isLoading}
          onInputChange={handleInputChange}
        />
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || cooldownRemaining > 0}
      >
        {isLoading ? (
          <span>Laden...</span>
        ) : cooldownRemaining > 0 ? (
          `Bitte warten (${cooldownRemaining}s)`
        ) : isSignUp ? (
          registrationStep === 1 ? "Weiter" : "Registrieren"
        ) : (
          "Anmelden"
        )}
      </Button>

      {!isSignUp && (
        <SocialLoginButtons
          onGoogleLogin={() => handleSocialLogin("google")}
          onAppleLogin={() => handleSocialLogin("apple")}
          isLoading={isLoading}
        />
      )}

      {registrationStep === 2 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setRegistrationStep(1)}
          disabled={isLoading}
        >
          Zurück
        </Button>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setRegistrationStep(1);
          }}
          className="text-sm text-muted-foreground hover:underline"
          disabled={isLoading}
        >
          {isSignUp
            ? "Bereits registriert? Hier anmelden"
            : "Noch kein Account? Hier registrieren"}
        </button>
      </div>
    </form>
  );
};