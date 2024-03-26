import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NprCurrencyPipe } from '../../../shared/util/npr-currency.pipe';
import { DeleteTransaction, Transaction, UpdateTransaction } from '../../../shared/model/buxx.model';
import { TransactionDialogComponent } from '../../../shared/ui/add-new-dialog/feature/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'as-transaction-list',
  standalone: true,
  imports: [
    MatButton,
    MatExpansionModule,
    MatIcon,
    MatProgressBar,
    NprCurrencyPipe,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {

  loaded = input.required<boolean>();
  transactions = input.required<Transaction[]>();

  @Output() updateTransactionEmitter = new EventEmitter<UpdateTransaction>();
  @Output() deleteTransactionEmitter = new EventEmitter<DeleteTransaction>();

  private readonly dialog = inject(MatDialog);

  updateTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: transaction,
      panelClass: ['flex', 'flex-col', 'items-center', 'justify-center', 'w-3/6', 'sm:min-w-11/12']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTransactionEmitter.next(result);
      }
    });
  }

  deleteTransaction(id: DeleteTransaction): void {
    this.deleteTransactionEmitter.next(id);
  }
}
