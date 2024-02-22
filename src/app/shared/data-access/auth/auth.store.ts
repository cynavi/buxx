import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { supabase } from '../../../../supabase/supabase';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type AuthState = {
  event: AuthChangeEvent;
  session: Session | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private state: WritableSignal<AuthState> = signal({
    event: 'INITIAL_SESSION',
    session: null,
  });
  private refreshSessionTimeout!: NodeJS.Timeout;
  session: Signal<Session | null> = computed(() => this.state().session);

  setSession$: Subject<Session | null> = new Subject<Session | null>();

  constructor() {
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null): void => {
      this.state.set({ event, session });
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          this.refreshSessionTimeout = setTimeout((): void => {
            supabase.auth.getSession().then();
          }, (session.expires_in! * 100) - 120 * 100); // Refresh session before 2 min token expiration
        }
      } else {
        if (this.refreshSessionTimeout) {
          clearTimeout(this.refreshSessionTimeout);
        }
      }
    });

    this.setSession$.pipe(takeUntilDestroyed())
      .subscribe(session => this.state.update(state => ({...state, session})));
  }
}