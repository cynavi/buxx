import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable } from 'rxjs';
import { Query } from '../../shared/model/buxx.model';
import { supabase } from '../../../supabase/supabase';
import { AuthStore } from '../../shared/data-access/auth/auth.store';
import { format } from 'date-fns';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Injectable()
export class SummaryService {

  private readonly authStore = inject(AuthStore);

  getSummary(query: Query): Observable<PostgrestSingleResponse<{expense: number, income: number}[]>>  {
    if (query.toDate && query.fromDate && query.amount && query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        fromDate: format(query.fromDate, 'yyyy-MM-dd'),
        toDate: format(query.toDate, 'yyyy-MM-dd'),
        amountValue: query.amount.value,
        amountOperator: query.amount.op,
        transactionName: query.name
      }));
    } else if (!query.toDate && !query.fromDate && query.amount && query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        amountValue: query.amount.value,
        amountOperator: query.amount.op,
        transactionName: query.name
      }));
    } else if (query.toDate && query.fromDate && !query.amount && query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        fromDate: format(query.fromDate, 'yyyy-MM-dd'),
        toDate: format(query.toDate, 'yyyy-MM-dd'),
        transactionName: query.name
      }));
    } else if (query.toDate && query.fromDate && query.amount && !query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        fromDate: format(query.fromDate, 'yyyy-MM-dd'),
        toDate: format(query.toDate, 'yyyy-MM-dd'),
        amountValue: query.amount.value,
        amountOperator: query.amount.op
      }));
    } else if (query.toDate && query.fromDate && !query.amount && !query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        fromDate: format(query.fromDate, 'yyyy-MM-dd'),
        toDate: format(query.toDate, 'yyyy-MM-dd')
      }))
    } else if (!query.toDate && !query.fromDate && !query.amount && query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        transactionName: query.name
      }));
    } else if (!query.toDate && !query.fromDate && query.amount && !query.name) {
      return from(supabase.rpc('getTotalIncomeAndExpense', {
        ownerId: this.authStore.session()?.user.id!,
        amountValue: query.amount.value,
        amountOperator: query.amount.op
      }));
    } else {
      return EMPTY;
    }
  }
}