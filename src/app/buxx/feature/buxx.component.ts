import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Criteria, DeleteTransaction, Query, SaveTransaction, Transaction } from '../../shared/model/buxx.model';
import { TransactionStore } from '../data-access/transaction.store';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SummaryStore } from '../data-access/summary.store';
import { SummaryService } from '../data-access/summary.service';
import { queryInitialState, QueryStore } from '../data-access/query.store';
import { environment } from '../../../environments/environment';
import { RecentActivityStore } from '../data-access/recent-activity.store';
import { ToolbarComponent } from '../../shared/ui/toolbar/feature/toolbar.component';
import { SummaryComponent } from '../ui/summary/summary.component';
import { RecentActivityComponent } from '../ui/recent-activity/recent-activity.component';
import { MatAccordion } from '@angular/material/expansion';
import { TransactionFilterComponent } from '../ui/transaction-filter/transaction-filter.component';
import { TransactionListComponent } from '../ui/transaction-list/transaction-list.component';
import { FooterComponent } from '../../shared/ui/footer/footer.component';

export const filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = control.get('date');
  const amount = control.get('amount');
  const isDateRangeValid = !!date?.get('start')?.value && !!date?.get('end')?.value;
  const isAmountValid = !!amount?.get('operator')?.value && !!amount?.get('value')?.value;
  return (isDateRangeValid || isAmountValid || !!control.get('name')?.value)
    ? null
    : { invalidCombination: true };
};

@Component({
  selector: 'as-buxx',
  standalone: true,
  imports: [
    ToolbarComponent,
    SummaryComponent,
    RecentActivityComponent,
    MatAccordion,
    TransactionFilterComponent,
    TransactionListComponent,
    MatPaginator,
    FooterComponent
  ],
  templateUrl: './buxx.component.html',
  styleUrl: './buxx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransactionStore, SummaryStore, SummaryService, QueryStore, RecentActivityStore]
})
export class BuxxComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly summaryStore = inject(SummaryStore);
  readonly recentActivityStore = inject(RecentActivityStore);
  readonly transactionStore = inject(TransactionStore);
  private readonly queryStore = inject(QueryStore);

  readonly dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);
  paginatorLength!: number;

  constructor() {
    effect(() => {
      const data = this.transactionStore.data();
      this.dataSource.data = data.transactions;
      this.paginatorLength = data.count;
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.queryStore.query$.next(queryInitialState.query);
    this.summaryStore.fetch$.next(queryInitialState.query);
    this.transactionStore.fetch$.next(queryInitialState.query);
  }

  applyFilter(criteria: Criteria): void {
    this.queryStore.query$.next({ criteria, paginate: queryInitialState.query.paginate });
  }

  saveTransaction(transaction: SaveTransaction): void {
    this.transactionStore.save$.next(transaction);
  }

  updateTransaction(transaction: Transaction): void {
    this.transactionStore.update$.next(transaction);
  }

  deleteTransaction(transactionId: DeleteTransaction): void {
    this.transactionStore.delete$.next(transactionId);
  }

  paginate(event: PageEvent): void {
    const query: Query | null = this.queryStore.query();
    let start: number, end: number;
    const pointer = query?.paginate?.pointer ?? 0;
    if (event.previousPageIndex! < event.pageIndex) {
      start = pointer;
      end = pointer + event.pageSize - 1;
    } else {
      start = pointer - 2 * event.pageSize;
      end = pointer - event.pageSize - 1;
    }
    this.queryStore.query$.next({
      ...this.queryStore.query(),
      paginate: {
        pointer: event.previousPageIndex! < event.pageIndex
          ? pointer + environment.pageSize
          : pointer - environment.pageSize,
        range: { start, end }
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
