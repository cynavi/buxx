import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Query } from '../../shared/model/buxx.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { sub } from 'date-fns';
import { environment } from '../../../environments/environment';
import { TransactionStore } from './transaction.store';
import { SummaryStore } from './summary.store';
import * as _ from 'lodash';

export interface QueryState {
  query: Query;
}

export const queryInitialState: QueryState = {
  query: {
    criteria: {
      amount: {
        op: '<=',
        value: 500
      },
      date: {
        start: sub(new Date(), { years: 1 }),
        end: new Date()
      }
    },
    paginate: {
      pointer: environment.pageSize,
      range: {
        start: 0,
        end: environment.pageSize
      }
    }
  }
};

@Injectable()
export class QueryStore {

  query$: Subject<Query> = new Subject<Query>();
  private readonly transactionStore = inject(TransactionStore);
  private readonly summaryStore = inject(SummaryStore);
  private readonly state: WritableSignal<QueryState> = signal(queryInitialState);
  query: Signal<Query | null> = computed(() => this.state().query);

  constructor() {
    this.query$.pipe(takeUntilDestroyed())
      .subscribe(query => {
        const isCriteriaChange = !_.isEqual(query.criteria, this.query()?.criteria);
        const isPagination = !_.isEqual(query.paginate, this.query()?.paginate);
        if (isCriteriaChange || isPagination) {
          this.transactionStore.fetch$.next(query);
          if (isCriteriaChange) this.summaryStore.fetch$.next(query);
        }
        this.state.set({query});
      });
  }
}