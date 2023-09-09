import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateNewTransactionComponent } from '@buxx/shared/ui/create-new-transaction';
import { AnimateInModule } from '@buxx/shared/animate-in';
import { TransactionComponent } from '@buxx/shared/ui/transaction';
import { ShowHidePasswordComponent } from '@buxx/shared/ui/show-hide-password';
import { SignInStore } from '@buxx/sign-in/data-access';
import { Provider } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CreateNewTransactionComponent,
    AnimateInModule,
    TransactionComponent,
    ReactiveFormsModule,
    ShowHidePasswordComponent,
    CommonModule
  ],
  providers: [SignInStore]
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup = new FormGroup({});
  protected readonly signInStore: SignInStore = inject(SignInStore);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly platform: Platform = inject(Platform);
  isPlatformCapacitor: boolean = this.platform.is('capacitor');

  ngOnInit(): void {
    this.initSignUpForm();
  }

  initSignUpForm(): void {
    this.signInForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required])
    });
  }

  signInWithPassword(): void {
    this.signInStore.signIn$.next({
      email: this.signInForm.get('email')?.value,
      password: this.signInForm.get('password')?.value
    });
  }

  signInWithProvider(provider: Provider): void {
    this.signInStore.signIn$.next({provider});
  }

  signUp(): void {
    this.router.navigate(['signup']).then();
  }
}
