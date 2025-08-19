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
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      afiliacion_pv_proveedor: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_aprobacion: string | null
          id: number
          id_distribuidor: number | null
          id_proveedor: number
          id_punto_venta: number
          observaciones: string | null
          updated_at: string | null
          updated_by: string | null
          usuario_aprobador: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_aprobacion?: string | null
          id?: number
          id_distribuidor?: number | null
          id_proveedor: number
          id_punto_venta: number
          observaciones?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usuario_aprobador?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_aprobacion?: string | null
          id?: number
          id_distribuidor?: number | null
          id_proveedor?: number
          id_punto_venta?: number
          observaciones?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usuario_aprobador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afiliacion_pv_proveedor_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_afiliacion"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_id_distribuidor_fkey"
            columns: ["id_distribuidor"]
            isOneToOne: false
            referencedRelation: "distribuidor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "afiliacion_pv_proveedor_usuario_aprobador_fkey"
            columns: ["usuario_aprobador"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      asignacion_certificado: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_asignacion: string | null
          id: number
          id_certificado: number
          id_distribuidor: number | null
          id_punto_venta: number | null
          tipo_asignacion: string
          updated_at: string | null
          updated_by: string | null
          usuario_asignacion: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          id?: number
          id_certificado: number
          id_distribuidor?: number | null
          id_punto_venta?: number | null
          tipo_asignacion: string
          updated_at?: string | null
          updated_by?: string | null
          usuario_asignacion?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          id?: number
          id_certificado?: number
          id_distribuidor?: number | null
          id_punto_venta?: number | null
          tipo_asignacion?: string
          updated_at?: string | null
          updated_by?: string | null
          usuario_asignacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asignacion_certificado_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "asignacion_certificado_id_certificado_fkey"
            columns: ["id_certificado"]
            isOneToOne: false
            referencedRelation: "certificado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignacion_certificado_id_distribuidor_fkey"
            columns: ["id_distribuidor"]
            isOneToOne: false
            referencedRelation: "distribuidor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignacion_certificado_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignacion_certificado_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "asignacion_certificado_usuario_asignacion_fkey"
            columns: ["usuario_asignacion"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      cat_categorias_certificado: {
        Row: {
          activo: boolean | null
          categoria: string
          clase: string
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          servicio: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          categoria: string
          clase: string
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          servicio: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          categoria?: string
          clase?: string
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          servicio?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_afiliacion: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_certificado: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_deuda: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_entidad: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_venta: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_estados_visita: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_motivos_visita: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_tipos_descuento: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_tipos_documento: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_tipos_mora: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      cat_tipos_pago: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      certificado: {
        Row: {
          categoria: string | null
          created_at: string | null
          created_by: string | null
          datos_vehiculo_externo: string | null
          estado: string | null
          fecha_registro: string | null
          foto_url: string | null
          id: number
          id_proveedor: number
          numero_serie: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          datos_vehiculo_externo?: string | null
          estado?: string | null
          fecha_registro?: string | null
          foto_url?: string | null
          id?: number
          id_proveedor: number
          numero_serie: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          datos_vehiculo_externo?: string | null
          estado?: string | null
          fecha_registro?: string | null
          foto_url?: string | null
          id?: number
          id_proveedor?: number
          numero_serie?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificado_categoria_fkey"
            columns: ["categoria"]
            isOneToOne: false
            referencedRelation: "cat_categorias_certificado"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "certificado_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "certificado_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_certificado"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "certificado_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificado_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      credito: {
        Row: {
          activo: boolean | null
          created_at: string | null
          created_by: string | null
          fecha_otorgamiento: string | null
          fecha_vencimiento: string | null
          id: number
          id_proveedor: number
          id_punto_venta: number
          limite_credito: number
          saldo_actual: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_otorgamiento?: string | null
          fecha_vencimiento?: string | null
          id?: number
          id_proveedor: number
          id_punto_venta: number
          limite_credito: number
          saldo_actual?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_otorgamiento?: string | null
          fecha_vencimiento?: string | null
          id?: number
          id_proveedor?: number
          id_punto_venta?: number
          limite_credito?: number
          saldo_actual?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credito_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "credito_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credito_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credito_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      descuento_pv: {
        Row: {
          activo: boolean | null
          created_at: string | null
          created_by: string | null
          fecha_fin: string | null
          fecha_inicio: string
          id: number
          id_proveedor: number
          id_punto_venta: number
          monto_fijo: number | null
          porcentaje: number | null
          tipo_descuento: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          id?: number
          id_proveedor: number
          id_punto_venta: number
          monto_fijo?: number | null
          porcentaje?: number | null
          tipo_descuento?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: number
          id_proveedor?: number
          id_punto_venta?: number
          monto_fijo?: number | null
          porcentaje?: number | null
          tipo_descuento?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "descuento_pv_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "descuento_pv_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "descuento_pv_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "descuento_pv_tipo_descuento_fkey"
            columns: ["tipo_descuento"]
            isOneToOne: false
            referencedRelation: "cat_tipos_descuento"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "descuento_pv_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      deuda: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_vencimiento: string
          id: number
          id_proveedor: number
          id_punto_venta: number
          id_venta: number
          monto_original: number
          monto_pendiente: number
          mora_acumulada: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_vencimiento: string
          id?: number
          id_proveedor: number
          id_punto_venta: number
          id_venta: number
          monto_original: number
          monto_pendiente: number
          mora_acumulada?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_vencimiento?: string
          id?: number
          id_proveedor?: number
          id_punto_venta?: number
          id_venta?: number
          monto_original?: number
          monto_pendiente?: number
          mora_acumulada?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deuda_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "deuda_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_deuda"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "deuda_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deuda_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deuda_id_venta_fkey"
            columns: ["id_venta"]
            isOneToOne: false
            referencedRelation: "venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deuda_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      distribuidor: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          estado: string | null
          id: number
          id_externo_db_data: number | null
          id_proveedor: number
          nombre: string | null
          telefono: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          id_proveedor: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          id_proveedor?: number
          nombre?: string | null
          telefono?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distribuidor_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "distribuidor_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_entidad"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "distribuidor_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuidor_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      pago: {
        Row: {
          created_at: string | null
          created_by: string | null
          fecha_pago: string | null
          id: number
          id_proveedor: number
          id_punto_venta: number
          monto: number
          numero_operacion: string | null
          observaciones: string | null
          tipo_pago: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fecha_pago?: string | null
          id?: number
          id_proveedor: number
          id_punto_venta: number
          monto: number
          numero_operacion?: string | null
          observaciones?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fecha_pago?: string | null
          id?: number
          id_proveedor?: number
          id_punto_venta?: number
          monto?: number
          numero_operacion?: string | null
          observaciones?: string | null
          tipo_pago?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pago_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "pago_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pago_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pago_tipo_pago_fkey"
            columns: ["tipo_pago"]
            isOneToOne: false
            referencedRelation: "cat_tipos_pago"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "pago_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      pago_deuda: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          id_deuda: number
          id_pago: number
          monto_aplicado: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          id_deuda: number
          id_pago: number
          monto_aplicado: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          id_deuda?: number
          id_pago?: number
          monto_aplicado?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pago_deuda_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "pago_deuda_id_deuda_fkey"
            columns: ["id_deuda"]
            isOneToOne: false
            referencedRelation: "deuda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pago_deuda_id_pago_fkey"
            columns: ["id_pago"]
            isOneToOne: false
            referencedRelation: "pago"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pago_deuda_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      permiso: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          id: number
          modulo: string | null
          nombre: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          modulo?: string | null
          nombre: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          modulo?: string | null
          nombre?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      politica_mora: {
        Row: {
          activo: boolean | null
          created_at: string | null
          created_by: string | null
          dias_gracia: number | null
          id: number
          id_proveedor: number
          tipo_mora: string | null
          updated_at: string | null
          updated_by: string | null
          valor: number
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          dias_gracia?: number | null
          id?: number
          id_proveedor: number
          tipo_mora?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valor: number
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          dias_gracia?: number | null
          id?: number
          id_proveedor?: number
          tipo_mora?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "politica_mora_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "politica_mora_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "politica_mora_tipo_mora_fkey"
            columns: ["tipo_mora"]
            isOneToOne: false
            referencedRelation: "cat_tipos_mora"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "politica_mora_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      proveedor: {
        Row: {
          created_at: string | null
          created_by: string | null
          direccion: string | null
          email: string
          estado: string | null
          id: number
          id_externo_db_data: number | null
          nombre: string | null
          numero_documento: string
          razon_social: string | null
          telefono: string | null
          tipo_documento: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          direccion?: string | null
          email: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          nombre?: string | null
          numero_documento: string
          razon_social?: string | null
          telefono?: string | null
          tipo_documento: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          direccion?: string | null
          email?: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          nombre?: string | null
          numero_documento?: string
          razon_social?: string | null
          telefono?: string | null
          tipo_documento?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedor_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "proveedor_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_entidad"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "proveedor_tipo_documento_fkey"
            columns: ["tipo_documento"]
            isOneToOne: false
            referencedRelation: "cat_tipos_documento"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "proveedor_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      punto_venta: {
        Row: {
          created_at: string | null
          created_by: string | null
          direccion: string | null
          email: string
          estado: string | null
          id: number
          id_externo_db_data: number | null
          nombre: string | null
          numero_documento: string
          telefono: string | null
          tipo_documento: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          direccion?: string | null
          email: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          nombre?: string | null
          numero_documento: string
          telefono?: string | null
          tipo_documento: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          direccion?: string | null
          email?: string
          estado?: string | null
          id?: number
          id_externo_db_data?: number | null
          nombre?: string | null
          numero_documento?: string
          telefono?: string | null
          tipo_documento?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "punto_venta_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "punto_venta_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_entidad"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "punto_venta_tipo_documento_fkey"
            columns: ["tipo_documento"]
            isOneToOne: false
            referencedRelation: "cat_tipos_documento"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "punto_venta_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      rol: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          id: number
          nivel_jerarquico: number
          nombre: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          nivel_jerarquico: number
          nombre: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          nivel_jerarquico?: number
          nombre?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      rol_permiso: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          id_permiso: number | null
          id_rol: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          id_permiso?: number | null
          id_rol?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          id_permiso?: number | null
          id_rol?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rol_permiso_id_permiso_fkey"
            columns: ["id_permiso"]
            isOneToOne: false
            referencedRelation: "permiso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rol_permiso_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "rol"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          estado: string | null
          id: number
          id_supabase: string
          nombre: string | null
          numero_documento: string | null
          telefono: string | null
          tipo_documento: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          estado?: string | null
          id?: number
          id_supabase: string
          nombre?: string | null
          numero_documento?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          estado?: string | null
          id?: number
          id_supabase?: string
          nombre?: string | null
          numero_documento?: string | null
          telefono?: string | null
          tipo_documento?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      usuario_rol: {
        Row: {
          activo: boolean | null
          created_at: string | null
          created_by: string | null
          fecha_asignacion: string | null
          fecha_expiracion: string | null
          id: number
          id_entidad: number | null
          id_rol: number | null
          id_usuario: number | null
          tipo_entidad: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_asignacion?: string | null
          fecha_expiracion?: string | null
          id?: number
          id_entidad?: number | null
          id_rol?: number | null
          id_usuario?: number | null
          tipo_entidad?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fecha_asignacion?: string | null
          fecha_expiracion?: string | null
          id?: number
          id_entidad?: number | null
          id_rol?: number | null
          id_usuario?: number | null
          tipo_entidad?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_rol_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "rol"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_rol_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      venta: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_venta: string | null
          id: number
          id_cliente_externo: string | null
          id_punto_venta: number
          observaciones: string | null
          precio_total: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_venta?: string | null
          id?: number
          id_cliente_externo?: string | null
          id_punto_venta: number
          observaciones?: string | null
          precio_total: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_venta?: string | null
          id?: number
          id_cliente_externo?: string | null
          id_punto_venta?: number
          observaciones?: string | null
          precio_total?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venta_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "venta_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_venta"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "venta_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      venta_certificado: {
        Row: {
          created_at: string | null
          created_by: string | null
          descuento_aplicado: number | null
          estado: string | null
          ganancia_pv: number | null
          id: number
          id_certificado: number
          id_venta: number
          monto_fijo_proveedor: number | null
          precio_venta: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          descuento_aplicado?: number | null
          estado?: string | null
          ganancia_pv?: number | null
          id?: number
          id_certificado: number
          id_venta: number
          monto_fijo_proveedor?: number | null
          precio_venta: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          descuento_aplicado?: number | null
          estado?: string | null
          ganancia_pv?: number | null
          id?: number
          id_certificado?: number
          id_venta?: number
          monto_fijo_proveedor?: number | null
          precio_venta?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venta_certificado_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "venta_certificado_id_certificado_fkey"
            columns: ["id_certificado"]
            isOneToOne: true
            referencedRelation: "certificado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_certificado_id_venta_fkey"
            columns: ["id_venta"]
            isOneToOne: false
            referencedRelation: "venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_certificado_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      visita: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_programada: string | null
          fecha_realizada: string | null
          id: number
          id_distribuidor: number | null
          id_proveedor: number | null
          id_punto_venta: number | null
          motivo: string | null
          observaciones: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_programada?: string | null
          fecha_realizada?: string | null
          id?: number
          id_distribuidor?: number | null
          id_proveedor?: number | null
          id_punto_venta?: number | null
          motivo?: string | null
          observaciones?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_programada?: string | null
          fecha_realizada?: string | null
          id?: number
          id_distribuidor?: number | null
          id_proveedor?: number | null
          id_punto_venta?: number | null
          motivo?: string | null
          observaciones?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visita_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "visita_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_visita"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "visita_id_distribuidor_fkey"
            columns: ["id_distribuidor"]
            isOneToOne: false
            referencedRelation: "distribuidor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visita_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visita_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visita_motivo_fkey"
            columns: ["motivo"]
            isOneToOne: false
            referencedRelation: "cat_motivos_visita"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "visita_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      zona: {
        Row: {
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          estado: string | null
          id: number
          id_proveedor: number
          nombre: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          estado?: string | null
          id?: number
          id_proveedor: number
          nombre: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          estado?: string | null
          id?: number
          id_proveedor?: number
          nombre?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zona_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "zona_estado_fkey"
            columns: ["estado"]
            isOneToOne: false
            referencedRelation: "cat_estados_entidad"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "zona_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "proveedor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zona_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
      }
      zona_punto_venta: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado: string | null
          fecha_asignacion: string | null
          fecha_desasignacion: string | null
          id: number
          id_punto_venta: number
          id_zona: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          fecha_desasignacion?: string | null
          id?: number
          id_punto_venta: number
          id_zona: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          fecha_asignacion?: string | null
          fecha_desasignacion?: string | null
          id?: number
          id_punto_venta?: number
          id_zona?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zona_punto_venta_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
          {
            foreignKeyName: "zona_punto_venta_id_punto_venta_fkey"
            columns: ["id_punto_venta"]
            isOneToOne: false
            referencedRelation: "punto_venta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zona_punto_venta_id_zona_fkey"
            columns: ["id_zona"]
            isOneToOne: false
            referencedRelation: "zona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zona_punto_venta_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_supabase"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
