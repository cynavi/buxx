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

  getSummary(query: Query): Observable<PostgrestSingleResponse<{ expense: number, income: number }[]>> {
    const { criteria, paginate } = query;
    if (criteria) {
      if (criteria.date && criteria.amount && criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          fromDate: format(criteria.date.start, 'yyyy-MM-dd'),
          toDate: format(criteria.date.end, 'yyyy-MM-dd'),
          amountValue: criteria.amount.value,
          amountOperator: criteria.amount.op,
          transactionName: criteria.name
        }));
      } else if (!criteria.date && criteria.amount && criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          amountValue: criteria.amount.value,
          amountOperator: criteria.amount.op,
          transactionName: criteria.name
        }));
      } else if (criteria.date && !criteria.amount && criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          fromDate: format(criteria.date.start, 'yyyy-MM-dd'),
          toDate: format(criteria.date.end, 'yyyy-MM-dd'),
          transactionName: criteria.name
        }));
      } else if (criteria.date && criteria.amount && !criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          fromDate: format(criteria.date.start, 'yyyy-MM-dd'),
          toDate: format(criteria.date.end, 'yyyy-MM-dd'),
          amountValue: criteria.amount.value,
          amountOperator: criteria.amount.op
        }));
      } else if (criteria.date && !criteria.amount && !criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          fromDate: format(criteria.date.start, 'yyyy-MM-dd'),
          toDate: format(criteria.date.end, 'yyyy-MM-dd')
        }));
      } else if (!criteria.date && !criteria.amount && criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          transactionName: criteria.name
        }));
      } else if (!criteria.date && criteria.amount && !criteria.name) {
        return from(supabase.rpc('getTotalIncomeAndExpense', {
          ownerId: this.authStore.session()?.user.id!,
          amountValue: criteria.amount.value,
          amountOperator: criteria.amount.op
        }));
      }
    }
    return EMPTY;
  }
}