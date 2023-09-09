import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DogRunningComponent } from '@buxx/shared/ui/dog-running';

@Component({
  selector: 'app-loading-toolbar',
  templateUrl: './loading-toolbar.component.html',
  imports: [
    DogRunningComponent,
    IonicModule
  ],
  standalone: true
})
export class LoadingToolbarComponent {

  @Input({ required: true }) toolbarTitle!: string;
}
