import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { supabase } from '../../../supabase/supabase';
import { AuthStore } from '../data-access/auth/auth.store';

export const authGuard = async (): Promise<boolean> => {
  const router: Router = inject(Router);
  const authStore = inject(AuthStore);
  const session = (await supabase.auth.getSession()).data?.session;
  authStore.setSession$.next(session);
  return session ? true : router.navigate(['sign-in']);
};
