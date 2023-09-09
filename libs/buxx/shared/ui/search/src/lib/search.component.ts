import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { PositiveNumberOnlyDirective } from '@buxx/shared/directive';
import { QueryCriteria } from '@buxx/shared/model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [IonicModule, ReactiveFormsModule, CommonModule, PositiveNumberOnlyDirective, DatePipe],
  standalone: true
})
export class SearchComponent implements OnInit {

  @ViewChild('tagInput', {read: ElementRef}) tagRef!: ElementRef;
  searchCriteria!: QueryCriteria;
  searchForm!: FormGroup;
  tags: string[] = [];
  protected readonly todayDate: string = (new Date()).toISOString();
  private readonly modalController: ModalController = inject(ModalController);
  private readonly fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initSearchForm();
    if (this.searchCriteria) {
      this.patchSearchForm();
    }
  }

  confirm(): void {
    if (this.searchForm.valid) {
      const searchCriteria: QueryCriteria = {
        name: this.searchForm.value.name,
        amount: {
          value: this.searchForm.value.amountValue,
          op: this.searchForm.value.amountOp
        },
        fromDate: new Date(this.searchForm.value.fromDate),
        toDate: new Date(this.searchForm.value.toDate),
        tags: this.tags
      };
      this.modalController.dismiss({searchCriteria}, 'confirm').then();
    }
  }

  cancel(): void {
    this.modalController.dismiss(null, 'cancel').then();
  }

  removeTag(id: number): void {
    this.tags.splice(id, 1);
  }

  addTag(): void {
    const tag = this.tagRef.nativeElement.value;
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.tagRef.nativeElement.value = '';
    }
  }

  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      baseOp: this.fb.control('or', [Validators.required]),
      name: this.fb.control('', [Validators.minLength(3)]),
      fromDate: this.fb.control((new Date()).toISOString()),
      toDate: this.fb.control((new Date()).toISOString()),
      tags: this.fb.array([]),
      amountValue: this.fb.control('', [Validators.min(1), Validators.pattern('^\\d{1,}$|(?=^.{1,}$)^\\d+\\.\\d{0,2}$')]),
      amountOp: this.fb.control('<')
    })
  }

  private patchSearchForm(): void {
    if (this.searchCriteria.tags) {
      this.tags = this.searchCriteria.tags;
    }
    this.searchForm.patchValue({
      name: this.searchCriteria?.name,
      toDate: this.searchCriteria?.toDate.toISOString(),
      fromDate: this.searchCriteria?.fromDate.toISOString(),
      amountValue: this.searchCriteria?.amount?.value,
      amountOp: this.searchCriteria?.amount?.op
    })
  }
}
