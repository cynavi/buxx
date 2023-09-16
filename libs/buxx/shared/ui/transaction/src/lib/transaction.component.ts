import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertButton, AlertController, IonicModule, ModalController } from '@ionic/angular';
import { Transaction, TransactionDB } from '@buxx/shared/model';
import { ExpenseStore } from '@buxx/expense/data-access';
import { TransactionSaveUpdateComponent } from '@buxx/shared/ui/transaction-save-update';
import { IncomeStore } from '@buxx/income/data-access';
import { ToDateModule } from '@buxx/shared/pipe';

@Component({
  selector: 'buxx-transaction',
  standalone: true,
  imports: [CommonModule, IonicModule, ToDateModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {

  @Input({ required: true }) entry!: Transaction;
  @Input({ required: true }) isExpense: boolean = false;
  @Output() transactionUpdate$ = new EventEmitter<TransactionDB.Update>();

  private readonly modalController: ModalController = inject(ModalController);
  private readonly alertController: AlertController = inject(AlertController);
  private readonly expenseStore: ExpenseStore = inject(ExpenseStore);
  private readonly incomeStore: IncomeStore = inject(IncomeStore);

  async openModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: TransactionSaveUpdateComponent,
      componentProps: {
        entry: this.entry
      }
    });
    modal.present().then();
    await modal.onWillDismiss()
      .then(overlayEventDetail => {
        if (overlayEventDetail.role === 'confirm' && overlayEventDetail.data) {
          this.transactionUpdate$.next(overlayEventDetail.data);
          // if (this.isExpense) {
          //   this.expenseStore.update$.next({ ...overlayEventDetail.data, is_expense: true });
          // } else {
          //   this.incomeStore.update$.next({ ...overlayEventDetail.data, is_expense: false });
          // }
        }
      });
  }

  async deleteEntry(): Promise<void> {
    const alertButtons: AlertButton[] = [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: () => {
          if (this.isExpense) {
            this.expenseStore.delete$.next(this.entry.id);
          } else {
            this.incomeStore.delete$.next(this.entry.id);
          }
        }
      }
    ];
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this item?',
      buttons: alertButtons
    });
    await alert.present();
  }
}
