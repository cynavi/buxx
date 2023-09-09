import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { supabase } from '@buxx/shared/app-config';
import { AuthStore } from '@buxx/auth/data-access';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tab.component.html'
})
export class TabComponent {

  private readonly router: Router = inject(Router);
  private readonly menuCtrl: MenuController = inject(MenuController);
  protected authStore: AuthStore = inject(AuthStore);

  openMenu(): void {
    this.menuCtrl.enable(true, 'menu')
      .then((): Promise<void> =>  this.menuCtrl.open('menu').then());
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut().then((): void => {
      this.router.navigate(['signin']).then();
    });
  }
}
