import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../../add-new-dialog/feature/transaction-dialog.component';
import { SaveTransaction } from '../../../model/buxx.model';
import { AuthStore } from '../../../data-access/auth/auth.store';
import { supabase } from '../../../../../supabase/supabase';

@Component({
  selector: 'as-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  readonly dialog = inject(MatDialog);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  @Output() newTransactionEmitter = new EventEmitter<SaveTransaction>();

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newTransactionEmitter.emit({
          name: result?.name,
          amount: result?.amount,
          date: result?.date,
          details: result?.date ?? null,
          isExpense: result?.isExpense,
          userId: this.authStore.session()?.user.id!
        });
      }
    });
  }

  signOut(): void {
    supabase.auth.signOut().then(() => this.router.navigate(['sign-in']));
  }
}
