import { Component, inject, OnInit } from '@angular/core';
import { ToolbarComponent } from '../../shared/ui/toolbar/feature/toolbar.component';
import { SaveTransaction } from '../../shared/model/buxx.model';
import { BuxxStore } from '../data-access/buxx.store';
import { sub } from 'date-fns';

@Component({
  selector: 'as-buxx',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './buxx.component.html',
  styleUrl: './buxx.component.scss',
  providers: [BuxxStore]
})
export class BuxxComponent implements OnInit {

  readonly store = inject(BuxxStore);

  ngOnInit(): void {
    this.store.fetch$.next({
      amount: {
        op: '<=',
        value: 50000
      },
      fromDate: sub(new Date(), { days: 30 }),
      toDate: new Date()
    });
  }

  saveTransaction(transaction: SaveTransaction): void {
    this.store.save$.next(transaction);
  }
}
