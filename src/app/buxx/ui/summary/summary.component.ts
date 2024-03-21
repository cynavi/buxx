import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Summary } from '../../../shared/model/buxx.model';
import { NgClass } from '@angular/common';
import { NprCurrencyPipe } from '../../../shared/util/npr-currency.pipe';

@Component({
  selector: 'as-summary',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgClass, NprCurrencyPipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  summary = input.required<Summary>();
  loaded = input.required<boolean>();
}
