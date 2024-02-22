import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

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
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter()]
})
export class TransactionDialogComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  private readonly fb = inject(FormBuilder);
  addNewForm!: FormGroup;

  ngOnInit() {
    this.addNewForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      amount: this.fb.control('', [Validators.required]),
      date: this.fb.control('', [Validators.required]),
      isExpense: this.fb.control('', [Validators.required]),
      details: this.fb.control('', [Validators.required])
    });
  }

  closDialog(isSave: boolean): void {
    if (isSave) {
      this.dialogRef.close(this.addNewForm.value);
    } else {
      this.dialogRef.close();
    }
  }
}