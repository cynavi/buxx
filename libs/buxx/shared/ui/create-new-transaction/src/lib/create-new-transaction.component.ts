import { Component, inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { TransactionSaveUpdateComponent } from '@buxx/shared/ui/transaction-save-update';
import { TransactionDB } from '@buxx/shared/model';
import { ExpenseStore } from '@buxx/expense/data-access';
import { IncomeStore } from '@buxx/income/data-access';

@Component({
  selector: 'app-create-new-transaction',
  templateUrl: './create-new-transaction.component.html',
  standalone: true,
  imports: [IonicModule]
})
export class CreateNewTransactionComponent {

  @Input({required: true}) confirmCallback!: (transaction: TransactionDB.Save) => void;

  private readonly modalController: ModalController = inject(ModalController);
  private readonly expenseStore: ExpenseStore = inject(ExpenseStore);
  private readonly incomeStore: IncomeStore = inject(IncomeStore);

  async saveModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: TransactionSaveUpdateComponent
    });
    modal.present().then();
    await modal.onWillDismiss()
      .then(overlayEventDetail => {
        const data = overlayEventDetail.data;
        if (overlayEventDetail.role === 'confirm' && data satisfies TransactionDB.Save) {
          this.confirmCallback(data);
        }
      });
  }
}
