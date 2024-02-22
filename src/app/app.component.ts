import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/feature/sign-in.component';

@Component({
  standalone: true,
  imports: [RouterModule, SignInComponent],
  selector: 'buxx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
