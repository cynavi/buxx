import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimateInDirective } from './animate-in.directive';
import { ObserverService, ObserverServiceConfig } from './observer.service';

@NgModule({
  imports: [CommonModule],
  exports: [AnimateInDirective],
  declarations: [AnimateInDirective],
  providers: [ObserverService]
})
export class AnimateInModule {

  // constructor(@Optional() @SkipSelf() parentModule: AnimateInModule) {
  //   if (parentModule) {
  //     throw new Error('AnimateInModule is already loaded. Import it in the AppModule only');
  //   }
  // }

  public static forRoot(config?: ObserverServiceConfig): ModuleWithProviders<any> {
    return {
      ngModule: AnimateInModule,
      providers: [{ provide: ObserverServiceConfig, useValue: config }]
    };
  }
}
