import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolbarComponent } from '../../shared/ui/toolbar/feature/toolbar.component';
import { SaveTransaction, Transaction } from '../../shared/model/buxx.model';
import { BuxxStore } from '../data-access/buxx.store';
import { sub } from 'date-fns';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { supabase } from '../../../supabase/supabase';
import { AuthStore } from '../../shared/data-access/auth/auth.store';
import {MatExpansionModule} from '@angular/material/expansion';
import { API_DATA } from './transactions-mock';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './buxx.component.html',
  styleUrl: './buxx.component.scss',
  providers: [BuxxStore]
})
export class BuxxComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  transactionsObs!: Observable<Transaction[]>;
  dataSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>(API_DATA);
  readonly store = inject(BuxxStore);
  readonly authStore = inject(AuthStore);
  transactions: Transaction[] = API_DATA;
  changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
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

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
