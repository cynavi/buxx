import { BuxxRow, BuxxSchema, Database } from '../../../supabase/supabase';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';

export const TRANSACTIONS = 'transactions';

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type SaveTransaction = Database['public']['Tables']['transactions']['Insert'];
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];
export type DeleteTransaction = Transaction['id'];

export type BuxxFilterBuilder = PostgrestFilterBuilder<BuxxSchema, BuxxRow, Transaction[], unknown>;

export type Query = {
  toDate?: Date;
  fromDate?: Date;
  amount?: Amount;
  name?: string;
  paginate: Paginate;
};

export type Amount = {
  op: Operator;
  value: number;
};

export type Paginate = {
  pageSize: number;
  pointer: number;
  isNext: boolean;
};

export type Operator = '<' | '<=' | '==' | '!=' | '>' | '>=';

export type Summary = {
  balance: number,
  income: number,
  expense: number
};