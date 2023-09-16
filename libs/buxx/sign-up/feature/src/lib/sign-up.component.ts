import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { DatePipe, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PositiveNumberOnlyDirective } from '@buxx/shared/directive';
import { ShowHidePasswordComponent } from '@buxx/shared/ui/show-hide-password';
import { supabase } from '@buxx/shared/app-config';
import { ToastUtil } from '@buxx/shared/util';

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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    IonicModule,
    DatePipe,
    NgForOf,
    PositiveNumberOnlyDirective,
    ReactiveFormsModule,
    ShowHidePasswordComponent
  ],
  standalone: true
})
export class SignUpComponent implements OnInit {

  readonly INVALID_PASSWORD_MESSAGE = 'Password must be at least 8 length with one ' +
    'uppercase letter, one lowercase letter, one digit and one special character.';
  signUpForm: FormGroup = new FormGroup({});
  errMessage: string | null = null;
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly toastController = inject(ToastController);

  ngOnInit(): void {
    this.initSignUpForm();
  }

  initSignUpForm(): void {
    this.signUpForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.pattern(PASSWORD_PATTERN)]),
      name: this.fb.control('', [Validators.required, Validators.min(1)])
    });
  }

  async signUp(): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
      options: {
        data: {
          name: this.signUpForm.get('name')?.value
        }
      }
    });
    if (data.user) {
      ToastUtil.open('Sign Up successful. Confirm your email to continue.', this.toastController).then();
      this.router.navigate(['signin']).then();
    }
    if (error?.message) {
      this.errMessage = error.message;
    }
  }

  signIn(): void {
    this.router.navigate(['signin']).then();
  }
}
