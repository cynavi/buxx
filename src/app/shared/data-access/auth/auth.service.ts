import {Injectable} from '@angular/core';
import {AuthState} from './auth.store';
import {supabase} from '../../../../supabase/supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private refreshSessionTimeout!: NodeJS.Timeout;

  silentRefreshIfNeeded(auth: AuthState): void {
    if (auth.event === 'SIGNED_IN' || auth.event === 'TOKEN_REFRESHED') {
      if (auth.session) {
        this.refreshSessionTimeout = setTimeout((): void => {
          supabase.auth.getSession().then();
        }, (auth.session.expires_in! * 100) - 120 * 100); // Refresh session before 2 min token expiration
      }
    } else {
      if (this.refreshSessionTimeout) {
        clearTimeout(this.refreshSessionTimeout);
      }
    }
  }
}
