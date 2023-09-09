import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { supabase } from '@buxx/shared/app-config';

export const authGuard = async (): Promise<boolean> => {
	const router: Router = inject(Router);
	return !!(await supabase.auth.getSession()).data?.session
		? true
		: router.navigate(['signin']);
};

export const signUpGuard = async (): Promise<boolean> => {
	const router: Router = inject(Router);
	return !!(await supabase.auth.getSession()).data?.session
		? router.navigate(['dashboard'])
		: true;
};
