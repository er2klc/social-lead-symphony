export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      changelog_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string
          id: string
          status: string
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description: string
          id?: string
          status?: string
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          file_path: string
          file_type: string
          filename: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_type: string
          filename: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_type?: string
          filename?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      elevate_lerninhalte: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          module_id: string | null
          submodule_order: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          module_id?: string | null
          submodule_order?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          module_id?: string | null
          submodule_order?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elevate_lerninhalte_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "elevate_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_module"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "elevate_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_module_id"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "elevate_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      elevate_lerninhalte_documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          lerninhalte_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          lerninhalte_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          lerninhalte_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elevate_lerninhalte_documents_lerninhalte_id_fkey"
            columns: ["lerninhalte_id"]
            isOneToOne: false
            referencedRelation: "elevate_lerninhalte"
            referencedColumns: ["id"]
          },
        ]
      }
      elevate_lerninhalte_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lerninhalte_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lerninhalte_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lerninhalte_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elevate_lerninhalte_notes_lerninhalte_id_fkey"
            columns: ["lerninhalte_id"]
            isOneToOne: false
            referencedRelation: "elevate_lerninhalte"
            referencedColumns: ["id"]
          },
        ]
      }
      elevate_modules: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          module_order: number | null
          order_index: number | null
          platform_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          module_order?: number | null
          order_index?: number | null
          platform_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          module_order?: number | null
          order_index?: number | null
          platform_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "elevate_modules_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elevate_modules_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms_access"
            referencedColumns: ["platform_id"]
          },
        ]
      }
      elevate_platforms: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          image_url: string | null
          invite_code: string | null
          linked_modules: string[] | null
          logo_url: string | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          image_url?: string | null
          invite_code?: string | null
          linked_modules?: string[] | null
          logo_url?: string | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          invite_code?: string | null
          linked_modules?: string[] | null
          logo_url?: string | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      elevate_team_access: {
        Row: {
          granted_at: string | null
          granted_by: string
          id: string
          platform_id: string
          team_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by: string
          id?: string
          platform_id: string
          team_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string
          id?: string
          platform_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elevate_team_access_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elevate_team_access_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms_access"
            referencedColumns: ["platform_id"]
          },
          {
            foreignKeyName: "elevate_team_access_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      elevate_user_access: {
        Row: {
          access_type: string
          granted_at: string | null
          granted_by: string
          id: string
          platform_id: string
          user_id: string
        }
        Insert: {
          access_type?: string
          granted_at?: string | null
          granted_by: string
          id?: string
          platform_id: string
          user_id: string
        }
        Update: {
          access_type?: string
          granted_at?: string | null
          granted_by?: string
          id?: string
          platform_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elevate_user_access_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elevate_user_access_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "elevate_platforms_access"
            referencedColumns: ["platform_id"]
          },
        ]
      }
      elevate_user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lerninhalte_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lerninhalte_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lerninhalte_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elevate_user_progress_lerninhalte_id_fkey"
            columns: ["lerninhalte_id"]
            isOneToOne: false
            referencedRelation: "elevate_lerninhalte"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          created_at: string | null
          id: string
          keyword: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          keyword: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          keyword?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_phases: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_description: string | null
          company_name: string | null
          contact_type: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string
          last_action: string | null
          last_action_date: string | null
          last_social_media_scan: string | null
          name: string
          notes: string | null
          phase: string
          phone_number: string | null
          platform: string
          products_services: string | null
          social_media_bio: string | null
          social_media_interests: string[] | null
          social_media_posts: Json | null
          social_media_username: string | null
          target_audience: string | null
          updated_at: string | null
          user_id: string
          usp: string | null
        }
        Insert: {
          business_description?: string | null
          company_name?: string | null
          contact_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry: string
          last_action?: string | null
          last_action_date?: string | null
          last_social_media_scan?: string | null
          name: string
          notes?: string | null
          phase?: string
          phone_number?: string | null
          platform: string
          products_services?: string | null
          social_media_bio?: string | null
          social_media_interests?: string[] | null
          social_media_posts?: Json | null
          social_media_username?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_id: string
          usp?: string | null
        }
        Update: {
          business_description?: string | null
          company_name?: string | null
          contact_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string
          last_action?: string | null
          last_action_date?: string | null
          last_social_media_scan?: string | null
          name?: string
          notes?: string | null
          phase?: string
          phone_number?: string | null
          platform?: string
          products_services?: string | null
          social_media_bio?: string | null
          social_media_interests?: string[] | null
          social_media_posts?: Json | null
          social_media_username?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_id?: string
          usp?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          id: string
          lead_id: string | null
          platform: string
          read: boolean
          sent_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          lead_id?: string | null
          platform: string
          read?: boolean
          sent_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          lead_id?: string | null
          platform?: string
          read?: boolean
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color: string | null
          content: string
          created_at: string | null
          id: string
          lead_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          lead_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          lead_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_auth_status: {
        Row: {
          access_token: string | null
          auth_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_connected: boolean | null
          platform: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          auth_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          platform: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          auth_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          platform?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          about_me: string | null
          business_description: string | null
          company_name: string | null
          created_at: string | null
          default_message_template: string | null
          facebook_auth_token: string | null
          facebook_connected: boolean | null
          id: string
          instagram_app_id: string | null
          instagram_app_secret: string | null
          instagram_auth_token: string | null
          instagram_connected: boolean | null
          language: string | null
          linkedin_auth_token: string | null
          linkedin_connected: boolean | null
          openai_api_key: string | null
          products_services: string | null
          registration_company_name: string | null
          registration_completed: boolean | null
          registration_step: number | null
          superchat_api_key: string | null
          target_audience: string | null
          tiktok_auth_token: string | null
          tiktok_connected: boolean | null
          updated_at: string | null
          user_id: string
          usp: string | null
          whatsapp_number: string | null
          whatsapp_verified: boolean | null
        }
        Insert: {
          about_me?: string | null
          business_description?: string | null
          company_name?: string | null
          created_at?: string | null
          default_message_template?: string | null
          facebook_auth_token?: string | null
          facebook_connected?: boolean | null
          id?: string
          instagram_app_id?: string | null
          instagram_app_secret?: string | null
          instagram_auth_token?: string | null
          instagram_connected?: boolean | null
          language?: string | null
          linkedin_auth_token?: string | null
          linkedin_connected?: boolean | null
          openai_api_key?: string | null
          products_services?: string | null
          registration_company_name?: string | null
          registration_completed?: boolean | null
          registration_step?: number | null
          superchat_api_key?: string | null
          target_audience?: string | null
          tiktok_auth_token?: string | null
          tiktok_connected?: boolean | null
          updated_at?: string | null
          user_id: string
          usp?: string | null
          whatsapp_number?: string | null
          whatsapp_verified?: boolean | null
        }
        Update: {
          about_me?: string | null
          business_description?: string | null
          company_name?: string | null
          created_at?: string | null
          default_message_template?: string | null
          facebook_auth_token?: string | null
          facebook_connected?: boolean | null
          id?: string
          instagram_app_id?: string | null
          instagram_app_secret?: string | null
          instagram_auth_token?: string | null
          instagram_connected?: boolean | null
          language?: string | null
          linkedin_auth_token?: string | null
          linkedin_connected?: boolean | null
          openai_api_key?: string | null
          products_services?: string | null
          registration_company_name?: string | null
          registration_completed?: boolean | null
          registration_step?: number | null
          superchat_api_key?: string | null
          target_audience?: string | null
          tiktok_auth_token?: string | null
          tiktok_connected?: boolean | null
          updated_at?: string | null
          user_id?: string
          usp?: string | null
          whatsapp_number?: string | null
          whatsapp_verified?: boolean | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          color: string | null
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          meeting_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          meeting_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          color?: string | null
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          meeting_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      team_categories: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          order_index: number
          slug: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          slug: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          slug?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_categories_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_hidden_snaps: {
        Row: {
          created_at: string | null
          hidden_by: string
          id: string
          snap_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          hidden_by: string
          id?: string
          snap_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          hidden_by?: string
          id?: string
          snap_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_hidden_snaps_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_news: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          pinned: boolean | null
          team_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          pinned?: boolean | null
          team_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          pinned?: boolean | null
          team_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_news_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_post_comments: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "team_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      team_posts: {
        Row: {
          category_id: string
          content: string
          created_at: string | null
          created_by: string
          file_urls: string[] | null
          id: string
          pinned: boolean | null
          team_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string | null
          created_by: string
          file_urls?: string[] | null
          id?: string
          pinned?: boolean | null
          team_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          file_urls?: string[] | null
          id?: string
          pinned?: boolean | null
          team_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "team_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_posts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          join_code: string | null
          logo_url: string | null
          max_members: number | null
          name: string
          order_index: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          join_code?: string | null
          logo_url?: string | null
          max_members?: number | null
          name: string
          order_index?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          join_code?: string | null
          logo_url?: string | null
          max_members?: number | null
          name?: string
          order_index?: number | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      elevate_platforms_access: {
        Row: {
          platform_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_elevate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_join_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_slug: {
        Args: {
          base_slug: string
          table_name: string
          existing_id?: string
        }
        Returns: string
      }
      get_user_teams: {
        Args: {
          uid: string
        }
        Returns: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          join_code: string | null
          logo_url: string | null
          max_members: number | null
          name: string
          order_index: number | null
          slug: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
