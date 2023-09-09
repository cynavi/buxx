import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { ExpenseStore } from '@buxx/expense/data-access';
import { sub } from 'date-fns';
import { QueryCriteria, TransactionDB } from '@buxx/shared/model';
import {
  AnimateInModule,
  FadeAnimationUtil,
  observerServiceConfig,
  ObserverServiceConfig
} from '@buxx/shared/animate-in';
import { LoadingToolbarComponent } from '@buxx/shared/ui/loading-toolbar';
import { TransactionComponent } from '@buxx/shared/ui/transaction';
import { CreateNewTransactionComponent } from '@buxx/shared/ui/create-new-transaction';
import { SearchComponent } from '@buxx/shared/ui/search';
import { IncomeStore } from '@buxx/income/data-access';


@Component({
  selector: 'buxx-expense',
  standalone: true,
  templateUrl: './expense.component.html',
  providers: [ExpenseStore, {provide: ObserverServiceConfig, useValue: observerServiceConfig}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonicModule,
    TransactionComponent,
    LoadingToolbarComponent,
    AnimateInModule,
    CreateNewTransactionComponent
  ]
})
export class ExpenseComponent implements OnInit {

  readonly fadeAnimationUtil = FadeAnimationUtil;
  readonly expenseStore: ExpenseStore = inject(ExpenseStore);
  private readonly incomeStore: IncomeStore = inject(IncomeStore);
  private readonly modalController: ModalController = inject(ModalController);

  ngOnInit(): void {
    this.fetchExpense();
  }

  fetchExpense(event?: unknown): void {
    this.expenseStore.fetch$.next({
      fromDate: sub(new Date(), {days: 30}),
      toDate: new Date()
    });
  }

  onInfiniteScroll(event: Event): void {
    this.expenseStore.infiniteScroll$.next(event as InfiniteScrollCustomEvent);
  }

  emitSaveTransactionEvent(transaction: TransactionDB.Save): void {
    if (transaction.is_expense) {
      this.expenseStore.save$.next(transaction);
    } else {
      this.incomeStore.save$.next(transaction);
    }
  }

  async openSearchModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: SearchComponent,
      componentProps: {
        searchCriteria: this.expenseStore.searchCriteria()
      },
      backdropDismiss: false,
      animated: true
    });
    modal.present().then();
    await modal.onWillDismiss().then(overlayEventDetail => {
      if (overlayEventDetail.role === 'confirm' && overlayEventDetail.data?.searchCriteria satisfies QueryCriteria) {
        this.expenseStore.fetch$.next(overlayEventDetail.data.searchCriteria);
      }
    });
  }
}
