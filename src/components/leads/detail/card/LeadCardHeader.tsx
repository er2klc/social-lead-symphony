import { LeadAvatar } from "./LeadAvatar";
import { LeadSocialStats } from "./LeadSocialStats";
import { Json } from "@/integrations/supabase/types";

interface LeadCardHeaderProps {
  lead: {
    name: string;
    platform: string;
    social_media_username?: string | null;
    social_media_profile_image_url?: string | null;
    avatar_url?: string | null;
    social_media_followers?: number | null;
    social_media_posts?: Json | null;
  };
}

export const LeadCardHeader = ({ lead }: LeadCardHeaderProps) => {
  // Parse social_media_posts from JSON if it exists
  const parsedPosts = lead.social_media_posts 
    ? (typeof lead.social_media_posts === 'string' 
        ? JSON.parse(lead.social_media_posts) 
        : lead.social_media_posts)
    : null;

  return (
    <div className="flex items-center gap-4">
      <LeadAvatar
        imageUrl={lead.social_media_profile_image_url || lead.avatar_url}
        name={lead.name}
        platform={lead.platform}
      />
      <div className="flex-1">
        <div className="font-medium text-lg">{lead.social_media_username || lead.name}</div>
        {lead.social_media_followers !== null && (
          <LeadSocialStats
            followers={lead.social_media_followers}
            posts={parsedPosts}
          />
        )}
      </div>
    </div>
  );
};