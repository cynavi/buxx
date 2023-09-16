import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PositiveNumberOnlyDirective } from '@buxx/shared/directive';
import { Transaction, TransactionDB } from '@buxx/shared/model';
import { AuthStore } from '@buxx/auth/data-access';
import { ToDateModule } from '@buxx/shared/pipe';

@Component({
  selector: 'app-transaction-save-update',
  templateUrl: './transaction-save-update.component.html',
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    PositiveNumberOnlyDirective,
    ToDateModule
  ]
})
export class TransactionSaveUpdateComponent implements OnInit {

  @ViewChild('tagInput', { read: ElementRef }) tagRef!: ElementRef;
  entryForm: FormGroup = new FormGroup({});
  entry: Transaction | undefined;
  tags: string[] = [];
  protected readonly todayDate = (new Date()).toISOString();
  private readonly modalController: ModalController = inject(ModalController);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authStore: AuthStore = inject(AuthStore);

  ngOnInit(): void {
    this.initEntryForm();
    if (this.entry) {
      this.patchEntryForm(this.entry);
    }
  }

  cancel(): void {
    this.modalController.dismiss(null, 'cancel').then();
  }

  confirm(): void {
    const tempEntry = {
      name: this.entryForm.get('name')?.value,
      amount: +this.entryForm.get('amount')?.value,
      completed_date: new Date(this.entryForm.get('date')?.value),
      tags: this.tags,
      details: this.entryForm.get('detail')?.value,
      is_expense: this.entryForm.get('saveType')?.value === 'expense'
    };

    let data;
    const userId = this.authStore.session()?.user.id;
    if (userId) {
      if (this.entry) {
        data = { ...tempEntry, id: this.entry.id, user_id: userId } satisfies TransactionDB.Update;
      } else {
        // if (this.entryForm.get('saveType')?.value === 'expense') {
        data = { ...tempEntry, user_id: userId } satisfies TransactionDB.Save;
        // } else if (this.entryForm.get('saveType')?.value === 'income') {
        //   data = { ...tempEntry, is_expense: false, user_id: this.authStore.session()?.user.id! } satisfies TransactionDB.Save;
        // } else {
        //   throw new Error('Invalid save type');
        // }
      }
    } else {
      throw new Error('Unable to find user to save.');
    }
    this.modalController.dismiss(data, 'confirm').then();
  }

  removeTag(id: number) {
    this.tags?.splice(id, 1);
  }

  addTag(): void {
    const tag = this.tagRef.nativeElement.value;
    if (!this.tags?.includes(tag)) {
      this.tags?.push(tag);
      this.tagRef.nativeElement.value = '';
    }
  }

  private initEntryForm(): void {
    this.entryForm = this.fb.group({
      saveType: this.fb.control(''),
      id: this.fb.control(''),
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      amount: this.fb.control('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^\\d{1,}$|(?=^.{1,}$)^\\d+\\.\\d{0,2}$')
      ]),
      date: this.fb.control((new Date()).toISOString(), [Validators.required]),
      detail: this.fb.control(null)
    });
  }

  private patchEntryForm(entry: Transaction): void {
    if (entry.tags) {
      this.tags = entry.tags;
    }
    this.entryForm.patchValue({
      id: entry.id,
      name: entry.name,
      amount: entry.amount,
      date: entry.date,
      detail: entry?.details ?? ''
    });
  }
}
