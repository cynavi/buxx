import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { authGuard, signUpGuard } from '@buxx/shared/util';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthStore } from '@buxx/auth/data-access';
import { ExpenseStore } from '@buxx/expense/data-access';
import { IncomeStore } from '@buxx/income/data-access';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@buxx/dashboard/feature').then(m => m.DashboardComponent)
  },
  {
    path: 'signup',
    canActivate: [signUpGuard],
    loadComponent: () => import('@buxx/sign-up/feature').then(m => m.SignUpComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('@buxx/sign-in/feature').then(m => m.SignInComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('@buxx/dashboard/feature').then(m => m.DashboardComponent)
  },
  {
    path: 'expense',
    canActivate: [authGuard],
    loadComponent: () => import('@buxx/expense/feature').then(m => m.ExpenseComponent)
  },
  {
    path: 'income',
    canActivate: [authGuard],
    loadComponent: () => import('@buxx/income/feature').then(m => m.IncomeComponent)
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      IonicModule.forRoot(),
      ModalController
    ),
    BnNgIdleService,
    AuthStore,
    ExpenseStore,
    IncomeStore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
};
