import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RecentTransaction } from '../../../shared/model/buxx.model';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'as-recent-transaction',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    MatCardModule
  ],
  templateUrl: './recent-transaction.component.html',
  styleUrl: './recent-transaction.component.scss',
})
export class RecentTransactionComponent {

  transactions: RecentTransaction[] = [
    {
      action: 'DELETED',
      date: (new Date()).toString(),
      id: 'sds',
      name: 'Test Name',
      isExpense: true,
      details: 'sdfd',
      amount: 222,
      userId: 'sdfsdf'
    },
    {
      action: 'SAVED',
      date: (new Date()).toString(),
      id: 'sds',
      name: 'Test Name Again',
      isExpense: true,
      details: 'sdfd',
      amount: 222,
      userId: 'sdfsdf'
    }
  ];

  restore(transaction: RecentTransaction) {

  }

  delete(transaction: RecentTransaction): void {

  }
}
