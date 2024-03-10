import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { Summary } from '../../shared/model/buxx.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SummaryService } from './summary.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { TransactionStore } from './transaction.store';

export type BuxxSummaryState = {
  loaded: boolean;
  error: string | null;
  data: Summary
}

@Injectable()
export class SummaryStore {

  fetch$: Subject<void> = new Subject<void>();
  private readonly summaryService = inject(SummaryService);
  private readonly transactionStore = inject(TransactionStore);
  private state: WritableSignal<BuxxSummaryState> = signal({
    loaded: true,
    error: null,
    data: {
      balance: 0,
      income: 0,
      expense: 0
    }
  });
  readonly loaded: Signal<boolean> = computed(() => this.state().loaded);
  readonly error: Signal<string | null> = computed(() => this.state().error);
  data: Signal<Summary> = computed(() => this.state().data);

  constructor() {
    this.fetch$.pipe(
      takeUntilDestroyed(),
      switchMap(() => {
        this.state.update(state => ({ ...state, loaded: false }));
        return this.summaryService.getSummary(this.transactionStore.query());
      })
    ).subscribe((response: PostgrestSingleResponse<{ expense: number, income: number }[]>) => {
      if (response.data) {
        const { income, expense } = response.data[0];
        this.state.update(state => ({
          ...state,
          loaded: true,
          data: {
            balance: income - expense,
            income,
            expense
          }
        }));
      }
      if (response.error) {
        this.state.update(state => ({ ...state, error: response.error.message }));
      }
    });
  }
}