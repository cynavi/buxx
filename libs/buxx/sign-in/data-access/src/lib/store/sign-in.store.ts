import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { from, Subject, switchMap } from 'rxjs';
import {
	AuthTokenResponse,
	OAuthResponse,
	SignInWithOAuthCredentials,
	SignInWithPasswordCredentials
} from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { supabase } from '@buxx/shared/app-config';

interface SignInState {
	loaded: boolean;
	error: string | null;
}

@Injectable()
export class SignInStore {

	signIn$: Subject<SignInWithPasswordCredentials | SignInWithOAuthCredentials> = new Subject();
	private readonly router: Router = inject(Router);
	private state: WritableSignal<SignInState> = signal({
		loaded: true,
		error: null
	});
	loaded: Signal<boolean> = computed(() => this.state().loaded);
	error: Signal<String | null> = computed(() => this.state().error);

	constructor() {
		this.signIn$.pipe(
			takeUntilDestroyed(),
			switchMap(credentials => {
				this.state.set({ loaded: false, error: null });
				if (this.isSignInWithPassword(credentials)) {
					return from(supabase.auth.signInWithPassword(credentials));
				} else {
					return from(supabase.auth.signInWithOAuth(credentials));
				}
			})
		).subscribe((response: AuthTokenResponse | OAuthResponse) => {
			if (response.error) {
				this.state.set({ loaded: true, error: response.error?.message });
			} else {
				this.state.set({ loaded: true, error: null });
				this.router.navigate(['dashboard']).then();
			}
		});
	}

	private readonly isSignInWithPassword = (credentials: SignInWithPasswordCredentials | SignInWithOAuthCredentials)
		: credentials is SignInWithPasswordCredentials => 'email' in credentials && 'password' in credentials;
}
