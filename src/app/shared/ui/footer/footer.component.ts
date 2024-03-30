import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'as-footer',
  standalone: true,
  imports: [CommonModule, MatAnchor, MatToolbar, MatToolbarRow],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
