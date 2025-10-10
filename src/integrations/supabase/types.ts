export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean | null
          author_email: string
          author_name: string
          author_user_id: string | null
          blog_post_id: string
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          spam_score: number | null
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          author_email: string
          author_name: string
          author_user_id?: string | null
          blog_post_id: string
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          spam_score?: number | null
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          author_email?: string
          author_name?: string
          author_user_id?: string | null
          blog_post_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          spam_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean | null
          auto_delete_at: string | null
          categories: string[] | null
          content: string
          created_at: string
          custom_title: string | null
          excerpt: string | null
          external_links: string[] | null
          featured_image_alt: string | null
          featured_image_url: string | null
          id: string
          image_url: string | null
          internal_links: string[] | null
          meta_description: string | null
          published: boolean | null
          reading_time: number | null
          scheduled_publish_at: string | null
          schema_type: string | null
          seo_focus_keyword: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          version: number | null
          word_count: number | null
        }
        Insert: {
          allow_comments?: boolean | null
          auto_delete_at?: string | null
          categories?: string[] | null
          content: string
          created_at?: string
          custom_title?: string | null
          excerpt?: string | null
          external_links?: string[] | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          internal_links?: string[] | null
          meta_description?: string | null
          published?: boolean | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_focus_keyword?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: number | null
          word_count?: number | null
        }
        Update: {
          allow_comments?: boolean | null
          auto_delete_at?: string | null
          categories?: string[] | null
          content?: string
          created_at?: string
          custom_title?: string | null
          excerpt?: string | null
          external_links?: string[] | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          internal_links?: string[] | null
          meta_description?: string | null
          published?: boolean | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          schema_type?: string | null
          seo_focus_keyword?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          auto_delete_at: string | null
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          impact: string | null
          link_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          auto_delete_at?: string | null
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          impact?: string | null
          link_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          auto_delete_at?: string | null
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          impact?: string | null
          link_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          content: string
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          mentions: string[] | null
          platform: string
          post_title: string | null
          post_url: string | null
          posted_at: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          mentions?: string[] | null
          platform: string
          post_title?: string | null
          post_url?: string | null
          posted_at?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          mentions?: string[] | null
          platform?: string
          post_title?: string | null
          post_url?: string | null
          posted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          organization: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          organization?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          organization?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
