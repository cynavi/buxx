import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authGuard } from './shared/util/guards';

const routes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./buxx/feature/buxx.component').then(m => m.BuxxComponent)
  },
  { path: 'sign-in', loadComponent: () => import('./sign-in/feature/sign-in.component').then(m => m.SignInComponent) },
  { path: 'sign-up', loadComponent: () => import('./sign-up/feature/sign-up.component').then(m => m.SignUpComponent) }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync()
  ]
};
