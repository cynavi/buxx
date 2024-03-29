import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export const supabase = createClient<Database>(
  environment.supabase.url,
  environment.supabase.key
);

export type BuxxSchema = Database['public'];
export type BuxxRow = Database['public']['Tables']['transactions']['Row'];

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
      transactions: {
        Row: {
          amount: number
          date: string
          details: string | null
          id: string
          isExpense: boolean
          name: string
          userId: string
        }
        Insert: {
          amount: number
          date: string
          details?: string | null
          id?: string
          isExpense: boolean
          name: string
          userId: string
        }
        Update: {
          amount: number
          date: string
          details: string | null
          id: string
          isExpense: boolean
          name: string
          userId: string
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      getTotalIncomeAndExpense:
        | {
        Args: {
          ownerId: string
          amountValue: number
          amountOperator: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          amountValue: number
          amountOperator: string
          transactionName: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          toDate: string
          fromDate: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          toDate: string
          fromDate: string
          amountValue: number
          amountOperator: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          toDate: string
          fromDate: string
          amountValue: number
          amountOperator: string
          transactionName: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          toDate: string
          fromDate: string
          transactionName: string
        }
        Returns: {
          expense: number
          income: number
        }[]
      }
        | {
        Args: {
          ownerId: string
          transactionName: string
        }
        Returns: {
          expense: number
          income: number
        }[]
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

export type Tables<
  PublicTableNameOrOptions extends | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
    ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never