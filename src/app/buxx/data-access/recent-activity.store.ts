import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DeleteTransaction, RecentTransaction, Transaction } from '../../shared/model/buxx.model';
import { Subject } from 'rxjs';

export type RecentActivityState = {
  data: RecentTransaction[];
}

@Injectable()
export class RecentActivityStore {

  restore$: Subject<Transaction> = new Subject<Transaction>();
  delete$: Subject<DeleteTransaction> = new Subject<DeleteTransaction>();
  private state: WritableSignal<RecentActivityState> = signal({data: []});
  readonly data: Signal<RecentTransaction[]> = computed(() => this.state().data);
}