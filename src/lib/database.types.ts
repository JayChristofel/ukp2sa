/* Empty database types file for now to satisfy lint */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [_ in string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
    }
    Views: {
      [_ in string]: {
        Row: Record<string, any>
      }
    }
    Functions: {
      [_ in string]: {
        Args: Record<string, any>
        Returns: unknown
      }
    }
    Enums: {
      [_ in string]: string
    }
  }
}
