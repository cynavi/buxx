import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Amount, Criteria, Operator } from '../../../shared/model/buxx.model';
import { filterValidator } from '../../feature/buxx.component';
import { MatInputModule } from '@angular/material/input';
import { PositiveNumberOnlyDirective } from '../../../shared/util/positive-number.directive';

@Component({
  selector: 'as-transaction-filter',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    PositiveNumberOnlyDirective
  ],
  templateUrl: './transaction-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFilterComponent implements OnInit {

  @Output() filterEmitter = new EventEmitter<Criteria>();
  filterForm!: FormGroup;
  private readonly fb = inject(FormBuilder);

  get startDate(): AbstractControl {
    return this.filterForm.controls['date'].get('start')!;
  }

  get endDate(): AbstractControl {
    return this.filterForm.controls['date'].get('end')!;
  }

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm(): void {
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
    this.filterEmitter.next({
      amount,
      date: this.filterForm.value.date,
      name: this.filterForm.value.name
    });
  }
}
