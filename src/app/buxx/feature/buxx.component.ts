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
import { DeleteTransaction, Operator, SaveTransaction, Transaction } from '../../shared/model/buxx.model';
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
import { sub } from 'date-fns';
import { TransactionDialogComponent } from '../../shared/ui/add-new-dialog/feature/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SummaryComponent } from '../ui/summary/summary.component';
import { SummaryStore } from '../data-access/summary.store';
import { SummaryService } from '../data-access/summary.service';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const toDate = control.get('toDate');
  const fromDate = control.get('fromDate');
  return toDate && fromDate;
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
    SummaryComponent
  ],
  templateUrl: './buxx.component.html',
  styleUrl: './buxx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransactionStore, SummaryStore, SummaryService]
})
export class BuxxComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly summaryStore = inject(SummaryStore);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly transactionStore = inject(TransactionStore);

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

  ngOnInit(): void {
    this.initQueryForm();
    this.dataSource.paginator = this.paginator;
    this.transactionStore.fetch$.next({
      amount: {
        op: '<=',
        value: 500
      },
      fromDate: sub(new Date(), { days: 30 }),
      toDate: new Date(),
      paginate: {
        pageSize: 5,
        pointer: 0,
        isNext: true
      }
    });
    this.summaryStore.fetch$.next();
  }

  initQueryForm(): void {
    this.filterForm = this.fb.group({
      toDate: this.fb.control<Date | null>(null),
      fromDate: this.fb.control<Date | null>(null),
      amount: this.fb.group({
        operator: this.fb.control<Operator>('<'),
        value: this.fb.control<number | null>(null)
      }),
      name: this.fb.control<string | null>(null)
    }, { validators: [dateRangeValidator] });
  }

  applyFilter(): void {

  }

  saveTransaction(transaction: SaveTransaction): void {
    this.transactionStore.save$.next(transaction);
  }

  updateTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: transaction
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
    this.transactionStore.fetch$.next({
      ...this.transactionStore.query(),
      paginate: {
        pageSize: event.pageSize,
        pointer: this.transactionStore.query().paginate.pointer,
        isNext: event.previousPageIndex! < event.pageIndex
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
