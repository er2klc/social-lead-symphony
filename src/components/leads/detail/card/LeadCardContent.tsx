import { LeadAvatar } from "./LeadAvatar";
import { LeadSocialStats } from "./LeadSocialStats";
import { type Tables } from "@/integrations/supabase/types";
import { useUser } from "@supabase/auth-helpers-react";
import { Briefcase, MapPin } from "lucide-react";

interface LeadCardContentProps {
  lead: Tables<"leads"> & {
    stats?: {
      totalMembers: number;
      admins: number;
    };
  };
}

export const LeadCardContent = ({ lead }: LeadCardContentProps) => {
  const user = useUser();
  const isTeamOwner = user?.id === lead.user_id;

  // Keep both username and display name
  const socialUsername = lead.social_media_username?.split('/')?.pop();
  const displayName = lead.name;

  // Parse experience JSON if it exists and is an array
  const experienceArray = Array.isArray(lead.experience) ? lead.experience : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <LeadAvatar
          imageUrl={lead.social_media_profile_image_url || lead.avatar_url}
          name={displayName}
          platform={lead.platform}
        />
        <div className="flex-1">
          <div className="font-medium text-lg">{displayName}</div>
          {socialUsername && (
            <div className="text-sm text-gray-500">@{socialUsername}</div>
          )}
          {lead.position && lead.current_company_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Briefcase className="h-4 w-4" />
              <span>{lead.position} at {lead.current_company_name}</span>
            </div>
          )}
          {lead.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{lead.city}</span>
            </div>
          )}
          {(lead.social_media_followers !== null || lead.social_media_following !== null) && (
            <LeadSocialStats
              followers={lead.social_media_followers}
              following={lead.social_media_following}
              engagement_rate={lead.social_media_engagement_rate}
              isTeamOwner={isTeamOwner}
            />
          )}
        </div>
      </div>
      
      {lead.social_media_bio && (
        <div className="text-sm text-gray-600 leading-relaxed border-t pt-4">
          {lead.social_media_bio}
        </div>
      )}

      {experienceArray.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Experience</h3>
          <div className="space-y-2">
            {experienceArray.map((exp: any, index: number) => (
              <div key={index} className="text-sm text-gray-600">
                <div className="font-medium">{exp.title}</div>
                <div>{exp.company}</div>
                <div className="text-xs text-gray-500">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
