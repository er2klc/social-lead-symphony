import { Tables } from "@/integrations/supabase/types";
import { Platform } from "@/config/platforms";
import { Json } from "@/integrations/supabase/types/auth";

export type Message = Tables<"messages">;
export type Note = Tables<"notes">;
export type Task = Tables<"tasks">;
export type LeadFile = Tables<"lead_files">;
export type LinkedInPost = Tables<"linkedin_posts">;

export type PostType = "post" | "video" | "reel" | "story" | "igtv" | "Image" | "Sidecar";

export type SocialMediaPostRaw = {
  id: string;
  lead_id: string | null;
  platform: string;
  post_type: PostType;
  content: string | null;
  likes_count: number | null;
  comments_count: number | null;
  url: string | null;
  location: string | null;
  mentioned_profiles: string[] | null;
  tagged_profiles: string[] | null;
  posted_at: string | null;
  created_at: string | null;
  metadata: Json | null;
  tagged_users: Json | null;
  media_urls: string[] | null;
  media_type: string | null;
  first_comment: string | null;
  engagement_count: number | null;
  video_url: string | null;
  hashtags: string[] | null;
  local_video_path: string | null;
  local_media_paths: string[] | null;
  bucket_path: string | null;
  media_processing_status: string | null;
  processing_progress: number | null;
  error_message: string | null;
  current_file: string | null;
  local_media_urls: string[] | null;
  storage_status: string | null;
  media_count: number | null;
  timestamp?: string | null;
};

export type LeadWithRelations = {
  id: string;
  user_id: string;
  name: string;
  platform: Platform;
  industry: string;
  pipeline_id: string;
  phase_id: string;
  messages: Message[];
  tasks: Task[];
  notes: Note[];
  lead_files: LeadFile[];
  linkedin_posts: LinkedInPost[];
  social_media_posts?: SocialMediaPostRaw[];
  parent_id?: string | null;
  level?: number | null;
  avatar_url?: string | null;
  experience?: Json | null;
  education_summary?: string | null;
  social_media_stats?: Json | null;
  social_media_posts_count?: number | null;
  social_media_tagged_users?: Json | null;
  social_media_mentioned_users?: Json | null;
  archive_reason?: string | null;
  birth_date?: string | null;
  city?: string | null;
  company_name?: string | null;
  contact_type?: string | null;
  created_at?: string | null;
  current_company_name?: string | null;
  email?: string | null;
  website?: string | null;
  onboarding_progress?: Json | null;
  social_media_username?: string | null;
  social_media_bio?: string | null;
  social_media_followers?: number | null;
  social_media_following?: number | null;
  social_media_engagement_rate?: number | null;
  social_media_last_post_date?: string | null;
  social_media_categories?: string[] | null;
  social_media_verified?: boolean | null;
  social_media_profile_image_url?: string | null;
  linkedin_id?: string | null;
  position?: string | null;
  region?: string | null;
  languages?: string[] | null;
  next_steps?: Json | null;
  follow_up_date?: string | null;
  last_interaction_date?: string | null;
  network_marketing_id?: string | null;
  status?: string | null;
  notes_text?: string | null;
  last_action?: string | null;
  last_action_date?: string | null;
  last_social_media_scan?: string | null;
  phone_number?: string | null;
  updated_at?: string | null;
  slug?: string | null;
  usp?: string | null;
  social_media_interests?: string[] | null;
};