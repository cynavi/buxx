import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolbarComponent } from '../../shared/ui/toolbar/feature/toolbar.component';
import { Operator, SaveTransaction, Transaction } from '../../shared/model/buxx.model';
import { BuxxStore } from '../data-access/buxx.store';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthStore } from '../../shared/data-access/auth/auth.store';
import { MatExpansionModule } from '@angular/material/expansion';
import { API_DATA } from './transactions-mock';
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
  providers: [BuxxStore]
})
export class BuxxComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly store = inject(BuxxStore);
  readonly authStore = inject(AuthStore);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>(API_DATA);
  transactionsObs!: Observable<Transaction[]>;
  transactions: Transaction[] = API_DATA;
  queryForm!: FormGroup;

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      toDate: this.fb.control<Date | null>(null),
      fromDate: this.fb.control<Date | null>(null),
      amount: this.fb.group({
        operator: this.fb.control<Operator>('<'),
        value: this.fb.control<number | null>(null)
      }),
      name: this.fb.control<string | null>(null)
    }, { validators: [dateRangeValidator] });
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.transactionsObs = this.dataSource.connect();
    // this.store.fetch$.next({
    // amount: {
    //   op: '<=',
    //   value: 50000
    // },
    // fromDate: sub(new Date(), { days: 30 }),
    // toDate: new Date()
    // });
  }

  saveTransaction(transaction: SaveTransaction): void {
    this.store.save$.next(transaction);
  }

  updateTransaction(): void {

  }

  deleteTransaction(): void {

  }

  change(event: PageEvent) {

  }

  filter() {

  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
