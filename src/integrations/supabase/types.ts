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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          area_of_interest: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          organisation: string | null
          phone: string | null
        }
        Insert: {
          area_of_interest?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          organisation?: string | null
          phone?: string | null
        }
        Update: {
          area_of_interest?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          organisation?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      insights: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string | null
          created_at: string
          display_order: number
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          case_study_url: string | null
          client: string | null
          created_at: string
          description: string | null
          display_order: number
          featured: boolean
          id: string
          image_url: string | null
          impact: string | null
          name: string
          sector: string | null
          services: string[]
          slug: string
          updated_at: string
          year: number | null
        }
        Insert: {
          case_study_url?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_url?: string | null
          impact?: string | null
          name: string
          sector?: string | null
          services?: string[]
          slug: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          case_study_url?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          id?: string
          image_url?: string | null
          impact?: string | null
          name?: string
          sector?: string | null
          services?: string[]
          slug?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          capabilities: string[]
          deliverables: string[]
          description: string | null
          display_order: number
          id: string
          slug: string
          title: string
        }
        Insert: {
          capabilities?: string[]
          deliverables?: string[]
          description?: string | null
          display_order?: number
          id?: string
          slug: string
          title: string
        }
        Update: {
          capabilities?: string[]
          deliverables?: string[]
          description?: string | null
          display_order?: number
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          label: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          label?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          label?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          display_order: number
          id: string
          label: string
          suffix: string | null
          value: string
        }
        Insert: {
          display_order?: number
          id?: string
          label: string
          suffix?: string | null
          value: string
        }
        Update: {
          display_order?: number
          id?: string
          label?: string
          suffix?: string | null
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          position: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          position?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          position?: string | null
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          description: string | null
          display_order: number
          id: string
          title: string
          year: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          id?: string
          title: string
          year: string
        }
        Update: {
          description?: string | null
          display_order?: number
          id?: string
          title?: string
          year?: string
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
      ventures: {
        Row: {
          categories: string[]
          category: string | null
          cover_image_url: string | null
          created_at: string
          cta_label: string | null
          display_order: number
          featured: boolean
          full_description: string | null
          id: string
          logo_url: string | null
          name: string
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["venture_status"]
          updated_at: string
          url: string | null
        }
        Insert: {
          categories?: string[]
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_label?: string | null
          display_order?: number
          featured?: boolean
          full_description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["venture_status"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          categories?: string[]
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_label?: string | null
          display_order?: number
          featured?: boolean
          full_description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["venture_status"]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_editor: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      venture_status: "active" | "developing" | "coming_soon"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor", "user"],
      venture_status: ["active", "developing", "coming_soon"],
    },
  },
} as const
