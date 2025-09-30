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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      card_pools: {
        Row: {
          card_count: number
          created_at: string
          description: string | null
          format: string | null
          id: string
          is_active: boolean
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_count?: number
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_count?: number
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          card_object_uri: string
          cmc: number
          collector_number: string | null
          color_identity: string[] | null
          colors: string[] | null
          created_at: string
          id: string
          image_uris: Json | null
          keywords: string
          mana_cost: string | null
          name: string
          power: string | null
          rarity: string
          scryfall_id: string
          scryfall_uri: string | null
          set_code: string
          toughness: string | null
          type_line: string
          updated_at: string
        }
        Insert: {
          card_object_uri: string
          cmc: number
          collector_number?: string | null
          color_identity?: string[] | null
          colors?: string[] | null
          created_at?: string
          id?: string
          image_uris?: Json | null
          keywords: string
          mana_cost?: string | null
          name: string
          power?: string | null
          rarity: string
          scryfall_id: string
          scryfall_uri?: string | null
          set_code: string
          toughness?: string | null
          type_line: string
          updated_at?: string
        }
        Update: {
          card_object_uri?: string
          cmc?: number
          collector_number?: string | null
          color_identity?: string[] | null
          colors?: string[] | null
          created_at?: string
          id?: string
          image_uris?: Json | null
          keywords?: string
          mana_cost?: string | null
          name?: string
          power?: string | null
          rarity?: string
          scryfall_id?: string
          scryfall_uri?: string | null
          set_code?: string
          toughness?: string | null
          type_line?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          context_data: Json | null
          created_at: string
          deck_id: string | null
          id: string
          is_archived: boolean
          message_count: number
          messages: Json
          name: string
          pool_id: string | null
          token_usage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          deck_id?: string | null
          id?: string
          is_archived?: boolean
          message_count?: number
          messages?: Json
          name: string
          pool_id?: string | null
          token_usage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          deck_id?: string | null
          id?: string
          is_archived?: boolean
          message_count?: number
          messages?: Json
          name?: string
          pool_id?: string | null
          token_usage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          card_id: string
          created_at: string
          id: string
          pool_name: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          pool_name?: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          pool_name?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_cards: {
        Row: {
          card_id: string
          created_at: string
          deck_id: string
          id: string
          is_sideboard: boolean
          quantity: number
          updated_at: string
        }
        Insert: {
          card_id: string
          created_at?: string
          deck_id: string
          id?: string
          is_sideboard?: boolean
          quantity?: number
          updated_at?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          deck_id?: string
          id?: string
          is_sideboard?: boolean
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deck_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          created_at: string
          description: string | null
          format: string | null
          id: string
          is_archived: boolean
          is_public: boolean
          main_deck_count: number
          name: string
          pool_id: string | null
          sideboard_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_archived?: boolean
          is_public?: boolean
          main_deck_count?: number
          name: string
          pool_id?: string | null
          sideboard_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_archived?: boolean
          is_public?: boolean
          main_deck_count?: number
          name?: string
          pool_id?: string | null
          sideboard_count?: number
          updated_at?: string
          user_id?: string
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
