import { ToastController } from '@ionic/angular';

export class ToastUtil {

  static async open(message: string, toastController: ToastController): Promise<void> {
    const toast: HTMLIonToastElement = await toastController.create({
      message,
      duration: 5000,
      position: 'bottom'
    });
    await toast.present();
  }
}
