import React, { useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Image, MessageCircle, Heart, MapPin, User, Link as LinkIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaGallery } from "./MediaGallery";
import { PostMetadata } from "./PostMetadata";

interface SocialMediaPost {
  id: string;
  platform: string;
  post_type: string;
  content: string | null;
  likes_count: number | null;
  comments_count: number | null;
  url: string | null;
  location: string | null;
  mentioned_profiles: string[] | null;
  tagged_profiles: string[] | null;
  posted_at: string | null;
  metadata: {
    hashtags?: string[];
    media_urls?: string[];
    videoUrl?: string;
    musicInfo?: any;
    alt?: string;
  };
  media_urls: string[] | null;
  media_type: string | null;
  local_video_path: string | null;
  local_media_paths: string[] | null;
  video_url: string | null;
}

interface SocialMediaPostProps {
  post: SocialMediaPost;
}

export const SocialMediaPost = ({ post }: SocialMediaPostProps) => {
  // Funktion, um die URLs der Medien zurückzugeben
  const getMediaUrls = () => {
    if (post.media_urls && post.media_urls.length > 0) {
      return post.media_urls; // Gebe die Bild-URLs zurück
    }

    if (post.video_url) {
      return [post.video_url]; // Gebe die Video-URL zurück
    }

    return []; // Keine Medien vorhanden
  };

  // Debugging: Gib die gefundenen Medien-URLs in der Konsole aus
  useEffect(() => {
    console.log('Media URLs:', getMediaUrls());
  }, [post.media_urls, post.video_url]);

  return (
    <div className="flex gap-4 items-start ml-4">
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border-2 border-white">
          {post.media_type === 'video' ? (
            <Video className="h-4 w-4" />
          ) : (
            <Image className="h-4 w-4" />
          )}
        </div>
      </div>

      <Card className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {post.posted_at && format(new Date(post.posted_at), 'PPp', { locale: de })}
          </span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {post.media_type === 'video' ? 'Video' : 'Post'}
          </span>
        </div>

        {post.content && (
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Medienanzeige */}
        {getMediaUrls().length > 0 && (
          <div className="flex gap-4">
            {getMediaUrls().map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={`Media ${index + 1}`} 
                className="w-32 h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {/* Metadaten des Posts */}
        <PostMetadata post={post} />

        {/* Getaggte Profile */}
        {post.tagged_profiles && post.tagged_profiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Getaggte Profile:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tagged_profiles.map((profile, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <User className="h-3 w-3" />
                  {profile}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Link zum Beitrag */}
        {post.url && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => window.open(post.url, '_blank')}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Zum Beitrag
          </Button>
        )}
      </Card>
    </div>
  );
};
