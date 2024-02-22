import { Database } from '../../../supabase/supabase';

export const TRANSACTIONS = 'transactions';

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type SaveTransaction = Database['public']['Tables']['transactions']['Insert'];
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];
export type DeleteTransaction = Transaction['id'];

export type Query = {
  toDate?: Date;
  fromDate?: Date;
  amount?: {
    op: Operator;
    value: number;
  };
  name?: string;
};

export type Operator = '<' | '<=' | '==' | '!=' | '>' | '>=';