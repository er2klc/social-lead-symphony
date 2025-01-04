import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "ai/react";
import { Bot, SendHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setSessionToken(session.access_token);

      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('openai_api_key')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching API key:", error);
        return;
      }

      if (data?.openai_api_key) {
        console.log("✅ OpenAI API Key found");
        setApiKey(data.openai_api_key);
      } else {
        console.warn("⚠️ No OpenAI API Key found");
      }
    };

    if (open) {
      setupChat();
    }
  }, [open]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'X-OpenAI-Key': apiKey || '',
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.");
    },
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>Chat mit KI-Assistent</DialogTitle>
        <DialogDescription>
          Ich helfe Ihnen gerne bei Ihren Fragen und Anliegen.
        </DialogDescription>
        <div className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 text-slate-600 text-sm mb-4",
                    message.role === "user" && "justify-end"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[85%] text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              placeholder="Schreibe eine Nachricht..."
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}