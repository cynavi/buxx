import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpStore } from '../data-access/sign-up.store';
import { NgClass } from '@angular/common';
import { CustomErrorStateMatcher } from '../../shared/util/custom-error-state-matcher';
import { Router } from '@angular/router';

/**
 * ^                                        Match the beginning of the string <br />
 * (?=.*\d)                                 Require that at least one digit appear anywhere in the string <br />
 * (?=.*[a-z])                              Require that at least one lowercase letter appear anywhere in the string <br />
 * (?=.*[A-Z])                              Require that at least one uppercase letter appear anywhere in the string <br />
 * (?=.*[a-zA-Z])                           Require that at least one special character appear anywhere in the string <br />
 * .{8,}                                    The password must be at least 8 characters long <br />
 */
const PASSWORD_PATTERN = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$';

@Component({
  selector: 'as-data-access',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    NgClass
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [SignUpStore]
})
export class SignUpComponent {

  readonly signUpStore = inject(SignUpStore);
  signUpForm: FormGroup = new FormGroup<any>({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
    name: new FormControl<string | null>(null, [Validators.required, Validators.min(1)])
  });
  matcher = new CustomErrorStateMatcher();
  hide = true;
  private readonly router = inject(Router);

  get email(): FormControl {
    return this.signUpForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.signUpForm.get('password') as FormControl;
  }

  signUp(): void {
    this.signUpStore.signUp$.next({
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      options: {
        data: { name: this.signUpForm.value.name }
      }
    });
  }

  signIn(): void {
    this.router.navigate(['sign-in']);
  }
}
