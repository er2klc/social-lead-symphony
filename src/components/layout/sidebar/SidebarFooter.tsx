import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

interface SidebarFooterProps {
  isExpanded: boolean;
  currentVersion: string;
}

export const SidebarFooter = ({ isExpanded }: SidebarFooterProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
     <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>
      <div className="bg-[#111111] p-1">
      <DropdownMenu 
        open={isMenuOpen} 
        onOpenChange={setIsMenuOpen}
        modal={true}
      >
        <DropdownMenuTrigger 
          className="w-full focus:outline-none group-hover:!bg-transparent"
          onClick={(e) => {
            // Prevent event propagation to stop sidebar from expanding
            e.stopPropagation();
          }}
        >
          <div
            className={`flex items-center gap-3 p-2 rounded-md transition-colors group cursor-pointer hover:bg-white/10 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
            onClick={(e) => {
              // Prevent event propagation to stop sidebar from expanding
              e.stopPropagation();
            }}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <span className="text-sm text-white/80">
                {user?.user_metadata?.display_name || user?.email}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="w-[200px] bg-[#222222] border border-white/10 shadow-lg rounded-md overflow-hidden"
        >
          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/plan")}
            className="text-white"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Plan</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/billing")}
            className="text-white"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Rechnung</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Abmelden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
