import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  DeleteTransaction,
  Query,
  SaveTransaction,
  Transaction,
  TRANSACTIONS,
  UpdateTransaction
} from '../../shared/model/buxx.model';
import { from, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { supabase } from '../../../supabase/supabase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '../../shared/data-access/auth/auth.store';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { buildFilter } from '../../shared/util/filter-builder';

type BuxxState = {
  loaded: boolean;
  data: {
    transactions: Transaction[];
    count: number;
  },
  error: string | null;
}

const initialState: BuxxState = {
  loaded: true,
  data: {
    transactions: [],
    count: 0
  },
  error: null
};

@Injectable()
export class TransactionStore {

  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  private state: WritableSignal<BuxxState> = signal(initialState);

  loaded: Signal<boolean> = computed(() => this.state().loaded);
  data: Signal<{ transactions: Transaction[]; count: number; }> = computed(() => this.state().data);
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

  private handleFetch(): void {
    this.fetch$.pipe(
      takeUntilDestroyed(),
      switchMap((query) => {
        this.state.update(state => ({ ...state, loaded: false }));
        return from(buildFilter(query, this.authStore.session()?.user.id!));
      })
    ).subscribe((response: PostgrestSingleResponse<Transaction[]>) => {
      const transactions: Transaction[] = response?.data ?? [];
      this.state.update(state => ({
        ...state,
        data: {
          transactions,
          count: response.count ?? 0
        },
        loaded: true
      }));
    });
  }

  private handleSave(): void {
    this.save$.pipe(
      takeUntilDestroyed(),
      switchMap((transaction: SaveTransaction) => from(supabase.from(TRANSACTIONS).insert(transaction)))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been saved.', undefined, { duration: 3000 });
      },
      error: err => {
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }

  private handleUpdate() {
    this.update$.pipe(
      takeUntilDestroyed(),
      switchMap((transaction: UpdateTransaction) => from(supabase
        .from(TRANSACTIONS)
        .update(transaction)
        .eq('id', transaction.id)
      ))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been updated.', undefined, { duration: 3000 });
      },
      error: err => {
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }

  private handleDelete() {
    this.delete$.pipe(
      takeUntilDestroyed(),
      switchMap((id: DeleteTransaction) => from(supabase.from(TRANSACTIONS).delete().eq('id', id)))
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction has been deleted.', undefined, { duration: 3000 });
      },
      error: err => {
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }
}