import { useState } from "react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  email: string;
}

interface UserSearchProps {
  onSelectUser: (email: string) => void;
  onSwitchToEmailInput: () => void;
}

export const UserSearch = ({ onSelectUser, onSwitchToEmailInput }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      console.log("Searching for:", query);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .or(`email.ilike.%${query}%,name.ilike.%${query}%`)
        .limit(5);

      if (error) {
        console.error("Fehler bei der Suche:", error);
        throw error;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error("Fehler bei der Benutzersuche:", error);
      setSearchResults([]);
      toast.error("Fehler bei der Benutzersuche");
    }
  };

  return (
    <>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Nach Benutzern suchen..." 
          value={searchTerm}
          onValueChange={(value) => {
            setSearchTerm(value);
            searchUsers(value);
          }}
        />
        <CommandGroup>
          {searchResults.map((result) => (
            <CommandItem
              key={result.id}
              onSelect={() => onSelectUser(result.email)}
            >
              {result.email}
            </CommandItem>
          ))}
        </CommandGroup>
        {searchResults.length === 0 && (
          <CommandEmpty>Keine Benutzer gefunden.</CommandEmpty>
        )}
      </Command>
      <Button
        variant="outline"
        onClick={onSwitchToEmailInput}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        Per E-Mail einladen
      </Button>
    </>
  );
};