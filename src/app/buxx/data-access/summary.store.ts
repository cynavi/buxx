import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { Query, Summary } from '../../shared/model/buxx.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SummaryService } from './summary.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export type BuxxSummaryState = {
  loaded: boolean;
  error: string | null;
  data: Summary
}

@Injectable()
export class SummaryStore {

  private readonly summaryService = inject(SummaryService);

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
  readonly data: Signal<Summary> = computed(() => this.state().data);

  fetch$: Subject<Query> = new Subject<Query>();

  constructor() {
    this.handleFetch();
  }

  private handleFetch(): void {
    this.fetch$.pipe(
      takeUntilDestroyed(),
      switchMap((query) => {
        this.state.update(state => ({ ...state, loaded: false }));
        return this.summaryService.getSummary(query);
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