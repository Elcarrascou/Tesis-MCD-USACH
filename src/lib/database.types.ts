export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
