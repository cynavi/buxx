import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'toDate'
})
export class ToDate implements PipeTransform {

  private readonly datePipe: DatePipe = inject(DatePipe);

  transform(date: string | Date, format?: string): string | null {
    if (typeof date === 'string') {
      return this.datePipe.transform(new Date(date), format);
    } else {
      return this.datePipe.transform(date, format);
    }
  }
}
