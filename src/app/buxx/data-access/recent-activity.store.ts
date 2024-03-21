import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { RecentTransaction } from '../../shared/model/buxx.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type RecentActivityState = {
  data: RecentTransaction[];
}

@Injectable()
export class RecentActivityStore {

  private state: WritableSignal<RecentActivityState> = signal({data: []});
  readonly data: Signal<RecentTransaction[]> = computed(() => this.state().data);

  reset$: Subject<void> = new Subject<void>();
  add$: Subject<RecentTransaction> = new Subject<RecentTransaction>();

  constructor() {
    this.reset$.pipe(takeUntilDestroyed())
      .subscribe(() => this.state.set({data: []}));

    this.add$.pipe(takeUntilDestroyed())
      .subscribe((transaction: RecentTransaction) => this.state.update(state => ({
        data: [...state.data, transaction]
      })));
  }
}