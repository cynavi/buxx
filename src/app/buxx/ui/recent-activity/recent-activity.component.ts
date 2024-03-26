import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RecentTransaction } from '../../../shared/model/buxx.model';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NprCurrencyPipe } from '../../../shared/util/npr-currency.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'as-recent-activity',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    MatCardModule,
    NprCurrencyPipe,
    MatTooltipModule
  ],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.scss',
})
export class RecentActivityComponent {

  transactions = input.required<RecentTransaction[]>();
}
