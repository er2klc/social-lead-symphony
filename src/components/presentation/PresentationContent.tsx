import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { VideoPlayer } from "@/components/elevate/platform/detail/video/VideoPlayer";
import { PresentationPageData } from "./types";

interface PresentationContentProps {
  pageData: PresentationPageData;
  onProgress: (progress: number) => void;
}

export const PresentationContent = ({ pageData, onProgress }: PresentationContentProps) => {
  // Sicherstellung von Fallback-Werten
  const userDisplayName = pageData?.user?.profiles?.display_name || "Unbekannter Benutzer";
  const userAvatar =
    pageData?.user?.profiles?.avatar_url || "/images/placeholder-user-avatar.png";
  const leadName = pageData?.lead?.name || "Unbekannter Lead";
  const leadAvatar =
    pageData?.lead?.social_media_profile_image_url || "/images/placeholder-lead-avatar.png";

  return (
    <Card className="relative w-full max-w-[900px] mx-auto bg-[#1A1F2C]/60 border-white/10 shadow-lg backdrop-blur-sm p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Benutzer- und Lead-Informationen */}
        <div className="flex items-center justify-between w-full">
          {/* Benutzer-Avatar und Name */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userAvatar} alt={userDisplayName} />
              <AvatarFallback>{userDisplayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium">{userDisplayName}</span>
          </div>
          
          {/* Pfeil */}
          <div className="flex items-center space-x-3 text-white/50">
            <ArrowRight className="h-5 w-5" />
          </div>
          
          {/* Lead-Avatar und Name */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={leadAvatar} alt={leadName} />
              <AvatarFallback>{leadName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium">{leadName}</span>
          </div>
        </div>
        
        {/* Titel */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            {pageData?.title || "Keine Präsentation verfügbar"}
          </h1>
          <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
        
        {/* Video-Player */}
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <VideoPlayer
            videoUrl={
              `${pageData?.video_url || ""}?controls=0&showinfo=0&rel=0&modestbranding=1`
            }
            onProgress={onProgress}
            onDuration={(duration) => console.log("Video-Dauer:", duration)}
            autoplay={true}
          />
        </div>
      </div>
    </Card>
  );
};
