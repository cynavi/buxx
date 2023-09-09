export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: Date;
  tags?: string[];
  details?: string;
}

export namespace TransactionDB {

  export type Update = {
    id: string;
    name: string;
    amount: number;
    completed_date: Date;
    tags: string[];
    details: string;
    user_id: string;
    is_expense: boolean;
  }

  export type Save = Omit<TransactionDB.Update, 'id'>

  export type Delete = Update['id'];

  export type ResultSet = Update;
}
