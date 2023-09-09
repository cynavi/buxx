import { Component, ContentChild } from '@angular/core';
import { IonicModule, IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ShowHidePasswordComponent {

  @ContentChild(IonInput) input!: IonInput;

  showPassword = false;

  toggleShow(): void {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
