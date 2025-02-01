import { SocialMediaPost } from "./social/SocialMediaPost";
import { SocialMediaPostRaw, PostType } from "../types/lead";

interface SocialMediaTimelineProps {
  posts: SocialMediaPostRaw[];
  linkedInPosts?: any[];
  platform?: string;
  kontaktIdFallback?: string;
}

export const SocialMediaTimeline = ({ posts, linkedInPosts, platform, kontaktIdFallback }: SocialMediaTimelineProps) => {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(a.posted_at || '');
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(b.posted_at || '');
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="relative space-y-6">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <SocialMediaPost 
            key={post.id} 
            post={{
              ...post,
              post_type: post.post_type as PostType // Ensure correct type casting
            }}
            kontaktIdFallback={kontaktIdFallback}
          />
        ))
      ) : (
        <div className="text-center text-muted-foreground py-4 ml-4">
          Keine Social Media Aktivitäten vorhanden
        </div>
      )}
    </div>
  );
};