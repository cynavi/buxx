import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Summary } from '../../../shared/model/buxx.model';

@Component({
  selector: 'as-summary',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  summary = input.required<Summary>();
}