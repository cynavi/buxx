import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { BUXX_TABLE, BuxxRow, BuxxSchema, Transaction, TransactionDB } from '@buxx/shared/model';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { supabase } from '@buxx/shared/app-config';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Injectable()
export class TransactionService {

  getTransactions(query: PostgrestFilterBuilder<BuxxSchema, BuxxRow, TransactionDB.ResultSet[], unknown>,
                  isExpense: boolean): Observable<Transaction[]> {
    return from(query.eq('is_expense', isExpense))
      .pipe(map((response: PostgrestSingleResponse<TransactionDB.Update[]>) => {
        const transactions: Transaction[] = [];
        response?.data?.forEach((entry: TransactionDB.ResultSet) => transactions.push({
            id: entry.id,
            name: entry.name,
            amount: entry.amount,
            date: entry.completed_date,
            details: entry.details,
            tags: entry.tags
          })
        );
        return transactions;
      }));
  }

  saveTransaction(transaction: TransactionDB.Save): PostgrestFilterBuilder<BuxxSchema, BuxxRow, null, unknown> {
    return supabase.from(BUXX_TABLE).insert(transaction);
  }

  updateTransaction(transaction: TransactionDB.Update): PostgrestFilterBuilder<BuxxSchema, BuxxRow, null, unknown> {
    return supabase.from(BUXX_TABLE).update(transaction).eq('id', transaction.id);
  }

  deleteTransaction(id: TransactionDB.Delete): PostgrestFilterBuilder<BuxxSchema, BuxxRow, null, unknown> {
    return supabase.from(BUXX_TABLE).delete().eq('id', id);
  }
}
