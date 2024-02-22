import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  DeleteTransaction, Query,
  SaveTransaction,
  Transaction,
  TRANSACTIONS,
  UpdateTransaction
} from '../../shared/model/buxx.model';
import { from, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BuxxRow, BuxxSchema, supabase } from '../../../supabase/supabase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, sub } from 'date-fns';
import { AuthStore } from '../../shared/data-access/auth/auth.store';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { PostgrestSingleResponse } from '@supabase/supabase-js';


type BuxxState = {
  loaded: boolean;
  transactions: Transaction[];
  error: string | null;
  query: Query | null;
  paginate: {
    count: number;
    pointer: number;
  }
}

@Injectable()
export class BuxxStore {

  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  private state: WritableSignal<BuxxState> = signal({
    loaded: true,
    transactions: [],
    error: null,
    query: {
      amount: {
        op: '<=',
        value: 50000
      },
      fromDate: sub(new Date(), { days: 30 }),
      toDate: new Date()
    },
    paginate: {
      count: 20,
      pointer: 0
    }
  });

  loaded: Signal<boolean> = computed(() => this.state().loaded);
  transactions: Signal<Transaction[]> = computed(() => this.state().transactions);
  error: Signal<string | null> = computed(() => this.state().error);

  fetch$: Subject<Query> = new Subject<Query>();
  save$: Subject<SaveTransaction> = new Subject<SaveTransaction>();
  update$: Subject<UpdateTransaction> = new Subject<UpdateTransaction>();
  delete$: Subject<DeleteTransaction> = new Subject<DeleteTransaction>();

  constructor() {
    this.handleFetch();
    this.handleSave();
    this.handleUpdate();
    this.handleDelete();
  }

  private handleFetch() {
    this.fetch$.pipe(
      takeUntilDestroyed(),
      switchMap((criteria: Query) => {
        let query: PostgrestFilterBuilder<BuxxSchema, BuxxRow, Transaction[], unknown> = supabase
          .from(TRANSACTIONS)
          .select('id, name, details, date, isExpense, userId');
        if (criteria.name) {
          query = query.ilike('name', `%${criteria.name}%`);
        }
        if (criteria.amount?.value && criteria.amount?.op) {
          switch (criteria.amount.op) {
            case '<':
              query = query.lt('amount', criteria.amount.value);
              break;
            case '<=':
              query = query.lte('amount', criteria.amount.value);
              break;
            case '==':
              query = query.eq('amount', criteria.amount.value);
              break;
            case '!=':
              query = query.neq('amount', criteria.amount.value);
              break;
            case '>':
              query = query.gt('amount', criteria.amount.value);
              break;
            case '>=':
              query = query.gte('amount', criteria.amount.value);
              break;
            default:
              throw Error('Invalid operator on amount.');
          }
        }
        if (criteria.fromDate && criteria.toDate) {
          query = query.gte('date', format(criteria.fromDate, 'yyyy-MM-dd'))
            .lte('date', format(criteria.toDate, 'yyyy-MM-dd HH:mm:ss'));
        }
        query = query.eq('userId', this.authStore.session()?.user.id!);
        return from(query);
      })
    ).subscribe((response: PostgrestSingleResponse<Transaction[]>) => {
      const transactions: Transaction[] = response?.data ?? [];
      console.log(transactions);
    });
  }

  private handleSave(): void {
    this.save$.pipe(
      takeUntilDestroyed(),
      switchMap((transaction: SaveTransaction) => from(supabase.from(TRANSACTIONS).insert(transaction)))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been saved')
      },
      error: err => {
        this.state.update(state => ({...state, error: err}))
      }
    });
  }


  private handleUpdate() {
    this.update$.pipe(
      takeUntilDestroyed(),
      switchMap((transaction: UpdateTransaction) => from(supabase.from(TRANSACTIONS).update(transaction)))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been updated')
      },
      error: err => {
        this.state.update(state => ({...state, error: err}))
      }
    });
  }

  private handleDelete() {
    this.delete$.pipe(
      takeUntilDestroyed(),
      switchMap((id: DeleteTransaction) => from(supabase.from(TRANSACTIONS).delete().eq('id', id)))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been updated')
      },
      error: err => {
        this.state.update(state => ({...state, error: err}))
      }
    });
  }
}