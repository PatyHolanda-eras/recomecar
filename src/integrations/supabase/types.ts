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
      conselheiros: {
        Row: {
          admin_notes: string | null
          anos_experiencia: number | null
          areas_atuacao: string[] | null
          arquetipo: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          linkedin_url: string | null
          nome_completo: string
          status: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          anos_experiencia?: number | null
          areas_atuacao?: string[] | null
          arquetipo?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          linkedin_url?: string | null
          nome_completo: string
          status?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          anos_experiencia?: number | null
          areas_atuacao?: string[] | null
          arquetipo?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          linkedin_url?: string | null
          nome_completo?: string
          status?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      diagnostico_respostas: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          respostas: Json
          viajante_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          respostas: Json
          viajante_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          respostas?: Json
          viajante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostico_respostas_viajante_id_fkey"
            columns: ["viajante_id"]
            isOneToOne: false
            referencedRelation: "viajantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_diagnostico_respostas_viajante"
            columns: ["viajante_id"]
            isOneToOne: false
            referencedRelation: "viajantes"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostico_resultados: {
        Row: {
          arquetipo: string
          conselheiro_id: string | null
          created_at: string
          deleted_at: string | null
          id: string
          viajante_id: string
        }
        Insert: {
          arquetipo: string
          conselheiro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          viajante_id: string
        }
        Update: {
          arquetipo?: string
          conselheiro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          viajante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostico_resultados_conselheiro_id_fkey"
            columns: ["conselheiro_id"]
            isOneToOne: false
            referencedRelation: "conselheiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostico_resultados_viajante_id_fkey"
            columns: ["viajante_id"]
            isOneToOne: false
            referencedRelation: "viajantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_diagnostico_resultados_viajante"
            columns: ["viajante_id"]
            isOneToOne: false
            referencedRelation: "viajantes"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          nome_completo: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome_completo: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome_completo?: string
          whatsapp?: string | null
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
      viajantes: {
        Row: {
          admin_notes: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          linkedin_url: string | null
          nome_completo: string
          status: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          linkedin_url?: string | null
          nome_completo: string
          status?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          linkedin_url?: string | null
          nome_completo?: string
          status?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_conselheiros_public: {
        Args: never
        Returns: {
          anos_experiencia: number
          areas_atuacao: string[]
          arquetipo: string
          bio: string
          created_at: string
          id: string
          nome_completo: string
        }[]
      }
      get_dashboard_stats: {
        Args: never
        Returns: {
          total_conselheiros: number
          total_viajantes: number
          total_visitors: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      soft_delete_conselheiro_profile: { Args: never; Returns: undefined }
      soft_delete_viajante_profile: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "viajante" | "conselheiro"
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
      app_role: ["admin", "viajante", "conselheiro"],
    },
  },
} as const
