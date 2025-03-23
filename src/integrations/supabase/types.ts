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
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_id: string
          status: string
          submission_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_id?: string
          status?: string
          submission_data?: Json | null
          updated_at?: string
          user_id?: string
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
          created_at: string
          description: string
          expires_at: string | null
          id: string
          max_submissions_per_user: number | null
          merchant_logo: string | null
          merchant_name: string | null
          points_reward: number
          requirement_description: string | null
          start_date: string
          status: string
          terms_conditions: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          max_submissions_per_user?: number | null
          merchant_logo?: string | null
          merchant_name?: string | null
          points_reward: number
          requirement_description?: string | null
          start_date: string
          status: string
          terms_conditions?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          max_submissions_per_user?: number | null
          merchant_logo?: string | null
          merchant_name?: string | null
          points_reward?: number
          requirement_description?: string | null
          start_date?: string
          status?: string
          terms_conditions?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          extended_data: Json | null
          followers_count: number
          following_count: number
          id: string
          phone_country_code: string | null
          points: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          extended_data?: Json | null
          followers_count?: number
          following_count?: number
          id: string
          phone_country_code?: string | null
          points?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          extended_data?: Json | null
          followers_count?: number
          following_count?: number
          id?: string
          phone_country_code?: string | null
          points?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      redemption_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          payment_details: Json | null
          points_amount: number
          redemption_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          payment_details?: Json | null
          points_amount: number
          redemption_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          payment_details?: Json | null
          points_amount?: number
          redemption_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_relevance_score: {
        Args: {
          views: number
          likes: number
          avg_time: number
          ctr: number
        }
        Returns: number
      }
      increment_view_count: {
        Args: {
          review_id: string
        }
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
