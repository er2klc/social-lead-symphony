
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  teamData: {
    logo_url?: string;
    name: string;
  };
  userEmail?: string;
  teamSlug: string;
}

export const ProfileHeader = ({ teamData, userEmail, teamSlug }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-[40] bg-white border-b border-sidebar-border md:left-[72px] md:group-hover:left-[240px] transition-[left] duration-300">
      <div className="h-16 px-4 flex items-center">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() => navigate(`/unity/team/${teamSlug}`)}
              >
                {teamData.logo_url ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={teamData.logo_url} alt={teamData.name} />
                    <AvatarFallback>{teamData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ) : null}
                <span>{teamData.name}</span>
              </div>
              <span className="text-muted-foreground">/</span>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-foreground">Member Details</span>
              </div>
            </div>
          </div>
          <div className="w-[300px]">
            <SearchBar />
          </div>
          <HeaderActions profile={null} userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
};
