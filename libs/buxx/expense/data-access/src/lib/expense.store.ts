import { BuxxRow, BuxxSchema, Database, QueryCriteria, Transaction, TransactionDB } from '@buxx/shared/model';
import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { from, map, Subject, switchMap } from 'rxjs';
import { InfiniteScrollCustomEvent, ToastController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { environment } from '@buxx/shared/app-config';
import { SearchUtil, ToastUtil } from '@buxx/shared/util';
import { TransactionService } from '@buxx/shared/data-access/store';

interface ExpenseState {
  expenses: Transaction[];
  loaded: boolean;
  error: string | null;
  searchCriteria: QueryCriteria | null;
}

@Injectable()
export class ExpenseStore {

  private readonly toastController = inject(ToastController);
  private readonly transactionService = inject(TransactionService);

  range: { from: number, to: number } = { from: 0, to: environment.pageSize };
  infiniteScroll$: Subject<InfiniteScrollCustomEvent> = new Subject<InfiniteScrollCustomEvent>();
  save$: Subject<TransactionDB.Save> = new Subject<TransactionDB.Save>();
  update$: Subject<TransactionDB.Update> = new Subject<TransactionDB.Update>();
  delete$: Subject<TransactionDB.Delete> = new Subject<TransactionDB.Delete>();
  fetch$: Subject<QueryCriteria> = new Subject<QueryCriteria>();
  queryProp: Signal<PostgrestFilterBuilder<BuxxSchema, BuxxRow, TransactionDB.ResultSet[], unknown> | null> = computed(() => {
    // TODO: Get range from signal??
    this.range = { from: 0, to: environment.pageSize };
    return this.searchCriteria()
      ? SearchUtil.buildQuery(this.searchCriteria()!, this.range)
      : null;
  });
  private state: WritableSignal<ExpenseState> = signal<ExpenseState>({
    expenses: [],
    loaded: false,
    error: null,
    searchCriteria: null
  });
  expenses: Signal<Transaction[]> = computed(() => this.state().expenses);
  loaded: Signal<boolean> = computed(() => this.state().loaded);
  error: Signal<string | null> = computed(() => this.state().error);
  searchCriteria: Signal<QueryCriteria | null> = computed(() => this.state().searchCriteria);

  constructor() {
    this.handleInfiniteScrollEvent();
    this.handleSaveEvent();
    this.handleUpdateEvent();
    this.handleDeleteEvent();
    this.handleFetchEvent();
  }

  private handleInfiniteScrollEvent(): void {
    this.infiniteScroll$.pipe(
      takeUntilDestroyed(),
      switchMap((event: InfiniteScrollCustomEvent) => {
        if (null == this.queryProp()) {
          return [];
        }
        this.range = { from: this.range.to++, to: this.range.to++ + environment.pageSize };
        return this.transactionService.getTransactions(this.queryProp()!, true).pipe(
          map((expenses: Transaction[]) => ({ expenses, event }))
        );
      })
    ).subscribe({
      next: (data: {
        expenses: Transaction[],
        event: InfiniteScrollCustomEvent
      }) => {
        this.state.mutate(state => state.expenses.push(...data.expenses));
        data.event.target.complete().then();
      },
      error: err => {
        console.error(err);
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }

  private handleSaveEvent(): void {
    this.save$.pipe(
      takeUntilDestroyed(),
      switchMap((expense: TransactionDB.Save) => from(this.transactionService.saveTransaction(expense)))
    ).subscribe({
      next: () => ToastUtil.open(`Expense has been saved.`, this.toastController),
      error: err => {
        console.error(err);
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }

  private handleFetchEvent(): void {
    this.fetch$.pipe(
      takeUntilDestroyed(),
      switchMap((criteria: QueryCriteria) => {
          this.state.update(state => ({ ...state, searchCriteria: criteria, loaded: false }));
          return this.transactionService.getTransactions(this.queryProp()!, true);
        }
      )
    ).subscribe({
      next: (expenses: Transaction[]) => {
        this.state.update(state => ({
          ...state,
          expenses: expenses as Transaction[],
          loaded: true
        }));
      },
      error: err => {
        console.error(err);
        this.state.update(state => ({ ...state, error: err }));
      }
    });
  }

  private handleUpdateEvent(): void {
    this.update$.pipe(
      takeUntilDestroyed(),
      switchMap((expense: TransactionDB.Update) => from(this.transactionService.updateTransaction(expense)).pipe(
        map((response: PostgrestSingleResponse<unknown>) => ({ response, expense }))
      ))
    ).subscribe(data => {
      const { response, expense } = data;
      if (response.status === 204) {
        ToastUtil.open(`Expense has been updated.`, this.toastController).then();
      } else if (response.error) {
        this.state.update(state => ({ ...state, error: response.error.message }));
      }
    });
  }

  private handleDeleteEvent(): void {
    this.delete$.pipe(
      takeUntilDestroyed(),
      switchMap(id => from(this.transactionService.deleteTransaction(id)).pipe(
        map((response: PostgrestSingleResponse<unknown>) => ({ response, id }))
      ))
    ).subscribe(data => {
      const { response, id } = data;
      if (response.status === 204) {
        ToastUtil.open(`Expense has been deleted.`, this.toastController).then();
      } else if (response.error) {
        this.state.update(state => ({ ...state, error: response.error.message }));
      }
    });
  }
}
