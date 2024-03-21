import { BuxxRow, BuxxSchema, Database } from '../../../supabase/supabase';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';

export const TRANSACTIONS = 'transactions';

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type SaveTransaction = Database['public']['Tables']['transactions']['Insert'];
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];
export type DeleteTransaction = Transaction['id'];

export type BuxxFilterBuilder = PostgrestFilterBuilder<BuxxSchema, BuxxRow, Transaction[], unknown>;

export type Query = {
  criteria?: Criteria;
  paginate?: Paginate;
};

export type Amount = {
  op: Operator;
  value: number;
};

export type Criteria =  {
  date?: {
    start: Date;
    end: Date;
  }
  amount?: Amount;
  name?: string;
};

export type Paginate = {
  range: {
    start: number;
    end: number;
  };
  pointer: number;
};

export type Operator = '<' | '<=' | '==' | '!=' | '>' | '>=';

export type Summary = {
  balance: number,
  income: number,
  expense: number
};

export type RecentTransaction = Transaction & { action: 'DELETED' | 'SAVED' };