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
      ai_decisions: {
        Row: {
          action: string
          confidence: number | null
          created_at: string
          engine: string | null
          id: number
          rationale: string | null
          symbol: string | null
        }
        Insert: {
          action: string
          confidence?: number | null
          created_at?: string
          engine?: string | null
          id?: never
          rationale?: string | null
          symbol?: string | null
        }
        Update: {
          action?: string
          confidence?: number | null
          created_at?: string
          engine?: string | null
          id?: never
          rationale?: string | null
          symbol?: string | null
        }
        Relationships: []
      }
      ml_predictions: {
        Row: {
          confidence: number | null
          horizon_days: number | null
          id: number
          model: string
          predicted_at: string
          predicted_value: number | null
          prediction_type: string
          signal: string | null
          symbol: string
        }
        Insert: {
          confidence?: number | null
          horizon_days?: number | null
          id?: never
          model: string
          predicted_at?: string
          predicted_value?: number | null
          prediction_type: string
          signal?: string | null
          symbol: string
        }
        Update: {
          confidence?: number | null
          horizon_days?: number | null
          id?: never
          model?: string
          predicted_at?: string
          predicted_value?: number | null
          prediction_type?: string
          signal?: string | null
          symbol?: string
        }
        Relationships: []
      }
      model_metrics: {
        Row: {
          created_at: string
          horizon_days: number | null
          id: number
          metric: string
          model: string
          n_folds: number | null
          n_samples: number | null
          notes: string | null
          symbol: string | null
          task: string
          value: number
        }
        Insert: {
          created_at?: string
          horizon_days?: number | null
          id?: never
          metric: string
          model: string
          n_folds?: number | null
          n_samples?: number | null
          notes?: string | null
          symbol?: string | null
          task: string
          value: number
        }
        Update: {
          created_at?: string
          horizon_days?: number | null
          id?: never
          metric?: string
          model?: string
          n_folds?: number | null
          n_samples?: number | null
          notes?: string | null
          symbol?: string | null
          task?: string
          value?: number
        }
        Relationships: []
      }
      movements: {
        Row: {
          alpaca_order_id: string | null
          amount: number
          executed_at: string
          id: number
          price: number
          quantity: number
          side: string
          symbol: string
        }
        Insert: {
          alpaca_order_id?: string | null
          amount: number
          executed_at?: string
          id?: never
          price: number
          quantity: number
          side: string
          symbol: string
        }
        Update: {
          alpaca_order_id?: string | null
          amount?: number
          executed_at?: string
          id?: never
          price?: number
          quantity?: number
          side?: string
          symbol?: string
        }
        Relationships: []
      }
      performance: {
        Row: {
          benchmark_return_pct: number | null
          created_at: string
          cumulative_return_pct: number | null
          daily_return_pct: number | null
          id: number
          snapshot_date: string
          total_value: number
        }
        Insert: {
          benchmark_return_pct?: number | null
          created_at?: string
          cumulative_return_pct?: number | null
          daily_return_pct?: number | null
          id?: never
          snapshot_date: string
          total_value: number
        }
        Update: {
          benchmark_return_pct?: number | null
          created_at?: string
          cumulative_return_pct?: number | null
          daily_return_pct?: number | null
          id?: never
          snapshot_date?: string
          total_value?: number
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          avg_price: number
          current_price: number | null
          id: number
          market_value: number | null
          quantity: number
          symbol: string
          unrealized_pnl: number | null
          updated_at: string
          weight_pct: number | null
        }
        Insert: {
          avg_price?: number
          current_price?: number | null
          id?: never
          market_value?: number | null
          quantity?: number
          symbol: string
          unrealized_pnl?: number | null
          updated_at?: string
          weight_pct?: number | null
        }
        Update: {
          avg_price?: number
          current_price?: number | null
          id?: never
          market_value?: number | null
          quantity?: number
          symbol?: string
          unrealized_pnl?: number | null
          updated_at?: string
          weight_pct?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
