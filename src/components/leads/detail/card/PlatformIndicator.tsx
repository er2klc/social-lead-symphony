
import { Instagram, Linkedin, Facebook, Video, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIndicatorProps {
  platform: string;
  size?: 'xs' | 'sm' | 'md';
}

export const PlatformIndicator = ({ 
  platform, 
  size = 'sm' 
}: PlatformIndicatorProps) => {
  const getPlatformIcon = (platform: string) => {
    switch ((platform || '').toLowerCase()) {
      case 'instagram':
        return <Instagram className="text-white" />;
      case 'linkedin':
        return <Linkedin className="text-white" />;
      case 'facebook':
        return <Facebook className="text-white" />;
      case 'tiktok':
        return <Video className="text-white" />;
      default:
        return <Users className="text-white" />;
    }
  };

  const getColor = (platform: string) => {
    switch ((platform || '').toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-br from-purple-600 to-pink-500';
      case 'linkedin':
        return 'bg-blue-600';
      case 'facebook':
        return 'bg-blue-700';
      case 'tiktok':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    'xs': 'w-5 h-5 -right-1 -top-1',
    'sm': 'w-6 h-6 -right-1 -top-1',
    'md': 'w-8 h-8 -right-2 -top-2'
  };

  const iconSizes = {
    'xs': 'h-3 w-3',
    'sm': 'h-3.5 w-3.5',
    'md': 'h-4 w-4'
  };

  return (
    <div className={cn(
      "absolute rounded-full border-2 border-white shadow-lg flex items-center justify-center",
      getColor(platform),
      sizeClasses[size]
    )}>
      <div className={cn("flex items-center justify-center", iconSizes[size])}>
        {getPlatformIcon(platform)}
      </div>
    </div>
  );
};
