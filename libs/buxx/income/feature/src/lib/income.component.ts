import { Component, inject, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { sub } from 'date-fns';
import { AnimateInModule, FadeAnimationUtil } from '@buxx/shared/animate-in';
import { IncomeStore } from '@buxx/income/data-access';
import { CreateNewTransactionComponent } from '@buxx/shared/ui/create-new-transaction';
import { TransactionComponent } from '@buxx/shared/ui/transaction';
import { LoadingToolbarComponent } from '@buxx/shared/ui/loading-toolbar';
import { TransactionDB } from '@buxx/shared/model';
import { ExpenseStore } from '@buxx/expense/data-access';
import { SearchUtil } from "@buxx/shared/util";

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    CreateNewTransactionComponent,
    AnimateInModule,
    TransactionComponent,
    LoadingToolbarComponent
  ],
  providers: [IncomeStore]
})
export class IncomeComponent implements OnInit {

  readonly fadeAnimationUtil = FadeAnimationUtil;
  readonly incomeStore: IncomeStore = inject(IncomeStore);
  private readonly expenseStore: ExpenseStore = inject(ExpenseStore);
  private readonly modalController: ModalController = inject(ModalController);

  ngOnInit(): void {
    this.fetchIncome();
  }

  fetchIncome(event?: unknown): void {
    this.incomeStore.fetch$.next({
      fromDate: sub(new Date(), { days: 30 }),
      toDate: new Date()
    });
  }

  onInfiniteScroll(event: Event): void {
    this.incomeStore.infiniteScroll$.next(event as InfiniteScrollCustomEvent);
  }

  emitSaveTransactionEvent(transaction: TransactionDB.Save): void {
    if (transaction.is_expense) {
      this.expenseStore.save$.next(transaction);
    } else {
      this.incomeStore.save$.next(transaction);
    }
  }

  updateIncome(income: TransactionDB.Update): void {
    this.incomeStore.update$.next({ ...income, is_expense: false });
  }

  openSearchModal(): void {
    SearchUtil.openSearchModal(this.modalController, this.incomeStore.searchCriteria())
      .then(queryCriteria => this.incomeStore.fetch$.next(queryCriteria));
  }
}
