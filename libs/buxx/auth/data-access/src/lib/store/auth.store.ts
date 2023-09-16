import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { supabase } from '@buxx/shared/app-config';

interface AuthState {
  event: AuthChangeEvent;
  session: Session | null;
}

@Injectable()
export class AuthStore {

  private state: WritableSignal<AuthState> = signal({
    event: 'INITIAL_SESSION',
    session: null,
  });
  private refreshSessionTimeout!: NodeJS.Timeout;
  session: Signal<Session | null> = computed(() => this.state().session);

  constructor() {
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null): void => {
      this.state.set({ event, session });
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.refreshSessionTimeout = setTimeout((): void => {
          supabase.auth.getSession().then();
        }, (session?.expires_in! * 100) - 120 * 100); // Refresh session before 2 min token expiration
      } else {
        if (this.refreshSessionTimeout) {
          clearTimeout(this.refreshSessionTimeout);
        }
      }
    });
  }
}
