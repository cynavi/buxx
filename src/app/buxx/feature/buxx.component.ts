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
import { Operator, SaveTransaction, Transaction } from '../../shared/model/buxx.model';
import { BuxxStore } from '../data-access/buxx.store';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
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
  FormsModule,
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
    MatCardModule,
    NgClass,
    NgIf,
    MatButtonModule,
    NgForOf,
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
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './buxx.component.html',
  styleUrl: './buxx.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BuxxStore]
})
export class BuxxComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly store = inject(BuxxStore);
  private readonly fb = inject(FormBuilder);

  private dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);
  transactions$: Observable<Transaction[]> = toObservable(computed(() => this.store.data().transactions));
  filterForm!: FormGroup;
  paginatorLength!: number;

  constructor() {
    effect(() => {
      const data = this.store.data();
      this.dataSource.data = data.transactions;
      this.paginatorLength = data.count;
    });
  }

  ngOnInit(): void {
    this.initQueryForm();
    this.dataSource.paginator = this.paginator;
    this.store.fetch$.next({
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

  saveTransaction(transaction: SaveTransaction): void {
    this.store.save$.next(transaction);
  }

  updateTransaction(): void {

  }

  deleteTransaction(): void {

  }

  paginate(event: PageEvent): void {
    if (event.previousPageIndex! < event.pageIndex) {
      this.store.fetch$.next({
        ...this.store.query(),
        paginate: {
          pageSize: event.pageSize,
          pointer: this.store.query().paginate.pointer,
          isNext: true
        }
      });
    } else {
      this.store.fetch$.next({
        ...this.store.query(),
        paginate: {
          pageSize: event.pageSize,
          pointer: this.store.query().paginate.pointer,
          isNext: false
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
