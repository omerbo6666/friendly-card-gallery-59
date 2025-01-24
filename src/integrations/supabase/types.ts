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
      client_allocations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          percentage: number
          track_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          percentage: number
          track_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          percentage?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_allocations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          id: string
          investment_percentage: number
          investment_track: string
          monthly_expenses: number
          name: string
          profession: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_percentage: number
          investment_track: string
          monthly_expenses: number
          name: string
          profession: string
          start_date?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_percentage?: number
          investment_track?: string
          monthly_expenses?: number
          name?: string
          profession?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      index_performance: {
        Row: {
          created_at: string | null
          date: string
          id: string
          index_name: string
          monthly_return: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          index_name: string
          monthly_return: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          index_name?: string
          monthly_return?: number
        }
        Relationships: []
      }
      monthly_performance: {
        Row: {
          client_id: string | null
          created_at: string | null
          expenses: number
          id: string
          investment: number
          month: number
          portfolio_value: number
          profit: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          expenses: number
          id?: string
          investment: number
          month: number
          portfolio_value: number
          profit: number
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          expenses?: number
          id?: string
          investment?: number
          month?: number
          portfolio_value?: number
          profit?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_performance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_clients: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      insert_extended_performance_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      insert_performance_data: {
        Args: Record<PropertyKey, never>
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
