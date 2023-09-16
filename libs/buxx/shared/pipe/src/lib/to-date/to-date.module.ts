import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToDate } from './to-date.pipe';

@NgModule({
  declarations: [ToDate],
  imports: [DatePipe],
  exports: [ToDate],
  providers: [DatePipe]
})
export class ToDateModule {
}
