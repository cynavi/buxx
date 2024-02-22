import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthResponse, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/supabase';

type SignUpState = {
  loaded: boolean;
  error: string | null;
}

@Injectable()
export class SignUpStore {

  private readonly router = inject(Router);
  private state: WritableSignal<SignUpState> = signal({
    loaded: true,
    error: null
  });
  signUp$: Subject<SignUpWithPasswordCredentials> = new Subject();
  loaded: Signal<boolean> = computed(() => this.state().loaded);
  error: Signal<string | null> = computed(() => this.state().error);

  constructor() {
    this.signUp$.pipe(
      takeUntilDestroyed(),
      switchMap((credentials: SignUpWithPasswordCredentials) => {
        this.state.set({loaded: false, error: null});
        return supabase.auth.signUp(credentials);
      })
    ).subscribe((response: AuthResponse): void => {
      if (response.data.user) {
        // ToastUtil.open('Sign Up successful. Confirm your email to continue.', this.toastController).then();
        this.state.set({ loaded: true, error: null });
        this.router.navigate(['sign-in']).then();
      }
      if (response.error) {
        this.state.set({ loaded: true, error: response.error?.message });
      }
    });
  }
}