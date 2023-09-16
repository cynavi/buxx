import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { DogRunningComponent } from '@buxx/shared/ui/dog-running';
import { CreateNewTransactionComponent } from '@buxx/shared/ui/create-new-transaction';
import { SearchComponent } from '@buxx/shared/ui/search';
import { TransactionDB } from '@buxx/shared/model';
import { ExpenseStore } from '@buxx/expense/data-access';
import { IncomeStore } from '@buxx/income/data-access';
import { SearchUtil } from "@buxx/shared/util";

@Component({
  selector: 'buxx-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    IonicModule,
    DogRunningComponent,
    CreateNewTransactionComponent,
    SearchComponent
  ],
  standalone: true
})
export class DashboardComponent {

  private readonly modalController: ModalController = inject(ModalController);
  private readonly expenseStore: ExpenseStore = inject(ExpenseStore);
  private readonly incomeStore: IncomeStore = inject(IncomeStore);

  emitSaveTransactionEvent(transaction: TransactionDB.Save): void {
    if (transaction.is_expense) {
      this.expenseStore.save$.next(transaction);
    } else {
      this.incomeStore.save$.next(transaction);
    }
  }

  openSearchModal(): void {
    // TODO: Use dashboard store
    SearchUtil.openSearchModal(this.modalController, this.expenseStore.searchCriteria())
      .then(queryCriteria => this.expenseStore.fetch$.next(queryCriteria));
  }
}
