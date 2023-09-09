import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabComponent } from '@buxx/shared/ui/tab';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { SignInComponent } from '@buxx/sign-in/feature';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { AuthStore } from '@buxx/auth/data-access';
import { Subject, takeUntil } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';
import { supabase } from '@buxx/shared/app-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    TabComponent,
    IonicModule,
    DatePipe,
    CommonModule,
    SignInComponent
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly bnIdle: BnNgIdleService = inject(BnNgIdleService);
  private readonly alertController: AlertController = inject(AlertController);
  private readonly router: Router = inject(Router);
  private readonly authStore: AuthStore = inject(AuthStore);
  private unsubscribe: Subject<void> = new Subject<void>();
  private timeoutAlert: HTMLIonAlertElement | null = null;

  ngOnInit(): void {
    this.bnIdle.startWatching(30 * 60 * 1000)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async (res: boolean): Promise<void> => {
        if (res && this.authStore.session() && !this.timeoutAlert) {
          this.showTimeoutToast().then();
        }
      });
  }

  async showTimeoutToast(): Promise<void> {
    setTimeout(() => {
      if (this.timeoutAlert) {
        this.timeoutAlert.dismiss(null, 'timeout');
      }
    }, 120000);

    this.timeoutAlert = await this.alertController.create({
      message: 'You have been inactive for 30 minutes.',
      backdropDismiss: false,
      keyboardClose: true,
      buttons: [
        {
          text: 'Stay',
          role: 'cancel'
        },
        {
          text: 'Sign Out',
          handler: () => this.signOut().then(() => this.timeoutAlert?.dismiss())
        }
      ]
    });
    this.timeoutAlert.onDidDismiss().then((data: OverlayEventDetail): void => {
      this.timeoutAlert = null;
      if (data.role === 'timeout') {
        this.signOut().then();
      }
    });
    await this.timeoutAlert.present();
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.router.navigate(['signin']).then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

