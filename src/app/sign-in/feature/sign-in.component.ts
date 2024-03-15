import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignInStore } from '../data-access/sign-in.store';
import { CustomErrorStateMatcher } from '../../shared/util/custom-error-state-matcher';
import { Router } from '@angular/router';

@Component({
  selector: 'as-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [SignInStore],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  matcher = new CustomErrorStateMatcher();
  readonly signInStore = inject(SignInStore);
  signInForm: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  private readonly router = inject(Router);
  hide = true;

  get email(): FormControl {
    return this.signInForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.signInForm.get('password') as FormControl;
  }

  signIn(): void {
    this.signInStore.signIn$.next({
      email: this.email.value,
      password: this.password.value
    });
  }

  signUp(): void {
    this.router.navigate(['sign-in']);
  }
}
