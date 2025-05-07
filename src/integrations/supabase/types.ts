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
      mission_participations: {
        Row: {
          created_at: string
          id: string
          mission_id: string
          status: string
          submission_data: Json | null
          updated_at: string
          user_id_p: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_id: string
          status: string
          submission_data?: Json | null
          updated_at?: string
          user_id_p: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_id?: string
          status?: string
          submission_data?: Json | null
          updated_at?: string
          user_id_p?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_participations_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          banner_image: string | null
          completion_steps: string | null
          created_at: string
          description: string
          expires_at: string | null
          faq_content: string | null
          id: string
          max_submissions_per_user: number | null
          merchant_logo: string | null
          merchant_name: string | null
          points_reward: number
          product_description: string | null
          product_images: string[] | null
          requirement_description: string | null
          start_date: string
          status: string
          terms_conditions: string | null
          title: string
          total_max_submissions: number | null
          type: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          completion_steps?: string | null
          created_at?: string
          description: string
          expires_at?: string | null
          faq_content?: string | null
          id?: string
          max_submissions_per_user?: number | null
          merchant_logo?: string | null
          merchant_name?: string | null
          points_reward: number
          product_description?: string | null
          product_images?: string[] | null
          requirement_description?: string | null
          start_date: string
          status: string
          terms_conditions?: string | null
          title: string
          total_max_submissions?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          completion_steps?: string | null
          created_at?: string
          description?: string
          expires_at?: string | null
          faq_content?: string | null
          id?: string
          max_submissions_per_user?: number | null
          merchant_logo?: string | null
          merchant_name?: string | null
          points_reward?: number
          product_description?: string | null
          product_images?: string[] | null
          requirement_description?: string | null
          start_date?: string
          status?: string
          terms_conditions?: string | null
          title?: string
          total_max_submissions?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          extended_data: Json | null
          followers_count: number
          following_count: number
          id: string
          phone_country_code: string | null
          phone_number: string | null
          points: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          extended_data?: Json | null
          followers_count?: number
          following_count?: number
          id: string
          phone_country_code?: string | null
          phone_number?: string | null
          points?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          extended_data?: Json | null
          followers_count?: number
          following_count?: number
          id?: string
          phone_country_code?: string | null
          phone_number?: string | null
          points?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      redemption_items: {
        Row: {
          banner_image: string | null
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          points_required: number
          redemption_details: string | null
          redemption_type: string | null
          terms_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          points_required: number
          redemption_details?: string | null
          redemption_type?: string | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          points_required?: number
          redemption_details?: string | null
          redemption_type?: string | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      redemption_requests: {
        Row: {
          created_at: string
          id: string
          item_id: string
          payment_details: Json | null
          points_amount: number
          status: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          payment_details?: Json | null
          points_amount: number
          status?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          payment_details?: Json | null
          points_amount?: number
          status?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redemption_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "redemption_items"
            referencedColumns: ["id"]
          },
        ]
      }
      review_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          avg_time_spent: number | null
          click_through_rate: number | null
          content: string
          created_at: string
          id: string
          images: string[]
          likes_count: number
          status: string
          updated_at: string
          user_id: string
          videos: string[] | null
          views_count: number
        }
        Insert: {
          avg_time_spent?: number | null
          click_through_rate?: number | null
          content: string
          created_at?: string
          id?: string
          images?: string[]
          likes_count?: number
          status?: string
          updated_at?: string
          user_id: string
          videos?: string[] | null
          views_count?: number
        }
        Update: {
          avg_time_spent?: number | null
          click_through_rate?: number | null
          content?: string
          created_at?: string
          id?: string
          images?: string[]
          likes_count?: number
          status?: string
          updated_at?: string
          user_id?: string
          videos?: string[] | null
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: string
          id: string
          title: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          id?: string
          title: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_point_transaction: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description: string
        }
        Returns: Json
      }
      calculate_relevance_score: {
        Args: { views: number; likes: number; avg_time: number; ctr: number }
        Returns: number
      }
      increment_points: {
        Args: { user_id_param: string; points_amount_param: number }
        Returns: number
      }
      increment_view_count: {
        Args: { review_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_avatar_url: {
        Args: { user_id: string; avatar_url: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
