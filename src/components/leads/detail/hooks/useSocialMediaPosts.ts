import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SocialMediaPostRaw, PostType } from "../types/lead";

export const useSocialMediaPosts = (leadId: string) => {
  return useQuery({
    queryKey: ["social-media-posts", leadId],
    queryFn: async () => {
      console.log(`🚀 API wird für Lead ID: ${leadId} ausgeführt`);
      
      // ✅ Hole alle Social Media Posts aus `social_media_posts`
      const { data: socialMediaPosts, error: postsError } = await supabase
        .from("social_media_posts")
        .select("*")
        .eq("lead_id", leadId)
        .order("posted_at", { ascending: false });

      if (postsError) {
        console.error("⚠️ Fehler beim Abrufen der Social Media Posts:", postsError);
        throw postsError;
      }

      // ✅ Hole `social_media_posts` aus `leads`
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .select("social_media_posts")
        .eq("id", leadId)
        .single();

      if (leadError) {
        console.error("⚠️ Fehler beim Abrufen der Lead-Daten:", leadError);
        throw leadError;
      }

      console.log("🚀 DEBUG: API Antwort von Supabase (Social Media Posts):", socialMediaPosts);
      console.log("🚀 DEBUG: API Antwort von Supabase (Lead Data):", leadData);

      // ✅ Parse die `social_media_posts` aus der `leads`-Tabelle
      let leadSocialPosts = [];
      if (leadData?.social_media_posts) {
        try {
          leadSocialPosts = typeof leadData.social_media_posts === "string"
            ? JSON.parse(leadData.social_media_posts)
            : leadData.social_media_posts;
        } catch (e) {
          console.error("⚠️ Fehler beim Parsen von social_media_posts aus leads:", e);
        }
      }

      // ✅ Kombiniere beide Datenquellen (social_media_posts + leads)
      const mergedPosts = socialMediaPosts.map((post): SocialMediaPostRaw => {
        const matchingLeadPost = leadSocialPosts.find((leadPost) => leadPost.id === post.id);
        
        let mediaUrls: string[] = [];
        if (post.media_urls) {
          mediaUrls = typeof post.media_urls === "string"
            ? JSON.parse(post.media_urls)
            : Array.isArray(post.media_urls)
              ? post.media_urls
              : [];
        }

        // ✅ Bevorzuge `videoUrl` aus `leads`, falls vorhanden
        const videoUrl = matchingLeadPost?.videoUrl || post.video_url || null;

        console.log(`🎥 DEBUG: Video URL für Post ID ${post.id}:`, videoUrl);

        return {
          ...post,
          media_urls: mediaUrls,
          video_url: videoUrl,
          platform: "Instagram",
          type: post.post_type || "post",
          post_type: (post.post_type || "post") as PostType,
          caption: post.content || null,
          likesCount: post.likes_count || null,
          commentsCount: post.comments_count || null,
          location: post.location || null,
          mentioned_profiles: post.mentioned_profiles || null,
          tagged_profiles: post.tagged_profiles || null,
          timestamp: post.posted_at || null,
          local_video_path: post.local_video_path || null,
          local_media_paths: post.local_media_paths || null,
        };
      });

      // ✅ Füge fehlende `videoUrl`-Einträge aus `leads` als eigene Posts hinzu
      leadSocialPosts.forEach((leadPost) => {
        const existsInMerged = mergedPosts.some((p) => p.id === leadPost.id);
        if (!existsInMerged && leadPost.videoUrl) {
          console.log(`🎥 Füge fehlenden Video-Post aus leads hinzu: ${leadPost.id}`);

          mergedPosts.push({
            id: leadPost.id,
            lead_id: leadId,
            platform: "Instagram",
            type: "video",
            post_type: "video",
            content: leadPost.caption || null,
            caption: leadPost.caption || null,
            url: leadPost.url || null,
            posted_at: leadPost.timestamp || null,
            timestamp: leadPost.timestamp || null,
            media_urls: [],
            media_type: "video",
            video_url: leadPost.videoUrl,
            likesCount: leadPost.likesCount || null,
            commentsCount: leadPost.commentsCount || null,
          } as SocialMediaPostRaw);
        }
      });

      return mergedPosts;
    },
    enabled: !!leadId,
  });
};
