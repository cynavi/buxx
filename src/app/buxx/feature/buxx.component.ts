import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ToolbarComponent } from '../../shared/ui/toolbar/feature/toolbar.component';
import {
  Amount,
  DeleteTransaction,
  Operator,
  Query,
  SaveTransaction,
  Transaction
} from '../../shared/model/buxx.model';
import { TransactionStore } from '../data-access/transaction.store';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toObservable } from '@angular/core/rxjs-interop';
import { TransactionDialogComponent } from '../../shared/ui/add-new-dialog/feature/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SummaryComponent } from '../ui/summary/summary.component';
import { SummaryStore } from '../data-access/summary.store';
import { SummaryService } from '../data-access/summary.service';
import { queryInitialState, QueryStore } from '../data-access/query.store';
import { environment } from '../../../environments/environment';
import { PositiveNumberOnlyDirective } from '../../shared/util/positive-number.directive';
import { MaskDateDirective } from '../../shared/util/date-mask.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RecentActivityComponent } from '../ui/recent-activity/recent-activity.component';
import { RecentActivityStore } from '../data-access/recent-activity.store';
import { NprCurrencyPipe } from '../../shared/util/npr-currency.pipe';

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
    NgClass,
    MatButtonModule,
    MatPaginatorModule,
    MatExpansionModule,
    AsyncPipe,
    DatePipe,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    SummaryComponent,
    PositiveNumberOnlyDirective,
    MaskDateDirective,
    MatProgressSpinner,
    MatProgressBar,
    RecentActivityComponent,
    NprCurrencyPipe
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
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  readonly transactionStore = inject(TransactionStore);
  private readonly queryStore = inject(QueryStore);

  private dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);
  transactions$: Observable<Transaction[]> = toObservable(computed(() => this.transactionStore.data().transactions));
  filterForm!: FormGroup;
  paginatorLength!: number;

  constructor() {
    effect(() => {
      const data = this.transactionStore.data();
      this.dataSource.data = data.transactions;
      this.paginatorLength = data.count;
    });
  }

  get startDate(): AbstractControl {
    return this.filterForm.controls['date'].get('start')!;
  }

  get endDate(): AbstractControl {
    return this.filterForm.controls['date'].get('end')!;
  }

  ngOnInit(): void {
    this.initQueryForm();
    this.dataSource.paginator = this.paginator;
    this.queryStore.query$.next(queryInitialState.query);
    this.summaryStore.fetch$.next(queryInitialState.query);
    this.transactionStore.fetch$.next(queryInitialState.query);
  }

  initQueryForm(): void {
    this.filterForm = this.fb.group({
      date: this.fb.group({
        start: this.fb.control<Date | null>(null),
        end: this.fb.control<Date | null>(null)
      }),
      amount: this.fb.group({
        operator: this.fb.control<Operator>('<'),
        value: this.fb.control<number | null>(null)
      }),
      name: this.fb.control<string | null>(null)
    }, { validators: filterValidator });
  }

  applyFilter(): void {
    let amount: Amount | undefined;
    if (this.filterForm.value.amount.value) {
      amount = {
        value: this.filterForm.value.amount.value,
        op: this.filterForm.value.amount.operator
      };
    }
    this.queryStore.query$.next({
      criteria: {
        amount,
        date: this.filterForm.value.date,
        name: this.filterForm.value.name
      },
      paginate: queryInitialState.query.paginate
    });
  }

  saveTransaction(transaction: SaveTransaction): void {
    this.transactionStore.save$.next(transaction);
  }

  updateTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: transaction,
      panelClass: ['w-3/6']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionStore.update$.next(result);
      }
    });
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
