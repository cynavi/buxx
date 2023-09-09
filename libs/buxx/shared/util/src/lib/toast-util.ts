import { ToastController } from '@ionic/angular';
import { inject } from '@angular/core';

export class ToastUtil {

  static async open(message: string): Promise<void> {
    const toastController: ToastController = inject(ToastController)
    const toast: HTMLIonToastElement = await toastController.create({
      message,
      duration: 5000,
      position: 'bottom'
    });
    await toast.present();
  }
}
