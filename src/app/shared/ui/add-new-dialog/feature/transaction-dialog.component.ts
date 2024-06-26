import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Transaction } from '../../../model/buxx.model';
import { PositiveNumberOnlyDirective } from '../../../util/positive-number.directive';
import { MaskDateDirective } from '../../../util/date-mask.directive';

@Component({
  selector: 'as-add-new-dialog',
  templateUrl: './transaction-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    PositiveNumberOnlyDirective,
    MaskDateDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class TransactionDialogComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  transactionForm!: FormGroup;

  ngOnInit(): void {
    this.initTransactionForm();
    if (this.data) {
      this.patchTransactionForm();
    }
  }

  private initTransactionForm(): void {
    this.transactionForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      amount: this.fb.control('', [Validators.required]),
      date: this.fb.control('', [Validators.required]),
      isExpense: this.fb.control('', [Validators.required]),
      details: this.fb.control('')
    });
  }

  private patchTransactionForm(): void {
    const { name, amount: amount, date, isExpense, details } = this.data;
    this.transactionForm.patchValue({ name, amount, date, isExpense, details });
  }

  closeDialog(isCancel: boolean): void {
    if (isCancel) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.data ? { ...this.transactionForm.value, id: this.data.id } : this.transactionForm.value);
    }
  }
}